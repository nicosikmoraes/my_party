# 📏 REGRAS OBRIGATÓRIAS

## 🧱 Arquitetura

- NÃO alterar a estrutura geral do projeto.
- NÃO misturar responsabilidades.
- Frontend apenas consome API.
- Backend contém regras de negócio.
- Backend fica em `backend/`.
- Frontend fica em `frontend/`.

---

## 🔁 Reutilização

- SEMPRE reutilizar services existentes.
- NÃO duplicar código.
- NÃO criar lógica desnecessária.
- NÃO criar novo service se já existir um service adequado.
- NÃO criar endpoint duplicado.

---

## 🧠 Backend Laravel

- Usar Controllers para entrada HTTP.
- Usar Requests quando houver validação de input.
- Validar todos os inputs.
- Usar enums quando necessário.
- Sempre considerar usuário autenticado quando a rota for protegida.
- Rotas protegidas devem usar `auth:sanctum`.
- Nunca confiar em dados enviados pelo frontend.

---

## 📱 Frontend React Native

- Usar hooks e services quando apropriado.
- NÃO chamar API direto em components se já existir padrão de services.
- Manter padrão visual existente.
- Usar loading quando houver chamada assíncrona.
- Usar toast/feedback quando fizer sentido.
- Sempre usar toast no formato `showToast(message, type)`, por exemplo: `showToast(errorMessage, "danger")`.
- Todas as mensagens visíveis ao usuário devem estar em inglês.
- Reutilizar componentes existentes antes de criar novos.
- Reutilizar templates/layouts existentes quando a tela seguir o padrão do app.
- Não usar componentes básicos do React Native diretamente quando houver componente customizado equivalente.
- Não adicionar comentários explicativos desnecessários no código.

---

## 🔐 Segurança

- Todas as ações protegidas dependem de usuário autenticado.
- Backend sempre valida regras de negócio.
- Frontend nunca deve ser a única camada de validação.

---

## 🎯 Código

- Código simples, legível e direto.
- Evitar overengineering.
- Seguir padrão já existente no projeto.
- Não adicionar comentários óbvios ou desnecessários.
- Não remover código existente sem solicitação explícita.

---

# 🚫 PROIBIDO

- Quebrar funcionalidades existentes.
- Alterar contratos de API sem necessidade.
- Criar endpoints duplicados.
- Sobrescrever arquivos existentes.
- Reescrever arquivos existentes inteiros.
- Apagar rotas existentes.
- Apagar imports existentes.
- Comentar código existente sem solicitação.
- Criar botões, inputs, modais ou cards do zero se já existir componente equivalente.
- Ignorar componentes reutilizáveis existentes do frontend.
- Usar `# FILE:`.

---

# 🤖 FLUXO HÍBRIDO GEMINI + CODEX

Este projeto usa dois agentes:

## Gemini

Responsável por:

- Ler a task.
- Planejar a implementação.
- Criar arquivos novos usando `# CREATE`.
- Sugerir alterações em arquivos existentes usando `# MANUAL_UPDATE`.
- NÃO alterar diretamente arquivos existentes.
- NÃO gerar arquivos existentes completos.
- NÃO sobrescrever arquivos existentes.

Gemini deve tratar arquivos existentes apenas como instruções para o Codex aplicar depois.

## Codex

Responsável por:

- Aplicar as instruções `# MANUAL_UPDATE` nos arquivos existentes.
- Alterar arquivos existentes diretamente.
- Preservar o código atual.
- Alterar apenas o necessário para cumprir a task.
- Corrigir imports, tipos, paths, JSX, rotas e integrações simples.
- Revisar os arquivos criados pelo Gemini.
- Revisar o diff final.
- NÃO criar branch.
- NÃO fazer commit.
- NÃO fazer push.
- NÃO abrir Pull Request.
- NÃO alterar `backend/giftdb`.
- NÃO alterar arquivos fora de `backend/` e `frontend/`, salvo necessidade real da task.

---

# 📦 OUTPUT FORMAT OBRIGATÓRIO PARA GEMINI

Gemini DEVE responder apenas usando os blocos abaixo:

## Para arquivos novos

Use:

# CREATE: caminho/do/arquivo.ext

conteúdo completo do arquivo novo

## Para arquivos já existentes

Use:

# MANUAL_UPDATE: caminho/do/arquivo.ext

instrução objetiva do que deve ser adicionado, removido ou alterado manualmente

---

# 📁 PATH RULES

Todos os caminhos devem começar com `backend/` ou `frontend/`.

Exemplos corretos:

# CREATE: backend/app/Http/Controllers/TestController.php

# CREATE: frontend/app/(auth)/TestScreen.tsx

# MANUAL_UPDATE: backend/routes/api.php

# MANUAL_UPDATE: frontend/services/api.ts

Exemplos proibidos:

# CREATE: app/Http/Controllers/TestController.php

# CREATE: routes/api.php

# CREATE: app/screens/TestScreen.tsx

# FILE: backend/routes/api.php

---

# 🔄 REGRAS PARA ARQUIVOS EXISTENTES

Se um arquivo já existe:

- Gemini NÃO deve usar `# CREATE`.
- Gemini NÃO deve reescrever o arquivo inteiro.
- Gemini NÃO deve sobrescrever o arquivo.
- Gemini deve usar apenas `# MANUAL_UPDATE`.
- Gemini deve descrever exatamente o trecho que deve ser adicionado ou alterado.
- Codex aplicará essa alteração no arquivo existente.
- Codex deve preservar todo o código existente.
- Codex deve preservar todas as rotas existentes.
- Codex deve preservar todos os imports existentes, exceto quando precisar adicionar novos imports.

