# 📌 CONTEXTO DO SISTEMA — MYPARTY / WISHLIST SOCIAL

## 🧠 Visão Geral

Aplicação mobile/social com backend em API REST para gerenciamento de wishlist, eventos e interação entre usuários.

O sistema permite que usuários:

- criem conta e façam login;
- criem sugestões de presentes;
- editem informações pessoais;
- adicionem amigos;
- aceitem pedidos de amizade;
- visualizem amigos;
- criem eventos;
- visualizem eventos relacionados a eles.

---

# 🏗️ Arquitetura Geral

## Frontend

- React Native com Expo
- expo-router
- TypeScript
- Estrutura principal dentro de `frontend/`

Pastas importantes:

- `frontend/app/`
- `frontend/components/`
- `frontend/components/ui/`
- `frontend/services/`
- `frontend/hooks/`
- `frontend/utils/`
- `frontend/types/`
- `frontend/components/template/`

Regras:

- Componentes não devem chamar API diretamente.
- Chamadas HTTP devem ficar em `services`.
- Telas devem organizar componentes e estados.
- Componentes reutilizáveis devem ser priorizados.
- Não criar componentes nativos simples se já existir componente em `components/ui`.

---

## Backend

- Laravel
- API REST
- Laravel Sanctum para autenticação
- Estrutura principal dentro de `backend/`

Pastas importantes:

- `backend/app/Http/Controllers/`
- `backend/app/Http/Requests/`
- `backend/app/Models/`
- `backend/app/Enums/`
- `backend/routes/api.php`
- `backend/database/migrations/`

Regras:

- Backend contém regras de negócio.
- Backend valida todos os dados.
- Requests devem ser usados para validação quando fizer sentido.
- Models devem conter relacionamentos.
- Enums devem ser usados para tipos fixos.
- Rotas protegidas devem ficar dentro de `auth:sanctum`.

---

# 🔐 Autenticação

O sistema usa Laravel Sanctum.

Header usado no frontend:

Authorization: Bearer TOKEN

Rotas públicas:

- POST /register
- POST /login
- POST /forgot-password
- POST /reset-password
- POST /auth/google
- GET /gifts/type
- GET /colors

Rotas protegidas ficam dentro de:

Route::middleware('auth:sanctum')->group(function () {
...
});

---

# 👤 Usuário

Campos conhecidos do usuário:

- id
- name
- email
- password
- shirt_size
- shoe_size
- pants_size
- ring_size
- prefered_color

Observação importante:

A coluna da cor favorita no banco se chama:

prefered_color

Mesmo estando escrita diferente do inglês correto, o projeto usa esse nome. Não usar `preferred_color`, `favorite_color` ou `color` quando estiver lidando com essa coluna do usuário.

---

# 📦 Módulo Gifts

O módulo de gifts permite criar sugestões de presentes associadas ao usuário autenticado.

Campos principais:

- name obrigatório
- type obrigatório via enum
- price opcional
- quantity opcional
- description opcional
- color opcional

Endpoints conhecidos:

- GET /gifts/type
- GET /colors
- POST /gifts/create
- GET /gifts
- PATCH /gifts/{id}/purchase

Regras:

- Gift sempre pertence ao usuário autenticado.
- Validação deve ser feita no backend.
- Frontend usa services para chamadas HTTP.
- Frontend deve reutilizar componentes de UI existentes.

---

# 👥 Módulo Amizades

Tabela/estrutura de amizade:

- sender_id
- receiver_id
- status

Status conhecidos:

- pending
- accepted
- rejected

Regras:

- Usuário não pode enviar convite para si mesmo.
- Não deve duplicar convite ativo.
- Usuários viram amigos quando o status é `accepted`.
- Busca de usuários usa nome.
- Nome de usuário é único.
- Busca é exata e case insensitive.

Endpoints conhecidos:

- POST /friends/send
- GET /friends/requests
- POST /friends/{friendship}/accept
- GET /users/search
- GET /friends

---

# 🎉 Módulo Eventos

O módulo de eventos permite criar e listar eventos.

