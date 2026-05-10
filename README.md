# MyParty

## Sobre o app

O MyParty é um aplicativo móvel desenvolvido com React Native utilizando Expo e Laravel, com o objetivo de facilitar a organização de presentes em eventos como aniversários, amigo secreto e Natal.

O aplicativo permite que cada usuário crie um perfil com informações úteis para escolha de presentes, como tamanho de roupas, tamanho de calçados, preferências de estilo e itens que não utiliza.

Além disso, o sistema permite a criação de eventos onde os participantes podem visualizar sugestões de presentes e interagir com essas listas de acordo com o tipo do evento.

### Funcionalidades principais

- [x] Autenticação usuário
- [x] Autenticação via google
- [x] Recuperação de senha
- [x] Amizades
- [x] Informar preferências pessoais (roupa, calçado, estilo, etc)
- [x] Lista de desejos pessoal
- [x] Criar eventos
- [x] Convidar participantes para eventos
- [ ] Adicionar sugestões de presentes
- [ ] Visualizar sugestões de presentes
- [ ] Marcar presente como comprado (modo aniversário)
- [ ] Visitar o perfil do seus amigos

### Tipos de evento

O sistema contará com dois tipos de eventos:

**Aniversário**
- O aniversariante cria o evento
- Convida participantes
- Pode adicionar sugestões de presentes
- Convidados podem marcar presentes como "comprado"

**Amigo secreto**
- Participantes adicionam sugestões de presentes
- Não é possível marcar presentes como comprados
- Lista serve apenas como guia de ideias

### Funcionalidades futuras

- [ ] Avatar dos usuários
- [ ] Sistema de sorteio automático para amigo secreto
- [ ] Customização do avatar

## Modelagem do banco

O backend do sistema vai ser feito em Laravel, sendo o banco remoto via API;

