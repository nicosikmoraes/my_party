# AGENTS.md — MyParty

## Project overview

This project is a React Native Expo app with a Laravel REST API.

Main folders:

- `frontend/`: React Native Expo app
- `backend/`: Laravel API
- `ai/`: AI task runner, prompts, task files and generated outputs

## Agent responsibilities

Codex is used together with Gemini.

Gemini:

- Creates new files using `# CREATE`.
- Suggests changes to existing files using `# MANUAL_UPDATE`.

Codex:

- Applies `# MANUAL_UPDATE` instructions to existing files.
- Reviews files created by Gemini.
- Reviews the final diff.
- Must not create commits, branches, pushes or pull requests.
- Must not modify `backend/giftdb`.

## General rules

- Keep the existing project structure.
- Do not rewrite entire existing files unless absolutely necessary.
- Preserve existing routes, imports, functions and components.
- Change only what is needed for the task.
- Do not touch unrelated features.
- Do not add unnecessary comments.
- Do not overengineer.

## Backend rules

Backend is Laravel.

Use:

- Controllers for HTTP entry points
- Form Requests for validation
- Models for relationships
- Enums for fixed values
- Sanctum for protected routes

Rules:

- Validate all inputs in the backend.
- Never trust the frontend.
- Protected routes must use `auth:sanctum`.
- Do not duplicate endpoints.
- Do not remove existing routes.
- Do not rewrite `backend/routes/api.php` entirely.

Important user field:

- The user's favorite color column is named `prefered_color`.
- Do not rename it to `preferred_color`, `favorite_color` or `color`.

Local database:

- Do not modify or version `backend/giftdb`.
- Do not modify or version `backend/database/database.sqlite`.

## Frontend rules

Frontend is React Native with Expo and TypeScript.

Use:

- `frontend/services/` for API calls
- `frontend/hooks/` for shared state/hooks
- `frontend/components/ui/` for reusable UI components
- `frontend/components/template/` for templates/layouts
- `expo-router` for navigation

Rules:

- Components should not call `api` directly.
- Use services for HTTP calls.
- Reuse existing UI components before creating new ones.
- Do not use raw `TextInput`, `Text`, `Pressable` or loading components if a project UI component exists.
- Keep visible user-facing text in English.

## Existing UI components

Prefer these components:

- `InputComponent`
- `InputNumberComponent`
- `TextAreaComponent`
- `Select`
- `SelectModal`
- `PressableComponent`
- `IconButton`
- `TextComponent`
- `TitleComponent`
- `Loading`
- `ErrorComponent`

Input error style:

- Use `borderError={error ? "red" : "transparent"}` for `InputComponent`.
- Keep the `error` prop for displaying the error message.

Toast style:

- Always use `showToast(message, type)`.
- Correct:
  - `showToast("Event created successfully", "success")`
  - `showToast(errorMessage, "danger")`
- Wrong:
  - `showToast("danger", errorMessage)`

Allowed toast types:

- `success`
- `danger`

## API conventions

Sanctum auth header:

`Authorization: Bearer TOKEN`

Services should usually return `response.data`.

Do not change API contracts unless the task explicitly asks.

## Events module

Event date format expected by Laravel:

`YYYY-MM-DD HH:mm:ss`

Frontend can split date and time inputs, but must send the backend format above.

Known event types:

- `party`
- `secret_friend`
- `hangout`

## Final checklist before finishing

Before finishing, Codex should check:

- Did I preserve existing code?
- Did I avoid unrelated changes?
- Did I avoid touching `backend/giftdb`?
- Did I keep user-facing text in English?
- Did I use `showToast(message, type)` correctly?
- Did I reuse existing UI components?
- Did I avoid committing, pushing, branching or opening PRs?
