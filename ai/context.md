# 📌 CONTEXTO DO SISTEMA — WISHLIST SOCIAL

## 🧠 Visão Geral

Aplicação mobile com backend em API REST para gerenciamento de wishlist e interação social.

## 🏗️ Arquitetura

### Frontend

- React Native (Expo)
- expo-router
- Estrutura:
  - components/
  - services/
  - hooks/
  - utils/
  - templates/

### Backend

- Laravel (PHP)
- Estrutura:
  - Controllers
  - Models
  - Requests (validação)
  - Enums

### Autenticação

- Laravel Sanctum (token)
- Header:
  Authorization: Bearer TOKEN

---

## 📦 Módulo Gifts

- CRUD de itens
- Sempre associado ao usuário autenticado

Campos:

- name (obrigatório)
- type (enum obrigatório)
- price, quantity, description, color (opcionais)

Regras:

- validação feita no backend
- enums obrigatórios para type e color

Endpoints:

- POST /gifts/create
- GET /gifts/user

---

## 👥 Módulo Amizades

Estrutura:

- sender_id
- receiver_id
- status (pending | accepted)

Regras:

- não pode enviar para si mesmo
- não pode duplicar convite
- vira amigo apenas quando accepted

Endpoints:

- POST /friends/request
- GET /friends/requests
- GET /users/search

---

## 🔍 Busca de usuários

- nome único
- busca exata (case insensitive)

---

## 🎯 Padrões importantes

- Frontend NÃO contém regra de negócio
- Backend valida tudo
- Services fazem chamadas HTTP
- Componentes são reutilizáveis
