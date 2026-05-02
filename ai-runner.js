import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

// 🔐 valida chave
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERRO: GEMINI_API_KEY não encontrada no .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const taskName = process.argv[2];
const shouldApply = process.argv.includes("--apply");

if (!taskName) {
  console.log("⚠️ Uso: node ai-runner.js nome-da-task [--apply]");
  process.exit(1);
}

// 🔒 só permite mexer nessas pastas
const ALLOWED_PATHS = ["backend/", "frontend/"];

/* =========================
   🧹 LIMPEZA DO OUTPUT
========================= */

function cleanContent(content) {
  return content
    .replace(/```[a-zA-Z]*\n?/g, "") // remove ```php ```ts
    .replace(/```/g, "") // remove restante
    .trim();
}

/* =========================
   📁 NORMALIZA PATH
========================= */

function normalizePath(filePath) {
  filePath = filePath.trim();

  // backend (Laravel)
  if (
    filePath.startsWith("app/") ||
    filePath.startsWith("routes/") ||
    filePath.startsWith("database/")
  ) {
    return `backend/${filePath}`;
  }

  // frontend (React Native)
  if (
    filePath.startsWith("screens/") ||
    filePath.startsWith("components/") ||
    filePath.startsWith("app/screens") ||
    filePath.startsWith("app/components")
  ) {
    return `frontend/${filePath}`;
  }

  return filePath;
}

/* =========================
   ⚙️ APPLY FILES
========================= */

function applyFiles(output) {
  if (!output.includes("# FILE:")) {
    console.log("❌ IA não retornou arquivos válidos. Abortando apply.");
    return;
  }

  const blocks = output.split("# FILE:");

  blocks.forEach((block) => {
    if (!block.trim()) return;

    const lines = block.split("\n");

    let filePath = lines[0].trim();
    let content = lines.slice(1).join("\n");

    filePath = normalizePath(filePath);
    content = cleanContent(content);

    if (!filePath) return;

    // 🔒 segurança
    if (!ALLOWED_PATHS.some((p) => filePath.startsWith(p))) {
      console.log(`⚠️ Ignorado (fora do escopo): ${filePath}`);
      return;
    }

    try {
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(filePath, content);

      console.log(`✅ Criado: ${filePath}`);
    } catch (err) {
      console.log(`❌ Erro ao criar ${filePath}: ${err.message}`);
    }
  });
}

/* =========================
   🚀 MAIN
========================= */

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

# TASK
${task}

# LEMBRETE FINAL (CRÍTICO)
Responda APENAS com # FILE:

# REGRA CRÍTICA
Se for alterar arquivo existente:
- NÃO apagar conteúdo
- NÃO sobrescrever tudo
- APENAS adicionar/modificar

Especialmente em:
- routes/api.php
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

      // 💾 salva output SEMPRE
      const outputPath = `./ai/output/output-${taskName}.md`;
      fs.writeFileSync(outputPath, text);

      console.log(`💾 Output salvo em: ${outputPath}`);

      // 🔍 debug parcial
      console.log("\n📦 Preview output:");
      console.log(text.slice(0, 300));

      if (shouldApply) {
        if (!text.includes("# FILE:")) {
          console.log("❌ Resposta inválida da IA. Pulando apply.");
          return;
        }

        const branch = `ai/${taskName}-${Date.now()}`;

        console.log("\n🔄 Voltando para main...");
        execSync("git checkout main", { stdio: "inherit" });

        console.log("⬇️ Atualizando repo...");
        execSync("git pull", { stdio: "inherit" });

        console.log(`🌿 Criando branch: ${branch}`);
        execSync(`git checkout -b ${branch}`, { stdio: "inherit" });

        console.log("\n⚙️ Aplicando arquivos...");
        applyFiles(text);

        execSync("git add .", { stdio: "inherit" });

        execSync(`git commit -m "AI: ${taskName}"`, {
          stdio: "inherit",
        });

        execSync(`git push origin ${branch}`, {
          stdio: "inherit",
        });

        console.log("🚀 Criando Pull Request...");

        execSync(
          `gh pr create --title "AI: ${taskName}" --body "Gerado automaticamente pela IA"`,
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