[https://app.diagrams.net/#G1jzJHRbO3KRjyWieyrtjlkKJz8P1i-LnQ#%7B%22pageId%22%3A%226xSJDgpksOZ6mtiG3P4E%22%7D
](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=GiftHelper.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22P%C3%A1gina-1%22%20id%3D%226xSJDgpksOZ6mtiG3P4E%22%3E7Z3bcts4EoafxpdyiScdLkeOnZ0ZpyoVb2p298ZFi7DECUUqJBRb8%2FQLSoQOPLmjsAmQ7qpUxYQpmkL%2F7A%2FoboBX1s3q9WPsrpefIo8FV%2BbQe72yPlyZpjU0DfFf2rLdt5iWae9bFrHv7duMY8OD%2Fw%2FLGodZ68b3WHJ2Io%2BigPvr88Z5FIZszs%2Fa3DiOXs5Pe46C87%2B6dhes0PAwd4Ni61%2B%2Bx5f71ok5Prb%2Fi%2FmLpfzLxmi6%2F83KlSdn3yRZul70ctJk3V5ZN3EU8f1Pq9cbFqS9J%2Ftl%2F7m7it8ebixmIQd9YPv1j%2F99%2FXTrsb9nNr%2F7xrzvy4FZvEp24YRvZR%2BIO1%2BnP3L3KW2aJdyNeWYqaygaROdz1w9ZLBqM3XEQuOvE352%2Bb1n6gXfvbqMNlxeSR7Nn%2F5V5X%2FaWSs8VRrsXF0sP04s%2Fi4s%2FZDeT%2FtoN%2FEUofp6LO07%2F4ixmibiXezfh2RlLvgqyH%2Fff5YcbbLLv8jVhcZK1spiz15MvnfXbRxatGI%2B34pTliWmtYWbIl6MOjEnWll1mnB1u5UcyIWYiXByufLST%2BCEz1U%2BYzSoxW415q2z5JdXjbBnF%2Fj%2BpBYOsx0%2Ftuzt%2B8VeBGwqhu16uaRbtnuydnfwguImCKBVBGIWsoIP0JC%2BO1v924wXjWcM68kO%2B6x5nJv6JDrsZXjtXjrjXG3FsHI%2FFv%2FT0mN9EYcJjobf0GkyY%2FYWlpp%2FxaJ1dNGDP8vpxZsD056eI82hVpYwLRVGtCWwR2EARWJUiEB%2Flvht8EY7TDRfB3mQ7P%2BoeTVZi19KePvRuvtvzD3Ak%2Bvg52LnCpe95TDzMs5elz9nD2p2nJ70IlrzxGH%2F%2Bsylz1Zknu9ixf376am4gfFTocvGgbEIvKdj8cJ%2BXy8DpiAyk396fO0uEsf1wcb%2F%2F5CinE6chnXwN%2Fe8b9vuHxh5u59zhN6uew9VblM9xJEMsuYQlwzZZMsJiiTmBqmCs2I0wz5fXawomdwSTg3mnXdHBmzhpQhlPQTQX3%2FdRfGr1KDqOKFIhhxFBpDMQmWJBBDqSGPUPIQSQzLbQcYRqDbSCj9BdMWJGlQTAQw1ihnJmGCYWNGSg%2F00ZTIkavaWGUZLN0FIErWCDrVw%2FIG5UiqUsaUXg0BQceYE0Bw5oEsyo1gGRo%2FPkgGbBlKugFXSs3SR5iWKKVFXrAJovI3poQI8JGj2gEUupF6JHH%2BkBDVkqV0Er9EiWfswf02oq4kelEsCZUuKHcn4cykib5wc0ein1QvzoIT9kVFR%2FFbQ0%2BxD%2BhPhRLxloqJP4oQE%2FbLSCK3AQs7oen%2FjReX6AC%2FlVq6Cl%2BUfECB%2F1ioHGOwkfGuBjjIYPcBTTJnz0Fx%2FgskvVKmgFH7G45GO4WT2xmABSJQWrbMpaz4ocF7q25NNjz%2B4m4GkRd3jZ0k9DutuapZ%2BWbZz5%2FgGa77egM0hpahoDnDunfiz%2FtKAzSEv13IEWgOJ6dOgkUrkQaAmonkMC8EpyAor6SSXaGlALvJJc9WyC5pSIzgA6p1SuAlrCo54c0PoZIocG5EBb%2BGlBa2Is1avGiRyIzgBaEqNcBa2Qw2PJPPbX3I9CAkiVFOyyqUc9Kjoejbz9wVLMXKKIQzVbTRhy0NoedDZ0umBXDxTfNfv7EYa0ofMFW3UJNYUhcV05dC6gXAgUhtRzLACdRRBQNJhMooUhbeg0wlZdU01b0aHuawqtrVeug1amk5uExY%2But%2FJD2oiuTjXQ4giCiAYQQYtIOiZQBo7qnDhFJBGdAbQyQrkKWkEI93lAyaxqEUDLIAgdGqADb0c6BxrYdFRnwIkdiN4AGtdUroJ22LFdEzoqNTAidHQJHWh70o2g6BipdhqEDkRvAEWHchW0UwghOpvQUakBcNqM0KEBOtA2pBuBd85XXT1F6ED0BtDkl3IVUA2dLgRxyghSUIfoNn7e22XGEL44%2BsZywijRSqEGLjWMP3eD37JfrITJd9KL0%2B%2FNJGoKFr7Mrmb1w5pdxLHPHbeJFi6SifBOdr%2FRUvcP0KZcY%2Br%2BYvfneh%2Bv88uyrV3pfCzXM5ie9%2F7EvHaw%2Bj8bOTGv8BbzokGiTTxnNRcrqaNIrysL4cRgfRktotANbo%2BtuT4%2BnnMf7UYTqbH%2FZpxvsxmIu%2BFRGfO5nEZU3ZxVbpmYBS73f5x%2F%2Bea7uSyPWDn%2B6kOV%2Bkf%2F%2BcIidchr0gemDJTJYjI0Oo%2BhkVlpY5pe97FKfQwNzI5Vh%2BSoSh11sjSGxmaVC4Gq1LWcbRt22RCLiKJpwBatTN2wTaAODorpU8SWCtVP7At%2BE5lyJbRXqk5F6jVkgOb8CCEaIATvfenQlN9YdbKHUn6IzgCa8lOuAtpwSTk5pGsicnSBHHg16hPoJFTeEaGjh%2BiYQKegylXQzuunYn9O7KgWAXSaSuzQgR1oSfsJNCU2qdYBsaPz7IBmxJSroBV2fN%2B4Iff5lvBRqQNw5ozwoQE%2B0ArVJ9DgpRQM4aOP%2BIDGLpWrgArVtSEIONJJBFFPELx3p8uEytu%2BY0oE6S1BpuAQpmoVtEKQ%2Be4OiR1VaoGGOokdOrAD7b3pU2gQUwqG2NFHdkBDmMpV0M570%2BmV6XUaANf%2BEzo0QAfae3On0ADmVPUG9YQORG8ADV8qV0Er6PCTx%2FUmni%2FdhAhSLYWyYGc9K3Jc6Nr6z4fNQlDCj8LLF4IaJSulCwtBnbz3r8t6XyAW82f%2FXhtqgoZBp9Ub27%2Fr8Ug%2FlqQacqH02zpQHQCjNam4C4iG0FCociXQolQtByjGEBoeJaZoMMfFW5Q6BC9FlIrp0ySXFqWe2BcaIlWvhFYmuix97yqtSq0VAjRQShDRACJoy1KNITRQelAMQaSnEIEGS9UroRWILPxnYkitYoxsKtvIjoRlQxN9tiTcv8e4aPR29iQ0DKvRni4%2Bvy30tLjPePuf9PPXQ2MqG%2F67a7DswxkfXqW73x1tT48%2Bs9gXPboLqg%2Fhxsu2YlFnvbLhecEE723nVHt4PsY5bCaJYICywW5XDIC1b%2FDAMs4NgLYI0TDKBpld6f%2F2HgC8UJHR5W3j8R6AYW5nWrRyFMN4d1nl2zQG8zmdDsz9tRtiJpZze3APDEQ7QvO5B4tT3KSXCV2pS4AQVOfxKKOLOw0unYvpKQVK6eoZSZEekLByKVZ6ktM1wTld%2Be36FI4nphysC87oKtcBZXQ1YQg0o0sM0YEheCldE5zSNVUn8oghmA4BnNBVrgPaql4LhFjZ09NMmrFkZKJRQtcuN3pLKUGr0YRuyfOrT0%2Bbaju6y7lXtMwH3o5xhkW51rIOt85HfwO87cINi7KtRQsYuWTrAG%2F8bXU52YrW%2F3ipGNtukqUlr21qtzjKntpXJ8VRxvXQwiyOMtUOhOwu4wKtNGTSWmGC3WVYYOE6T2sLbYsrw353hSGzIJp%2F%2B52zMJltv4op%2BUU2hNSFWNKVy22SEZ8icFlIyYvXKfZaJZWLpKG0LERGbQBCUF0LQGUhuME0B1wWolwKVBaiZzzWMQkrHUrp4ZWFOOCyECmZPqX0aJXmiX3BhSHKldDOnnacrSipV6sDcF0IQUQDiODFpR1wXYijuh6AIILrEsCVIcqVQJUhWkBk1ORSf0ttiuVwsF977lzVJ1f29%2Fr2IvP9eOsXEim7j%2F4Wx%2B725IQMeMcrf04bjtrKb3I6yGpB7oDnm7aTE8z%2BDhqWT5PlLrKuTctql8xjKsunjaje5cRtZhc5LG3PRD8xrx00A1BCs2gAK1d9gbjXgEzyvJ%2BE2gObx4zfxT4LvQ%2Bx%2B3KRDQ%2BjirqF1oU8CqIZwdFzaXCatfYyozYGx8DH1Y85ZdT6MG0dg6PgyqVAGTU957FjcPicsKJBMBQvozYGR8WlZCgY2lOqgMPiypVAS601oQg4fk4U0YAieCm1cVn1bq1kiCI9pQi4Ali5EtpLqT1ttgSSOi1IR0Ug6QRIEBdtTsDxzkm1EogkPSDJBBzwVK6E9kgivAyRpFYLjW4oUTLTbXcRrDU8q9Iwrofm5ApvEexoXK6jn6vdKBRbDA7yqMp77u8s%2BxiGLKgc4OQhPZjFfsMsDXK9y%2BUAeAbIvXrAxnv3w2TcJ8d4hVG6NvpF5%2FeLBgKtgNb0CWm8YKaFB6IsUtGV%2FsbySDkgGAZa98tgZDP%2BqGQK0FItZOODJSPHhMKmC9hjpWmNIbR%2FMNAcEV4Kdlo20e1Kf2M5ogYq7MRhHEX89OkQnbT8FHksPeP%2F%3C%2Fdiagram%3E%3C%2Fmxfile%3E)

