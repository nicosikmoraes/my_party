# 🧩 Componentes reutilizáveis do Frontend

Este arquivo descreve os componentes de UI já existentes no frontend.

Sempre que criar uma nova tela ou feature, a IA deve consultar este arquivo e reutilizar os componentes existentes antes de criar qualquer componente novo.

---

# 📌 Regra geral

- NÃO criar botões, inputs, selects, textos, títulos ou loadings do zero se já existir componente equivalente.
- NÃO usar `Button`, `TextInput` ou `Text` diretamente quando houver componente customizado equivalente.
- Manter o padrão visual escuro do app.
- Preferir componentes existentes para manter consistência visual.
- Criar componente novo apenas se nenhum componente existente atender ao caso.

---

# 📝 Textos

## TextComponent

Caminho provável:

`frontend/components/ui/Text.tsx`

Componente padrão para textos simples.

### Quando usar

Usar sempre que precisar renderizar textos comuns na interface.

### Props principais

- `message: string | undefined`
- `color?: string`
- `fontSize?: number`
- `fontWeight?: any`
- `opacity?: number`
- `textAlign?: any`
- `onPress?: () => void`

### Observações

- Usa fonte Roboto.
- Cor padrão: `#F8FAFC`.
- Alinhamento padrão: `center`.
- Deve ser preferido ao `Text` nativo do React Native para textos comuns.

Exemplo de uso:

<TextComponent message="Meu texto" />

---

## TitleComponent

Caminho provável:

`frontend/components/ui/Title.tsx`

Componente padrão para títulos.

### Quando usar

Usar em títulos de telas, seções e headings principais.

### Props principais

- `message: string`
- `fontSize?: number`

### Observações

- Usa fonte Julius Sans One.
- Cor padrão: `#F8FAFC`.
- Tamanho padrão: `20`.

Exemplo de uso:

<TitleComponent message="Meus Eventos" />

---

## ErrorComponent

Caminho provável:

`frontend/components/ui/Error.tsx`

Componente padrão para mensagens de erro.

### Quando usar

Usar para exibir erros de formulário, validação ou feedback textual negativo.

### Props principais

- `message: string`

### Observações

- Usa fonte Roboto.
- Cor vermelha.
- Já é utilizado internamente nos inputs.

Exemplo de uso:

<ErrorComponent message="Campo obrigatório" />

---

# 🔘 Botões

## PressableComponent

Caminho provável:

`frontend/components/ui/Pressable.tsx`

Componente padrão para botões principais.

### Quando usar

Usar para ações principais em telas e formulários.

Exemplos:

- salvar
- criar
- enviar
- confirmar
- entrar
- navegar para outra tela

### Props principais

- `message: string`
- `onPress: () => void`
- `loading?: boolean`
- `backgroundColor?: string`
- `color?: string`
- `width?: any`
- `height?: number`
- `borderRadius?: number`
- `marginTop?: number`
- `padding?: number`

### Observações

- Cor padrão de fundo: `#E65C00`.
- Altura padrão: `45`.
- Largura padrão: `100%`.
- Usa `TextComponent` internamente.
- Possui loading integrado.
- Deve ser preferido ao `Pressable` nativo para botões de ação.

Exemplo de uso:

<PressableComponent
  message="Criar"
  onPress={handleCreate}
  loading={loading}
/>

---

## IconButton

Caminho provável:

`frontend/components/ui/IconButton.tsx`

Componente padrão para botões com ícone.

### Quando usar

Usar para ações por ícone.

Exemplos:

- abrir menu
- fechar modal
- editar
- deletar
- voltar
- adicionar

### Props principais

- `icon: React.ReactNode`
- `onPress?: () => void`
- `size?: number`
- `backgroundColor?: string`
- `borderRadius?: number`
- `marginTop?: number`

### Observações

- Tamanho padrão: `45`.
- Fundo padrão: `transparent`.
- Centraliza o ícone automaticamente.
- Deve ser preferido ao criar botões manuais com ícones.

Exemplo de uso:

<IconButton
icon={<Plus size={24} color="#F8FAFC" />}
onPress={handleAdd}
/>

---

# ✍️ Inputs

## InputComponent

Caminho provável:

`frontend/components/ui/Input.tsx`

Componente padrão para inputs de texto.

### Quando usar

Usar para campos de texto simples.

Exemplos:

- nome
- email
- senha
- busca
- texto curto

### Props principais

Além das props de `TextInputProps`, aceita:

- `label?: string`
- `error?: string`
- `width?: any`
- `height?: any`
- `borderColor?: string`
- `borderError?: string`
- `borderRadius?: number`
- `marginBottom?: number`
- `backgroundColor?: string`

### Observações

- Usa `TextComponent` para label.
- Usa `ErrorComponent` para erro.
- Cor padrão de fundo: `#1A1A1A`.
- Cor padrão de foco: `#E65C00`.
- Deve ser preferido ao `TextInput` nativo.

Exemplo de uso:

<InputComponent
  label="Nome"
  value={name}
  onChangeText={setName}
  error={errors.name}
/>

---

## InputNumberComponent

Caminho provável:

`frontend/components/ui/InputNumber.tsx`

Componente padrão para inputs numéricos.

### Quando usar

Usar para campos numéricos.

Exemplos:

- preço
- quantidade
- valores
- limites numéricos

### Props principais

Além das props de `TextInputProps`, aceita:

