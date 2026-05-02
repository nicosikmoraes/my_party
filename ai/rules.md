# 📏 REGRAS OBRIGATÓRIAS

## 🧱 Arquitetura

- NÃO alterar estrutura do projeto
- NÃO misturar responsabilidades
- Frontend apenas consome API
- Backend contém regras de negócio

---

## 🔁 Reutilização

- SEMPRE reutilizar services existentes
- NÃO duplicar código
- NÃO criar lógica desnecessária

---

## 🧠 Backend (Laravel)

- Usar Controllers + Requests
- Validar TODOS os inputs
- Usar enums quando necessário
- Sempre considerar usuário autenticado

---

## 📱 Frontend (React Native)

- Usar hooks e services
- NÃO chamar API direto em components
- Manter padrão de UI existente
- Usar loading e feedback (toast)

---

## 🔐 Segurança

- Todas rotas protegidas devem usar auth:sanctum
- Nunca confiar no frontend

---

## 🎯 Código

- Código deve ser simples e legível
- Evitar overengineering
- Seguir padrão já existente

---

## 🚫 PROIBIDO

- quebrar funcionalidades existentes
- alterar contratos de API sem necessidade
- criar endpoints duplicados

---

# 📦 OUTPUT FORMAT (OBRIGATÓRIO)

Você DEVE responder EXATAMENTE neste formato:

# FILE: caminho/do/arquivo.ext

conteúdo completo do arquivo

# FILE: outro/caminho.ext

conteúdo completo

---

## ❗ REGRAS DE OUTPUT

- NÃO escrever explicações
- NÃO escrever comentários fora do código
- NÃO usar markdown (```)
- NÃO escrever texto fora do padrão
- NÃO adicionar títulos

Se não seguir o formato, a resposta será descartada.

---

# 📁 PATH RULES (OBRIGATÓRIO)

Todos os caminhos DEVEM começar com:

## Backend:

backend/

Exemplo:
backend/app/Http/Controllers/TestController.php

## Frontend:

frontend/

Exemplo:
frontend/app/screens/TestScreen.tsx

---

## ❗ REGRAS DE PATH

- NUNCA usar caminhos sem prefixo
- NUNCA usar apenas app/, routes/, screens/
- Sempre usar backend/ ou frontend/

---

# 🧠 COMPORTAMENTO ESPERADO

- Criar arquivos completos e funcionais
- Seguir arquitetura existente
- Integrar com código já existente
- Evitar código desnecessário
- Garantir que o código compile/executa

---

# ⚠️ VALIDAÇÃO FINAL

Antes de responder, verifique:

- Está usando # FILE corretamente?
- Todos os caminhos começam com backend/ ou frontend/?
- Não há texto fora do padrão?
- Não há ``` no output?

Se qualquer resposta for NÃO, corrija antes de enviar.

# 🔄 ATUALIZAÇÃO DE ARQUIVOS (CRÍTICO)

Se um arquivo já existe:

- NÃO sobrescrever o arquivo inteiro
- NÃO remover código existente
- SEMPRE manter o conteúdo atual
- APENAS adicionar ou modificar o necessário

---

## ❗ REGRAS PARA MODIFICAÇÃO

- Preservar TODAS as rotas existentes
- Preservar imports existentes
- Preservar estrutura atual
- Apenas adicionar novas linhas

---

## 🚫 PROIBIDO

- Reescrever arquivo inteiro
- Remover código existente
- Apagar rotas já existentes
