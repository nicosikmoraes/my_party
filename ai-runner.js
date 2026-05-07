import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERRO: GEMINI_API_KEY não encontrada no .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const taskName = process.argv[2];
const shouldApply = process.argv.includes("--apply");

const gitArg = process.argv.find((arg) => arg.startsWith("--git="));
const gitMode = gitArg ? gitArg.replace("--git=", "") : "pr";

const VALID_GIT_MODES = ["none", "commit", "pr"];

if (!taskName) {
  console.log(
    "⚠️ Uso: node ai-runner.js nome-da-task [--apply] [--git=none|commit|pr]",
  );
  process.exit(1);
}

if (!VALID_GIT_MODES.includes(gitMode)) {
  console.error(
    "❌ Modo de git inválido. Use: --git=none, --git=commit ou --git=pr",
  );
  process.exit(1);
}

const frontendComponents = fs.existsSync("./ai/frontend-components.md")
  ? fs.readFileSync("./ai/frontend-components.md", "utf-8")
  : "";

const ALLOWED_PATHS = ["backend/", "frontend/"];

function cleanContent(content) {
  return content
    .replace(/```[a-zA-Z]*\n?/g, "")
    .replace(/```/g, "")
    .trim();
}

function normalizePath(filePath) {
  filePath = filePath.trim();

  if (
    filePath.startsWith("app/") ||
    filePath.startsWith("routes/") ||
    filePath.startsWith("database/")
  ) {
    return `backend/${filePath}`;
  }

  if (
    filePath.startsWith("screens/") ||
    filePath.startsWith("components/") ||
    filePath.startsWith("services/") ||
    filePath.startsWith("hooks/") ||
    filePath.startsWith("utils/") ||
    filePath.startsWith("templates/") ||
    filePath.startsWith("types/") ||
    filePath.startsWith("app/")
  ) {
    return `frontend/${filePath}`;
  }

  return filePath;
}

