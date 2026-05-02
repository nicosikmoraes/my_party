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

const frontendComponents = fs.existsSync("./ai/frontend-components.md")
  ? fs.readFileSync("./ai/frontend-components.md", "utf-8")
  : "";

if (!taskName) {
  console.log("⚠️ Uso: node ai-runner.js nome-da-task [--apply]");
  process.exit(1);
}

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

  const createBlocks = extractBlocks(output, "# CREATE:");
  const manualUpdateBlocks = extractBlocks(output, "# MANUAL_UPDATE:");

  const createOutputPath = `./ai/output/creates-${taskName}.md`;
  const manualOutputPath = `./ai/output/manual-updates-${taskName}.md`;

  const createBlocksText =
    createBlocks.length > 0
      ? createBlocks.join("\n\n")
      : "Nenhum arquivo novo foi sugerido.";

  const manualBlocksText =
    manualUpdateBlocks.length > 0
      ? manualUpdateBlocks.join("\n\n")
      : "Nenhuma alteração manual foi sugerida.";

  fs.writeFileSync(createOutputPath, createBlocksText);
  fs.writeFileSync(manualOutputPath, manualBlocksText);

  return {
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

function hasGitChanges() {
  const status = execSync("git status --porcelain").toString().trim();
  return status.length > 0;
}

async function run() {
  const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash-lite",
  ];

  let prompt;

  try {
    const system = fs.readFileSync("./ai/system.md", "utf-8");
    const context = fs.readFileSync("./ai/context.md", "utf-8");
    const rules = fs.readFileSync("./ai/rules.md", "utf-8");
    const task = fs.readFileSync(`./ai/tasks/${taskName}.md`, "utf-8");

    prompt = `
${system}

${context}

${rules}

${frontendComponents}

# TASK
${task}

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

      if (!shouldApply) {
        const { createOutputPath, manualOutputPath } = saveSeparatedOutputs(
          text,
          taskName,
        );

        console.log(`\n💾 Arquivos novos salvos em: ${createOutputPath}`);
        console.log(`📝 Alterações manuais salvas em: ${manualOutputPath}`);

        return;
      }

      const branch = `ai/${taskName}-${Date.now()}`;

      console.log("\n🔄 Voltando para main...");
      execSync("git checkout main", { stdio: "inherit" });

      console.log("⬇️ Atualizando repo...");
      execSync("git pull", { stdio: "inherit" });

      console.log(`🌿 Criando branch: ${branch}`);
      execSync(`git checkout -b ${branch}`, { stdio: "inherit" });

      const { createOutputPath, manualOutputPath, createBlocksText } =
        saveSeparatedOutputs(text, taskName);

      console.log(`\n💾 Arquivos novos salvos em: ${createOutputPath}`);
      console.log(`📝 Alterações manuais salvas em: ${manualOutputPath}`);

      console.log("\n⚙️ Criando apenas arquivos novos...");
      applyCreatesOnly(createBlocksText);

      const prBody = `
Gerado automaticamente pela IA.

Arquivos novos criados automaticamente:
${createOutputPath}

Alterações manuais sugeridas:
${manualOutputPath}

Revise as alterações manuais antes de aplicar em arquivos existentes.
`;

      const prBodyPath = `./ai/output/pr-body-${taskName}.md`;
      fs.writeFileSync(prBodyPath, prBody);

      if (!hasGitChanges()) {
        console.log("⚠️ Nenhuma mudança foi criada. PR não será aberto.");
        return;
      }

      execSync("git add .", { stdio: "inherit" });

      execSync(`git commit -m "AI: ${taskName}"`, {
        stdio: "inherit",
      });

      execSync(`git push origin ${branch}`, {
        stdio: "inherit",
      });

      console.log("🚀 Criando Pull Request...");

      execSync(
        `gh pr create --title "AI: ${taskName}" --body-file ${prBodyPath}`,
        { stdio: "inherit" },
      );

      console.log("✅ PR criado com sucesso!");

      return;
    } catch (err) {
      console.log(`❌ Falhou: ${modelName}`);
      console.log(`   Motivo: ${err.message}`);
    }
  }

  console.log("\n🚨 Nenhum modelo funcionou.");
}

run();
