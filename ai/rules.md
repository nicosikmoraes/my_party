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

# OUTPUT FORMAT (OBRIGATÓRIO)

Você DEVE responder apenas neste formato:

# FILE: caminho/do/arquivo.ext

conteúdo completo do arquivo

# FILE: outro/caminho.ext

conteúdo completo

NÃO escreva explicações.
NÃO escreva texto fora do formato.

# PATH RULES (OBRIGATÓRIO)

Backend SEMPRE começa com:
backend/

Frontend SEMPRE começa com:
frontend/

Exemplos corretos:

# FILE: backend/app/Http/Controllers/TestController.php

# FILE: frontend/app/screens/TestScreen.tsx

---

# CODE RULES

- NÃO use ``` (code block)
- NÃO use markdown
- NÃO explique nada
- APENAS código puro