function isAllowedPath(filePath) {
  return ALLOWED_PATHS.some((path) => filePath.startsWith(path));
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractBlocks(output, marker) {
  const escapedMarker = escapeRegExp(marker);

  const regex = new RegExp(
    `${escapedMarker}\\s*([^\\n]+)\\n([\\s\\S]*?)(?=\\n#\\s*(?:CREATE|MANUAL_UPDATE):|$)`,
    "g",
  );

  const blocks = [];
  let match;

  while ((match = regex.exec(output)) !== null) {
    const filePath = match[1].trim();
    const content = cleanContent(match[2]);

    if (!filePath || !content) continue;

    blocks.push(`${marker} ${filePath}\n${content}`);
  }

  return blocks;
}

function saveSeparatedOutputs(output, taskName) {
  fs.mkdirSync("./ai/output", { recursive: true });

  const rawOutputPath = `./ai/output/raw-${taskName}.md`;
  const createOutputPath = `./ai/output/creates-${taskName}.md`;
  const manualOutputPath = `./ai/output/manual-updates-${taskName}.md`;

  const createBlocks = extractBlocks(output, "# CREATE:");
  const manualUpdateBlocks = extractBlocks(output, "# MANUAL_UPDATE:");

  const createBlocksText =
    createBlocks.length > 0
      ? createBlocks.join("\n\n")
      : "Nenhum arquivo novo foi sugerido.";

  const manualBlocksText =
    manualUpdateBlocks.length > 0
      ? manualUpdateBlocks.join("\n\n")
      : "Nenhuma alteração manual foi sugerida.";

  fs.writeFileSync(rawOutputPath, output);
  fs.writeFileSync(createOutputPath, createBlocksText);
  fs.writeFileSync(manualOutputPath, manualBlocksText);

  return {
    rawOutputPath,
    createOutputPath,
    manualOutputPath,
    createBlocksText,
    manualBlocksText,
  };
}

function applyCreatesOnly(output) {
  if (!output.includes("# CREATE:")) {
    console.log("⚠️ Nenhum arquivo novo para criar automaticamente.");
    return;
  }

  const blocks = output.split("# CREATE:");

  for (const block of blocks) {
    if (!block.trim()) continue;

    const lines = block.split("\n");

    let filePath = lines[0].trim();
    let content = lines.slice(1).join("\n");

    filePath = normalizePath(filePath);
    content = cleanContent(content);

    if (!filePath) continue;

    if (!isAllowedPath(filePath)) {
      console.log(`⚠️ Ignorado fora do escopo: ${filePath}`);
      continue;
    }

    if (fs.existsSync(filePath)) {
      console.log(`⚠️ Arquivo já existe. Não será sobrescrito: ${filePath}`);
      continue;
    }

    try {
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(filePath, content);

      console.log(`✅ Criado: ${filePath}`);
    } catch (err) {
      console.log(`❌ Erro ao criar ${filePath}: ${err.message}`);
    }
  }
}

function runCommand(command) {
  execSync(command, { stdio: "inherit" });
}

function readCommand(command) {
  return execSync(command).toString().trim();
}

function hasGitChanges() {
  return readCommand("git status --porcelain").length > 0;
}

function getGitDiff() {
  try {
    return execSync("git diff -- . ':!backend/giftdb'", {
      encoding: "utf-8",
      maxBuffer: 1024 * 1024 * 20,
    });
  } catch {
    return "";
  }
}

function ensureCleanWorkingTreeForGitFlow() {
  const status = readCommand("git status --porcelain");

  if (!status) return;

  console.log("❌ Existem mudanças locais antes de criar branch:");
  console.log(status);
  console.log("\nResolva antes de rodar com --git=commit ou --git=pr.");
  console.log(
    "Dica: se for só o banco local, coloque backend/giftdb no .gitignore e rode git rm --cached backend/giftdb.",
  );
  process.exit(1);
}

function prepareGitFlow() {
  if (gitMode === "none") {
    console.log(
      "🧪 Modo git=none: aplicando na branch atual, sem commit e sem PR.",
    );
    return null;
  }

  ensureCleanWorkingTreeForGitFlow();

  const branch = `ai/${taskName}-${Date.now()}`;

  console.log("\n🔄 Voltando para main...");
  runCommand("git checkout main");

  console.log("⬇️ Atualizando repo...");
  runCommand("git pull");

  console.log(`🌿 Criando branch: ${branch}`);
  runCommand(`git checkout -b ${branch}`);

  return branch;
}

function runCodex(prompt, outputPath) {
  fs.mkdirSync("./ai/output", { recursive: true });

  const tempPromptPath = `./ai/output/codex-prompt-${taskName}-${Date.now()}.md`;
  fs.writeFileSync(tempPromptPath, prompt);

  const command = `codex exec -C . -s workspace-write -o ${outputPath} - < ${tempPromptPath}`;

  console.log(`\n🤖 Rodando Codex...`);
  runCommand(command);

  fs.rmSync(tempPromptPath, { force: true });
}

function runCodexManualUpdates({ manualOutputPath, taskPath }) {
  const manualUpdates = fs.readFileSync(manualOutputPath, "utf-8");

  if (
    !manualUpdates.trim() ||
    manualUpdates.includes("Nenhuma alteração manual foi sugerida.")
  ) {
    console.log("⚠️ Nenhuma alteração manual para o Codex aplicar.");
    return;
  }

  const task = fs.readFileSync(taskPath, "utf-8");
  const rules = fs.readFileSync("./ai/rules.md", "utf-8");

  const prompt = `
Você é o Codex atuando dentro deste repositório.

Sua responsabilidade:
- Aplicar alterações em arquivos existentes com segurança.
- NÃO criar branch.
- NÃO fazer commit.
- NÃO fazer push.
- NÃO abrir Pull Request.
- NÃO reescrever arquivos inteiros sem necessidade.
- Preservar código existente.
- Alterar apenas o necessário para cumprir a task.
- Respeitar a arquitetura do projeto.
- Reutilizar componentes e services existentes.
- Não mexer em backend/giftdb.
- Não alterar arquivos fora de backend/ e frontend/, exceto se for indispensável para a task.

# TASK ORIGINAL

${task}

# REGRAS DO PROJETO

${rules}

# ALTERAÇÕES MANUAIS GERADAS PELO GEMINI

${manualUpdates}

Aplique essas alterações diretamente nos arquivos existentes.
Depois responda de forma curta listando o que foi alterado.
`;

  const outputPath = `./ai/output/codex-apply-${taskName}.md`;
  runCodex(prompt, outputPath);

  console.log(`📝 Resultado do Codex salvo em: ${outputPath}`);
}

function runCodexReview({ taskPath }) {
  const task = fs.readFileSync(taskPath, "utf-8");
  const diff = getGitDiff();

  if (!diff.trim()) {
    console.log("⚠️ Sem diff para revisar com Codex.");
    return;
  }

  const prompt = `
Você é o Codex revisando as alterações feitas neste repositório.

Sua responsabilidade:
- Revisar o diff atual.
- Corrigir bugs óbvios de import, path, tipo, JSX, sintaxe, rota e integração.
- Não mudar o escopo da task.
- Não reescrever arquivos inteiros sem necessidade.
- Não fazer commit.
- Não fazer push.
- Não abrir Pull Request.
- Não mexer em backend/giftdb.

# TASK ORIGINAL

${task}

# DIFF ATUAL

${diff}

Revise e corrija diretamente os arquivos se encontrar problemas.
Depois responda resumindo o que foi revisado/corrigido.
`;

  const outputPath = `./ai/output/codex-review-${taskName}.md`;
  runCodex(prompt, outputPath);

  console.log(`🔎 Revisão do Codex salva em: ${outputPath}`);
}

function commitChanges() {
  if (!hasGitChanges()) {
    console.log("⚠️ Nenhuma mudança foi criada. Commit não será feito.");
    return false;
  }

  runCommand("git add .");
  runCommand(`git commit -m "AI: ${taskName}"`);

  return true;
}

function createPullRequest(branch, prBodyPath) {
  runCommand(`git push origin ${branch}`);

  console.log("🚀 Criando Pull Request...");

  runCommand(
    `gh pr create --title "AI: ${taskName}" --body-file ${prBodyPath}`,
  );

  console.log("✅ PR criado com sucesso!");
}

function buildPrompt({ system, context, rules, task }) {
  return `
${system}

${context}

${rules}

${frontendComponents}

# TASK
${task}

# FLUXO HÍBRIDO GEMINI + CODEX

Você é o Gemini nesta etapa.

Responsabilidades do Gemini:
- Criar somente arquivos novos com # CREATE.
- Para arquivos existentes, NÃO reescrever o arquivo completo.
- Para arquivos existentes, usar apenas # MANUAL_UPDATE com instruções objetivas.
- O Codex aplicará as alterações manuais nos arquivos existentes depois.
- O Codex também revisará os arquivos criados.

# LEMBRETE FINAL CRÍTICO

Responda APENAS usando os blocos:

# CREATE: caminho/do/arquivo.ext
conteúdo completo do arquivo novo

# MANUAL_UPDATE: caminho/do/arquivo.ext
instrução objetiva do que deve ser alterado manualmente

REGRAS:
- Use # CREATE apenas para arquivos novos.
- Use # MANUAL_UPDATE para arquivos que já existem.
- Nunca use # FILE.
- Nunca reescreva arquivos existentes.
- Nunca sobrescreva routes/api.php.
- Nunca sobrescreva services existentes.
- Nunca sobrescreva telas existentes.
- Reutilize os componentes descritos em frontend-components.md.
- Não use markdown.
- Não use blocos com crase.
- Não escreva explicações fora dos blocos.
`;
}

async function run() {
  const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash-lite",
  ];

  const taskPath = `./ai/tasks/${taskName}.md`;

  let prompt;

  try {
    const system = fs.readFileSync("./ai/system.md", "utf-8");
    const context = fs.readFileSync("./ai/context.md", "utf-8");
    const rules = fs.readFileSync("./ai/rules.md", "utf-8");
    const task = fs.readFileSync(taskPath, "utf-8");

    prompt = buildPrompt({ system, context, rules, task });
  } catch (err) {
    console.error("❌ Erro ao ler arquivos .md:");
    console.error(err.message);
    return;
  }

  for (const modelName of MODELS) {
    try {
      console.log(`\n🚀 Testando modelo: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      const start = Date.now();

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = result.response.text();
      const duration = Date.now() - start;

      console.log(`\n🔥 Modelo usado: ${modelName}`);
      console.log(`⏱️ Tempo: ${duration}ms`);

      console.log("\n📦 Preview output:");
      console.log(text.slice(0, 500));

      const {
        rawOutputPath,
        createOutputPath,
        manualOutputPath,
        createBlocksText,
      } = saveSeparatedOutputs(text, taskName);

      console.log(`\n💾 Output bruto salvo em: ${rawOutputPath}`);
      console.log(`💾 Arquivos novos salvos em: ${createOutputPath}`);
      console.log(`📝 Alterações manuais salvas em: ${manualOutputPath}`);

      if (!shouldApply) {
        console.log("\n✅ Modo preview. Nada foi aplicado.");
        return;
      }

      const branch = prepareGitFlow();

      console.log("\n⚙️ Gemini criando apenas arquivos novos...");
      applyCreatesOnly(createBlocksText);

      console.log("\n🛠️ Codex aplicando alterações em arquivos existentes...");
      runCodexManualUpdates({
        manualOutputPath,
        taskPath,
      });

      console.log("\n🔎 Codex revisando o resultado final...");
      runCodexReview({
        taskPath,
      });

      const prBody = `
Gerado automaticamente pelo fluxo híbrido Gemini + Codex.

Gemini:
- Gerou arquivos novos.
- Gerou instruções de alterações manuais.

Codex:
- Aplicou alterações em arquivos existentes.
- Revisou o diff final.

Arquivos de apoio:
- Output bruto: ${rawOutputPath}
- Arquivos novos: ${createOutputPath}
- Alterações manuais: ${manualOutputPath}
- Aplicação Codex: ./ai/output/codex-apply-${taskName}.md
- Revisão Codex: ./ai/output/codex-review-${taskName}.md
`;

      const prBodyPath = `./ai/output/pr-body-${taskName}.md`;
      fs.writeFileSync(prBodyPath, prBody);

      if (gitMode === "none") {
        console.log("\n✅ Aplicado localmente sem commit e sem PR.");
        console.log("Use git diff para revisar.");
        return;
      }

      const committed = commitChanges();

      if (!committed) return;

      if (gitMode === "commit") {
        console.log("\n✅ Branch criada e commit feito. PR não foi aberto.");
        return;
      }

      if (gitMode === "pr") {
        createPullRequest(branch, prBodyPath);
        return;
      }

      return;
    } catch (err) {
      console.log(`❌ Falhou: ${modelName}`);
      console.log(`   Motivo: ${err.message}`);
    }
  }

  console.log("\n🚨 Nenhum modelo funcionou.");
}

run();
