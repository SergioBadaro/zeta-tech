# Zeta Tech

## Visão geral
A **Zeta Tech** é uma solução web voltada para **gestão de chamados e suporte técnico**, com uma forte presença institucional na parte pública e um fluxo interno para abertura, acompanhamento e administração de tickets.

O projeto combina uma **landing page de vendas/branding** com uma **plataforma de suporte** baseada em páginas estáticas, permitindo que o usuário navegue por:
- apresentação da empresa e serviços;
- cadastro e login;
- dashboard com indicadores;
- abertura de chamados;
- visualização e conclusão de chamados;
- edição de perfil.

## Objetivo da ferramenta
O objetivo da ferramenta é centralizar o processo de atendimento e suporte em um ambiente simples e visualmente organizado, permitindo que empresas e equipes:
- capturem solicitações de suporte;
- registrem chamados com dados do cliente e descrição do problema;
- acompanhem o status dos tickets;
- tenham um painel com métricas de atendimento;
- ofereçam um canal de contato com a marca.

Em resumo, a plataforma funciona como um **portal de suporte e gestão de tickets** com interface moderna e foco em experiência do usuário.

## Tecnologias utilizadas
- **HTML5**: estrutura das páginas e conteúdo semântico.
- **CSS3**: estilização, layout responsivo, cards, sidebar, botões, animações e temas.
- **JavaScript puro (Vanilla JS)**: interações, validações, manipulação do DOM, armazenamento em `localStorage`, abertura/fechamento de accordions e renderização dinâmica.
- **Font Awesome**: ícones de interface.
- **Google Fonts (Poppins)**: tipografia.
- **LocalStorage**: persistência de chamados no navegador.

## Estrutura do projeto

### Pastas
- `assets/` — páginas HTML da aplicação (landing, dashboard, abertura de chamados, chamados, perfil, políticas e autenticação).
- `css/` — arquivos de estilo organizados por tela.
- `js/` — scripts de comportamento e integração com o navegador.
- `assets/img/` — imagens, logo e ícones.

### Arquivos principais
- `assets/home.html` — landing page institucional com hero, serviços, diferenciais, FAQ e botão de WhatsApp.
- `assets/index.html` — dashboard principal com cards estatísticos.
- `assets/abrir-chamado.html` — formulário para criação de chamados.
- `assets/chamados.html` — listagem e gerenciamento dos chamados abertos.
- `assets/perfil-usuario.html` — edição de perfil.
- `assets/Login/login-de-usuario.html` — tela de login.
- `assets/Login/cadastro-de-conta.html` — tela de cadastro.
- `assets/politica-termos.html` — política de privacidade e termos.

### JavaScript
- `js/home.js` — animações de entrada, typewriter, FAQ e formulário de contato.
- `js/abrir-chamado.js` — criação e persistência de chamados no `localStorage`.
- `js/chamados-abertos.js` — renderização, conclusão e exclusão de chamados.
- `js/principal.js` — dashboard e lógica de logout.
- `js/perfil-usuario.js` — salvamento de alterações e troca de foto (placeholder).
- `js/script.js` — scripts auxiliares de cadastro/login.

## Fluxo da aplicação
1. **Landing page pública**: apresenta marca, serviços, FAQ e botão para contato.
2. **Autenticação**: login e cadastro direcionam o usuário para a área interna.
3. **Dashboard**: mostra métricas de desempenho dos chamados.
4. **Abertura de chamado**: usuário registra problemas e a solução gera um ticket localmente.
5. **Chamados**: lista os tickets, permite concluir ou deletar.
6. **Perfil**: permite atualizar informações do usuário.

## Funcionalidades implementadas
- Layout responsivo.
- Hero com efeito de digitação.
- Seção de serviços e diferenciais.
- FAQ expansível.
- Formulário de contato.
- Botão fixo de WhatsApp.
- Barra lateral com navegação.
- Criação e armazenamento de chamados.
- Listagem de chamados com ações de concluir e excluir.
- Dashboard com cartões de métricas.
- Tela de perfil e mensagens de sucesso.

## Como executar localmente
Como a aplicação é estática, o ideal é servir os arquivos por um servidor local simples.

### Opção 1 — Python HTTP Server
Na pasta raiz do projeto, execute:

```bash
python -m http.server 8000
```

Depois acesse:
- `http://localhost:8000/assets/home.html` para a landing page.
- `http://localhost:8000/assets/index.html` para o dashboard.

### Opção 2 — Abrir arquivos diretamente
Também é possível abrir as páginas em um navegador, porém isso pode causar problemas com os caminhos absolutos (`/css/...`, `/js/...`). Por isso, o uso de servidor local é recomendado.

## Observações importantes
- Os dados de chamados são persistidos em `localStorage`, então podem ser visualizados entre recarregamentos do navegador.
- O projeto está no formato **front-end puro**, sem dependências de build ou framework.
- Algumas áreas ainda podem ser aprimoradas, como padronização de dados no dashboard e integração real com backend.

## Próximos passos sugeridos
- integrar autenticação real com backend;
- conectar a aplicação a um banco de dados ou API;
- padronizar o armazenamento de chamados com status e datas consistentes;
- adicionar upload real de foto de perfil;
- implementar filtros e buscas nos chamados.