Tabela `events`:

- id
- created_by_user_id
- title
- type
- date
- address
- description
- timestamps

Tabela `event_participants`:

- id
- event_id
- user_id
- is_accepted
- timestamps

Tipos de evento esperados:

- party
- secret_friend
- hangout

Endpoints conhecidos:

- GET /events
- POST /events
- GET /events/types
- GET /events/{event}
- PUT /events/{event}
- DELETE /events/{event}
- POST /events/{event}/accept
- POST /events/{event}/decline

Regras:

- Evento é criado pelo usuário autenticado.
- Campo `created_by_user_id` indica o criador.
- Usuário só pode editar/deletar evento criado por ele.
- Usuário só deve visualizar evento criado por ele ou evento em que participa.
- O campo `date` enviado ao backend deve estar no formato:

YYYY-MM-DD HH:mm:ss

No frontend, o formulário pode separar data e hora, mas deve enviar ao backend no formato acima.

---

# 📱 Componentes de UI existentes

Antes de criar qualquer componente visual novo, verificar se já existe componente em:

frontend/components/ui/

Componentes conhecidos:

- InputComponent
- InputNumberComponent
- TextAreaComponent
- Select
- SelectModal
- PressableComponent
- IconButton
- TextComponent
- TitleComponent
- Loading
- ErrorComponent

Regras:

- Usar `InputComponent` para inputs de texto.
- Usar `TextAreaComponent` para descrição.
- Usar `SelectModal` ou `Select` para selects.
- Usar `PressableComponent` para botões.
- Usar `IconButton` para botões com ícones.
- Usar `TextComponent` para textos.
- Usar `TitleComponent` para títulos.
- Usar `Loading` para carregamento.
- Não usar `Text`, `TextInput` ou `Pressable` diretamente se já houver componente equivalente no projeto, exceto dentro de componentes base.

---

# 🎨 Padrão visual

Tema principal:

- Fundo escuro
- Cor de destaque: #E65C00
- Texto claro: #F8FAFC
- Texto secundário: #B3B3B3
- Cards/linhas escuras: #1A1A1A ou #333

Erros:

- Inputs com erro devem receber borda vermelha usando `borderError`.
- Exemplo:

borderError={errors.name ? "red" : "transparent"}

Toast:

O padrão do projeto é:

showToast("mensagem", "success")
showToast("mensagem", "danger")

Não inverter a ordem dos parâmetros.

---

# 🔁 Services

Services ficam em:

frontend/services/

Regras:

- Componentes e telas não devem chamar `api` diretamente.
- Services devem usar a instância `api`.
- Services devem retornar preferencialmente `response.data`.
- Manter contratos simples e previsíveis.

---

# 🧠 Papel do Gemini e do Codex

Este projeto usa um fluxo híbrido:

## Gemini

Responsável por:

- Planejar a solução.
- Criar arquivos novos usando `# CREATE`.
- Sugerir alterações em arquivos existentes usando `# MANUAL_UPDATE`.

Gemini não deve reescrever arquivos existentes inteiros.

## Codex

Responsável por:

- Aplicar alterações em arquivos existentes.
- Preservar código já existente.
- Corrigir imports, paths, tipos e erros simples.
- Revisar arquivos criados pelo Gemini.
- Revisar o diff final.
- Não criar branch.
- Não fazer commit.
- Não fazer push.
- Não abrir pull request.
- Não mexer em `backend/giftdb`.

---

# 🚫 Arquivos sensíveis / não versionáveis

Não alterar nem versionar banco SQLite local:

- backend/giftdb
- backend/database/database.sqlite

Esses arquivos devem ficar no `.gitignore`.

---

# 🎯 Padrões importantes

- Frontend não contém regra de negócio sensível.
- Backend valida tudo.
- Services fazem chamadas HTTP.
- Componentes são reutilizáveis.
- Evitar duplicação.
- Evitar overengineering.
- Preservar estrutura existente.
- Não remover código existente sem necessidade.
- Não alterar contratos de API sem necessidade.
- Não criar endpoints duplicados.