---

# 🛣️ REGRAS ESPECIAIS PARA ROTAS

Para `backend/routes/api.php`:

- Gemini nunca deve gerar o arquivo inteiro.
- Gemini nunca deve sobrescrever o arquivo.
- Gemini deve usar apenas `# MANUAL_UPDATE: backend/routes/api.php`.
- Informar somente:
  - import necessário, se houver;
  - rota nova a ser adicionada;
  - onde a rota deve entrar.

Exemplo:

# MANUAL_UPDATE: backend/routes/api.php

Adicionar o import:
use App\Http\Controllers\TestController;

Dentro do grupo `Route::middleware('auth:sanctum')->group(function () { ... })`, adicionar:
Route::get('/test/reversed-name', [TestController::class, 'reversedName']);

Codex deve aplicar essa alteração sem apagar rotas existentes.

---

# 🧩 REGRAS PARA SERVICES EXISTENTES

Para services já existentes no frontend:

- Gemini nunca deve sobrescrever o arquivo inteiro.
- Gemini deve usar apenas `# MANUAL_UPDATE`.
- Gemini deve informar somente a função nova ou o trecho necessário.
- Codex deve aplicar a alteração preservando funções existentes.
- Não adicionar comentários explicativos.
- Não alterar funções existentes sem solicitação explícita.

---

## 🔔 Toasts e feedback

- Sempre que usar toast, seguir exatamente este formato:

showToast(message, type)

Exemplos corretos:

showToast("Event created successfully", "success");
showToast(errorMessage, "danger");

- O primeiro parâmetro sempre deve ser a mensagem.
- O segundo parâmetro sempre deve ser o tipo da mensagem.
- Tipos permitidos:
  - "success"
  - "danger"

- Nunca inverter a ordem dos parâmetros.
- Nunca usar:
  showToast("danger", errorMessage);

- Mensagens exibidas para o usuário devem ser escritas em inglês.
- Erros de validação, sucesso, loading, empty states, labels, placeholders e botões também devem estar em inglês.

---

# 🖥️ REGRAS PARA TELAS EXISTENTES

Para telas existentes:

- Gemini nunca deve sobrescrever o arquivo inteiro.
- Gemini deve usar apenas `# MANUAL_UPDATE`.
- Gemini deve informar exatamente o botão, import, estado, função ou navegação a adicionar.
- Codex deve aplicar a alteração preservando layout e lógica existentes.
- Não remover código existente sem necessidade.

---

# 🆕 REGRAS PARA ARQUIVOS NOVOS

Para arquivos novos:

- Gemini pode usar `# CREATE`.
- O arquivo deve ser completo e funcional.
- O arquivo deve seguir os padrões do projeto.
- O arquivo deve usar imports corretos.
- O arquivo deve usar componentes reutilizáveis existentes.
- Codex poderá revisar e corrigir pequenos problemas depois.

---

# 🧪 REGRAS DE REVISÃO DO CODEX

Ao revisar o diff final, Codex deve verificar:

- imports quebrados;
- paths errados;
- tipos TypeScript inconsistentes;
- JSX inválido;
- rotas faltando;
- controllers sem import;
- models sem relacionamento necessário;
- services retornando formato incompatível;
- componentes chamando API diretamente;
- uso incorreto de toast;
- uso incorreto de campos reais do banco;
- código que sobrescreveu algo sem necessidade.

Codex pode corrigir esses problemas diretamente.

Codex NÃO deve:

- mudar escopo da task;
- refatorar partes não relacionadas;
- criar nova arquitetura sem pedido;
- mexer no banco SQLite local;
- criar commit;
- abrir PR;
- fazer push.

---

# 🧠 COMPORTAMENTO ESPERADO

- Gemini cria automaticamente apenas arquivos novos.
- Gemini instrui alterações em arquivos existentes.
- Codex aplica alterações em arquivos existentes.
- Codex revisa o resultado final.
- Integrar com código já existente.
- Evitar código desnecessário.
- Garantir que o código seja coerente com Laravel, Sanctum, React Native e Expo Router.
- Ao criar novas telas/features no frontend, usar os componentes já existentes do projeto para botões, inputs, modais, cards, containers e feedback visual.

---

# ⚠️ VALIDAÇÃO FINAL DO GEMINI

Antes de responder, Gemini deve verificar:

- Usei somente `# CREATE:` ou `# MANUAL_UPDATE:`?
- Não usei `# FILE:`?
- Todos os caminhos começam com `backend/` ou `frontend/`?
- Arquivos existentes foram tratados com `# MANUAL_UPDATE`?
- Não usei markdown com crases?
- Não escrevi explicações fora dos blocos?

Se qualquer resposta for NÃO, corrigir antes de enviar.

---

# ⚠️ VALIDAÇÃO FINAL DO CODEX

Antes de finalizar, Codex deve verificar:

- A task original foi cumprida?
- Os arquivos existentes foram preservados?
- Não houve remoção acidental de rotas, imports ou funções?
- O projeto continua coerente com os padrões existentes?
- Não alterou `backend/giftdb`?
- Não criou commit?
- Não criou branch?
- Não abriu PR?
- Verificar se todos os usos de showToast seguem o formato showToast(message, type).
- Verificar se textos visíveis ao usuário estão em inglês.

Se encontrar problema simples, corrigir diretamente.
