# Portfólio de Segurança da Informação

Um portfólio profissional moderno com tema futurista para especialistas em Cybersecurity, Pentesting e Bug Bounty.

![Preview do Portfólio](preview.png)

## Características

- Design futurista com tema escuro (dark theme)
- Terminal interativo com comandos personalizados
- Layout responsivo para todos os dispositivos
- Animações e efeitos visuais de alta qualidade
- Seções específicas para experiência em segurança e reconhecimentos

## Estrutura do Projeto

```
portfolio/
├── index.html               # Página principal
├── css/
│   ├── reset.css            # Reset de estilos
│   ├── main.css             # Estilos principais 
│   ├── animations.css       # Animações e efeitos visuais
│   └── responsive.css       # Adaptações para dispositivos
├── js/
│   ├── main.js              # Funcionalidades principais
│   ├── terminal.js          # Simulador de terminal
│   └── animations.js        # Animações avançadas
├── images/                  # Armazena imagens
└── assets/                  # Outros recursos
```

## Personalização

### Informações Pessoais

Para personalizar o portfólio com suas informações:

1. Edite o arquivo `index.html` para atualizar:
   - Nome e título profissional
   - Experiências e timeline
   - Certificações e formação acadêmica
   - Projetos e trabalhos realizados
   - Reconhecimentos e Hall of Fame
   - Links de contato e redes sociais

2. Substitua os arquivos placeholder em `images/` por suas próprias imagens.

### Personalização Visual

Para ajustar as cores e estilo:

1. Edite as variáveis CSS em `css/main.css`:
   ```css
   :root {
       --color-background: #0a0a0f;
       --color-surface: #15151e;
       --color-primary: #00a8ff;
       --color-secondary: #18e6c7;
       --color-accent: #ff003c;
       --color-text: #e0e0e8;
       --color-text-muted: #8888a2;
   }
   ```

2. Para modificar animações, ajuste o arquivo `css/animations.css`.

### Terminal Interativo

O terminal interativo pode ser personalizado no arquivo `js/terminal.js`:

1. Adicione ou modifique comandos no objeto `commandList`
2. Personalize as respostas dos comandos existentes
3. Crie novos arquivos virtuais em `catFile()`

## Como Usar

1. Clone ou baixe este repositório
2. Personalize os arquivos conforme suas necessidades
3. Hospede em qualquer servidor web ou plataforma como GitHub Pages, Netlify, Vercel, etc.

## Tecnologias Utilizadas

- HTML5, CSS3
- JavaScript (ES6+)
- Particles.js para efeito de partículas
- Font Awesome para ícones

## Compatibilidade

O portfólio é totalmente responsivo e compatível com:
- Chrome, Firefox, Safari, Edge (versões modernas)
- Dispositivos móveis e tablets (iOS e Android)

## Licença

Este projeto está disponível como código aberto sob a licença MIT.