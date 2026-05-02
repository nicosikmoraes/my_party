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

      fs.mkdirSync("./ai/output", { recursive: true });

      const outputPath = `./ai/output/output-${taskName}.md`;
      fs.writeFileSync(outputPath, text);

      console.log(`💾 Output salvo em: ${outputPath}`);

      console.log("\n📦 Preview output:");
      console.log(text.slice(0, 500));

      if (shouldApply) {
        const branch = `ai/${taskName}-${Date.now()}`;

        console.log("\n🔄 Voltando para main...");
        execSync("git checkout main", { stdio: "inherit" });

        console.log("⬇️ Atualizando repo...");
        execSync("git pull", { stdio: "inherit" });

        console.log(`🌿 Criando branch: ${branch}`);
        execSync(`git checkout -b ${branch}`, { stdio: "inherit" });

        console.log("\n⚙️ Criando apenas arquivos novos...");
        applyCreatesOnly(text);

        console.log(
          "\n📌 Alterações manuais, se existirem, ficaram no output:",
        );
        console.log(outputPath);

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
          `gh pr create --title "AI: ${taskName}" --body "Gerado automaticamente pela IA. Arquivos existentes devem ser revisados manualmente no output em ${outputPath}."`,
          { stdio: "inherit" },
        );

        console.log("✅ PR criado com sucesso!");
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
