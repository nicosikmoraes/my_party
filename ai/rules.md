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

# 📦 OUTPUT FORMAT OBRIGATÓRIO

Você DEVE responder apenas usando os blocos abaixo:

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

- NÃO usar `# CREATE`.
- NÃO reescrever o arquivo inteiro.
- NÃO sobrescrever o arquivo.
- Usar apenas `# MANUAL_UPDATE`.
- Descrever exatamente o trecho que deve ser adicionado ou alterado.
- Preservar todo o código existente.
- Preservar todas as rotas existentes.
- Preservar todos os imports existentes.

---

# 🛣️ REGRAS ESPECIAIS PARA ROTAS

Para `backend/routes/api.php`:

- Nunca gerar o arquivo inteiro.
- Nunca sobrescrever o arquivo.
- Usar apenas `# MANUAL_UPDATE: backend/routes/api.php`.
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

---

# 🧩 REGRAS PARA SERVICES EXISTENTES

Para services já existentes no frontend:

- Nunca sobrescrever o arquivo inteiro.
- Usar apenas `# MANUAL_UPDATE`.
- Informar somente a função nova ou o trecho necessário.
- Não adicionar comentários explicativos.
- Não alterar funções existentes sem solicitação explícita.

---

# 🖥️ REGRAS PARA TELAS EXISTENTES

Para telas existentes:

- Nunca sobrescrever o arquivo inteiro.
- Usar apenas `# MANUAL_UPDATE`.
- Informar exatamente o botão, import ou navegação a adicionar.
- Preservar layout e lógica existentes.

---

# 🧠 COMPORTAMENTO ESPERADO

- Criar automaticamente apenas arquivos novos.
- Para alterações em arquivos existentes, apenas instruir a mudança manual.
- Integrar com código já existente.
- Evitar código desnecessário.
- Garantir que o código seja coerente com Laravel, Sanctum, React Native e Expo Router.
- Ao criar novas telas/features no frontend, usar os componentes já existentes do projeto para botões, inputs, modais, cards, containers e feedback visual.

---

# ⚠️ VALIDAÇÃO FINAL

Antes de responder, verifique:

- Usei somente `# CREATE:` ou `# MANUAL_UPDATE:`?
- Não usei `# FILE:`?
- Todos os caminhos começam com `backend/` ou `frontend/`?
- Arquivos existentes foram tratados com `# MANUAL_UPDATE`?
- Não usei markdown com crases?
- Não escrevi explicações fora dos blocos?

Se qualquer resposta for NÃO, corrija antes de enviar.
