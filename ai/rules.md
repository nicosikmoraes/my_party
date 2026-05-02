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