- `label?: string`
- `error?: string`
- `width?: any`
- `height?: any`
- `borderColor?: string`
- `borderError?: string`
- `borderRadius?: number`
- `marginBottom?: number`
- `amount?: number`
- `currency?: boolean`

### Observações

- Usa `keyboardType="numeric"`.
- Quando `currency=true`, formata em BRL.
- Quando `currency=false`, limita a quantidade de dígitos usando `amount`.
- Usa `TextComponent` para label.
- Usa `ErrorComponent` para erro.
- Deve ser usado para campos numéricos em vez de `InputComponent`.

Exemplo de uso:

<InputNumberComponent
  label="Preço"
  value={price}
  onChangeText={setPrice}
  currency
/>

---

## TextAreaComponent

Caminho provável:

`frontend/components/ui/TextArea.tsx`

Componente padrão para textos longos.

### Quando usar

Usar para campos multiline.

Exemplos:

- descrição
- observações
- detalhes
- mensagens longas

### Props principais

Além das props de `TextInputProps`, aceita:

- `label?: string`
- `error?: string`
- `width?: any`
- `height?: number`
- `borderColor?: string`
- `borderError?: string`
- `borderRadius?: number`
- `marginBottom?: number`

### Observações

- Usa `multiline`.
- Usa `textAlignVertical="top"`.
- Altura padrão: `100`.
- Fundo padrão: `#1A1A1A`.
- Deve ser usado em descrições em vez de `TextInput` nativo.

Exemplo de uso:

<TextAreaComponent
  label="Descrição"
  value={description}
  onChangeText={setDescription}
/>

---

# 🔽 Selects

## Select

Caminho provável:

`frontend/components/ui/Select.tsx`

Componente padrão para select/dropdown inline com busca.

### Quando usar

Usar quando o dropdown puder abrir dentro da própria tela.

Exemplos:

- seleção de categoria
- seleção de cor
- seleção de tipo
- filtros simples

### Props principais

- `options: { label: string; value: string }[]`
- `value?: string`
- `onChange: (value: string) => void`
- `placeholder?: string`
- `error?: string`
- `width?: any`
- `label?: string`

### Observações

- Possui busca interna.
- Usa `TextComponent` para label.
- Exibe erro abaixo do campo.
- Pode gerar dropdown sobre a interface.
- Usar quando houver espaço suficiente na tela.

Exemplo de uso:

<Select
  label="Tipo"
  options={typeOptions}
  value={type}
  onChange={setType}
  placeholder="Selecione o tipo"
/>

---

## SelectModal

Caminho provável:

`frontend/components/ui/SelectModal.tsx`

Componente padrão para select em modal.

### Quando usar

Usar quando houver muitas opções ou quando o dropdown inline puder atrapalhar o layout.

Exemplos:

- seleção de tipo com várias opções
- seleção de cor
- listas maiores

### Props principais

- `options: { label: string; value: string }[]`
- `value?: string`
- `onChange: (value: string) => void`
- `placeholder?: string`
- `error?: string`
- `width?: any`
- `label?: string`

### Observações

- Abre um modal com busca.
- Fundo do modal: `#1A1A1A`.
- Usa destaque laranja `#E65C00` no item selecionado.
- Deve ser preferido quando houver muitas opções.

Exemplo de uso:

<SelectModal
  label="Cor"
  options={colorOptions}
  value={color}
  onChange={setColor}
  placeholder="Selecione uma cor"
/>

---

# ⏳ Loading

## Loading

Caminho provável:

`frontend/components/ui/Loading.tsx`

Componente padrão para estado de carregamento.

### Quando usar

Usar durante chamadas assíncronas ou carregamentos de tela.

### Props principais

- `visible?: boolean`
- `size?: "small" | "large"`
- `color?: string`

### Observações

- Renderiza overlay absoluto.
- Fundo semi-transparente.
- `visible=false` retorna `null`.
- Já é usado dentro de `PressableComponent` quando `loading=true`.

Exemplo de uso:

<Loading visible={loading} />

---

# 🎨 Padrão visual dos componentes

## Cores principais

- Fundo escuro principal: `#0F0F0F`
- Fundo de input/select/modal: `#1A1A1A`
- Laranja principal: `#E65C00`
- Texto claro: `#F8FAFC`
- Texto secundário: `#B3B3B3`
- Erro: `red`

## Fontes

- Texto comum: Roboto
- Títulos: Julius Sans One

---

# ✅ Regras para a IA ao criar telas

Ao criar uma nova tela, usar preferencialmente:

- `TitleComponent` para título principal.
- `TextComponent` para textos comuns.
- `PressableComponent` para botões principais.
- `IconButton` para botões com ícone.
- `InputComponent` para texto.
- `InputNumberComponent` para números ou moeda.
- `TextAreaComponent` para descrição.
- `Select` ou `SelectModal` para seleção.
- `Loading` para carregamento.

---

# 🚫 Proibido no frontend

- Criar botão do zero se `PressableComponent` atender.
- Criar input do zero se `InputComponent`, `InputNumberComponent` ou `TextAreaComponent` atender.
- Criar select do zero se `Select` ou `SelectModal` atender.
- Usar `Text` diretamente para textos comuns se `TextComponent` atender.
- Usar `TextInput` diretamente se já houver componente customizado adequado.
- Usar `ActivityIndicator` diretamente se `Loading` atender.
- Criar estilos fora do padrão visual escuro sem necessidade.