## Prototipagem de telas

### Excalidraw / Fluxos
https://excalidraw.com/#json=oyWilCEpC4YSPySMdzDUy,Gx9Yd7W4fivKAeXkq3ZSDg

### Figma / Layout
https://www.figma.com/design/m9L6NqOqb86mtJ9M0yajCF/GiftHelper?node-id=0-1&p=f&t=szYYcxG5XylHqagM-0

## Usability Video
https://youtube.com/shorts/ezpm__sjcHc

## Planejamento de Sprints

### Sprint 1 (Semana 1) - OK

- Criar repositório no GitHub
- Criar tela de login/registro
- Criar telas e estilo do aplicativo

### Sprint 2 (Semana 3) - OK

- Criar tela de perfil
- Implementar edição de perfil

### Sprint 3 (Semana 5) - OK

- Criar sistema de eventos
- Tela de criação de eventos
- Listagem de eventos

### Sprint 4 (Semana 7)

- Implementar a sugestões de presentes nos eventos
- Visitar perfil dos amigos 

### Sprint 5 (Semana 9)

- Impletação do avatar
- Sorteio automático do amigo secreto

### Sprint extra

- Customização do avatar

## Atualizações desde o último checkpoint

Desde o último checkpoint, foram aplicados novos recursos e melhorias no projeto, principalmente nos módulos de autenticação, wishlist, amizades e eventos.

