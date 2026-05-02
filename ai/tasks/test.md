# Criar tela de teste autenticada com nome invertido

## Objetivo

Criar uma funcionalidade de teste autenticada onde o backend retorna o nome do usuário autenticado invertido, e o frontend exibe esse nome em uma tela protegida.

---

## Arquivos novos que podem ser criados automaticamente

### Backend

Criar:

backend/app/Http/Controllers/TestController.php

Requisitos:

- O controller deve usar o usuário autenticado.
- Deve pegar o nome do usuário logado.
- Deve inverter o nome.
- Deve retornar JSON no formato:

{
"reversed_name": "nome invertido"
}

- Não adicionar comentários explicativos desnecessários.
- Não criar endpoint duplicado.
- Não alterar arquivos existentes.

---

### Frontend

Criar:

frontend/app/(auth)/TestScreen.tsx

Requisitos:

- A tela deve ser protegida por autenticação por estar dentro de `frontend/app/(auth)`.
- Ao iniciar, deve chamar o endpoint protegido do backend.
- Deve exibir o nome invertido retornado pela API.
- Deve usar os componentes reutilizáveis descritos em `ai/frontend-components.md`.
- Usar `TitleComponent` para o título.
- Usar `TextComponent` para exibir o nome invertido.
- Usar `Loading` durante o carregamento.
- Usar `PressableComponent` se precisar de botão de voltar ou ação.
- Não usar `Text`, `Button`, `TextInput` ou `ActivityIndicator` diretamente se houver componente customizado equivalente.
- Não chamar API diretamente no componente se existir padrão de services no projeto.
- Não adicionar comentários explicativos desnecessários.

---

## Arquivos existentes que NÃO podem ser sobrescritos

Para os arquivos abaixo, usar apenas `# MANUAL_UPDATE`.

### Backend route

Arquivo:

backend/routes/api.php

Instruir manualmente:

- Adicionar o import de `TestController`, se ainda não existir.
- Adicionar uma rota GET protegida dentro do grupo `auth:sanctum`.
- Sugestão de rota:

GET /test/reversed-name

- A rota deve chamar:

TestController@reversedName

- Não reescrever o arquivo inteiro.
- Não remover rotas existentes.
- Não comentar rotas existentes.

---

### Frontend service

Arquivo existente de services do frontend.

Instruir manualmente:

- Adicionar uma função para chamar o endpoint:

GET /test/reversed-name

- A função deve usar o padrão existente de services do projeto.
- Não reescrever o service inteiro.
- Não remover funções existentes.
- Não adicionar comentários explicativos desnecessários.

---

### Tela Events

Arquivo existente da tela events.

Instruir manualmente:

- Adicionar um botão usando `PressableComponent`.
- O botão deve ter texto semelhante a:

Ir para TestScreen

- Ao clicar, deve navegar para:

/(auth)/TestScreen

ou o caminho correto conforme padrão atual do expo-router no projeto.

- Não reescrever a tela inteira.
- Não remover código existente.
- Não alterar layout além do necessário.

---

## Formato obrigatório da resposta

Responder apenas usando:

# CREATE: caminho/do/arquivo.ext

conteúdo completo do arquivo novo

# MANUAL_UPDATE: caminho/do/arquivo.ext

instrução objetiva de alteração manual

---

## Restrições finais

- Nunca usar `# FILE`.
- Nunca sobrescrever arquivos existentes.
- Nunca reescrever `backend/routes/api.php`.
- Nunca reescrever services existentes.
- Nunca reescrever a tela events.
- Não usar markdown com crases.
- Não escrever explicações fora dos blocos.