### Recursos dos módulos anteriores aplicados

- Utilizei React Native com Expo e Expo Router para organizar a navegação do aplicativo em rotas protegidas e públicas, separando telas autenticadas das telas de login e cadastro.

- Utilizei services no frontend para centralizar as chamadas HTTP da aplicação, evitando chamadas diretas à API dentro dos componentes. Exemplos disso aparecem nos services de autenticação, gifts, amizades e eventos.

- Utilizei hooks e contextos para gerenciar o estado de autenticação do usuário, como o controle de login, logout, armazenamento do token e definição do usuário autenticado.

- Utilizei componentes reutilizáveis de interface, como `InputComponent`, `PressableComponent`, `TextComponent`, `TitleComponent`, `Loading`, `SelectModal` e `TextAreaComponent`, para manter consistência visual entre as telas.

- Implementei o módulo de amizades, permitindo pesquisar usuários, enviar pedidos de amizade, aceitar convites e listar amigos.

- Implementei o módulo de eventos, permitindo criar eventos, listar eventos, visualizar detalhes e convidar usuários para eventos.

### Boas práticas para criação de componentes reutilizáveis aplicadas

- Criei componentes com responsabilidade única. Por exemplo, `InputComponent` é responsável apenas pela entrada de texto, `PressableComponent` apenas por botões e `TextComponent` apenas por padronizar textos.

- Reutilizei componentes existentes em diferentes telas para evitar duplicação de código. Os mesmos inputs, botões, textos e loaders são usados em telas de login, cadastro, wishlist, eventos e amizades.

- Usei props para tornar os componentes flexíveis. Por exemplo, `InputComponent` recebe propriedades como `label`, `error`, `width`, `height`, `placeholder`, `borderError` e `backgroundColor`, permitindo uso em diferentes contextos.

- Separei componentes visuais da lógica de API. As telas e componentes consomem funções dos services, enquanto as chamadas HTTP ficam centralizadas na camada de services.

- Apliquei feedback visual para o usuário em ações assíncronas, usando loading e toast em operações como criação de presentes, criação de eventos, envio de convites e autenticação.

- Usei componentes menores para compor interfaces maiores. Por exemplo, a área de amizades usa componentes específicos para busca, listagem de pedidos, itens de amigos e menu lateral.

- Mantive o padrão de reutilização também no módulo de eventos, separando componentes como `EventItem`, `EventForm` e componentes relacionados ao convite de usuários.

- Utilizei validações visuais nos componentes de formulário, exibindo mensagens de erro e bordas vermelhas nos campos inválidos para melhorar a experiência do usuário.
