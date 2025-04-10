/**
 * TERMINAL.JS - EMULADOR DE TERMINAL PARA PORTFÓLIO
 * Simulação de terminal com comandos interativos para o portfólio
 */

// Classe que gerencia o terminal interativo
class TerminalEmulator {
    constructor(selector) {
        this.terminal = document.querySelector(selector);
        if (!this.terminal) return;

        this.content = this.terminal.querySelector('.terminal-content');
        this.history = [];
        this.commandIndex = 0;
        this.commandList = {
            'help': () => this.showHelp(),
            'clear': () => this.clearTerminal(),
            'about': () => this.showAbout(),
            'skills': () => this.showSkills(),
            'contact': () => this.showContact(),
            'projects': () => this.showProjects(),
            'certifications': () => this.showCertifications(),
            'social': () => this.showSocial(),
            'hack': () => this.simulateHack(),
            'matrix': () => this.showMatrix(),
            'echo': (args) => this.echo(args),
            'ls': () => this.listFiles(),
            'cat': (args) => this.catFile(args),
        };

        this.typeCommand('whoami');
        this.processCommand('whoami');

        // Adiciona comando 'cat mission.txt' para exibir lema
        setTimeout(() => {
            this.typeCommand('cat mission.txt');
            this.processCommand('cat mission.txt');
        }, 3000);

        // Adiciona comando final com cursor piscante
        setTimeout(() => {
            this.addNewCommandLine();
        }, 6000);

        // Adiciona interatividade ao terminal após animação inicial
        setTimeout(() => {
            this.setupInteractiveTerminal();
        }, 7000);
    }

    // Configurações para interatividade do terminal
    setupInteractiveTerminal() {
        // Evento para cliques no terminal
        this.terminal.addEventListener('click', () => {
            const input = this.terminal.querySelector('.current-input');
            if (input) {
                input.focus();
            }
        });

        this.addInteractiveCommandLine();
    }

    // Adiciona linha de comando interativa
    addInteractiveCommandLine() {
        const line = document.createElement('div');
        line.className = 'line';

        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$ ';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'command current-input';
        input.autocapitalize = 'off';
        input.autocomplete = 'off';
        input.spellcheck = false;

        line.appendChild(prompt);
        line.appendChild(input);
        this.content.appendChild(line);

        // Foca no input
        input.focus();

        // Gerencia eventos de teclado
        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    const command = input.value.trim();
                    if (command) {
                        // Substitui o input por um span
                        const commandSpan = document.createElement('span');
                        commandSpan.className = 'command';
                        commandSpan.textContent = command;
                        line.replaceChild(commandSpan, input);

                        // Adiciona ao histórico
                        this.history.push(command);
                        this.commandIndex = this.history.length;

                        // Processa o comando
                        this.processCommand(command);

                        // Adiciona nova linha de comando
                        this.addInteractiveCommandLine();
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (this.history.length > 0) {
                        this.commandIndex = Math.max(0, this.commandIndex - 1);
                        input.value = this.history[this.commandIndex] || '';
                    }
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    if (this.history.length > 0) {
                        this.commandIndex = Math.min(this.history.length, this.commandIndex + 1);
                        input.value = this.history[this.commandIndex] || '';
                    }
                    break;

                case 'Tab':
                    e.preventDefault();
                    this.autoCompleteCommand(input);
                    break;

                case 'c':
                    // Ctrl+C
                    if (e.ctrlKey) {
                        this.addNewCommandLine();
                        this.addInteractiveCommandLine();
                    }
                    break;
            }
        });
    }

    // Auto-completar comandos
    autoCompleteCommand(input) {
        const command = input.value.trim();
        if (!command) return;

        const availableCommands = Object.keys(this.commandList);
        const matchingCommands = availableCommands.filter(cmd => cmd.startsWith(command));

        if (matchingCommands.length === 1) {
            input.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            this.addResponse(`Comandos disponíveis: ${matchingCommands.join(', ')}`);
        }
    }

    // Simula digitação de comando
    typeCommand(command) {
        const line = document.createElement('div');
        line.className = 'line';

        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$ ';

        const commandSpan = document.createElement('span');
        commandSpan.className = 'command';
        commandSpan.textContent = command;

        line.appendChild(prompt);
        line.appendChild(commandSpan);
        this.content.appendChild(line);
    }

    // Adiciona uma nova linha de comando
    addNewCommandLine() {
        const line = document.createElement('div');
        line.className = 'line';

        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$ ';

        const cursor = document.createElement('span');
        cursor.className = 'cursor blink';
        cursor.textContent = '_';

        line.appendChild(prompt);
        line.appendChild(cursor);
        this.content.appendChild(line);
    }

    // Adiciona resposta ao terminal
    addResponse(text) {
        const response = document.createElement('div');
        response.className = 'response';
        response.textContent = text;
        this.content.appendChild(response);

        // Scroll para o final do terminal
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    // Processa o comando inserido
    processCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        // Mensagem personalizada para whoami
        if (cmd === 'whoami') {
            this.addResponse('Pesquisador de Segurança | Pentester | Bug Hunter');
            return;
        }

        // Mensagem personalizada para cat mission.txt
        if (cmd === 'cat' && args === 'mission.txt') {
            this.addResponse('Protegendo o futuro, quebrando barreiras no presente.');
            return;
        }

        // Verifica se o comando existe
        if (this.commandList[cmd]) {
            this.commandList[cmd](args);
        } else {
            this.addResponse(`Comando não encontrado: ${cmd}. Digite 'help' para ver os comandos disponíveis.`);
        }
    }

    // Comandos do terminal
    clearTerminal() {
        while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
        }
    }

    showHelp() {
        const commands = Object.keys(this.commandList).sort();
        let helpText = 'Comandos disponíveis:\n\n';

        helpText += 'help - Exibe esta mensagem de ajuda\n';
        helpText += 'clear - Limpa o terminal\n';
        helpText += 'about - Sobre o especialista em segurança\n';
        helpText += 'skills - Lista de habilidades técnicas\n';
        helpText += 'projects - Principais projetos desenvolvidos\n';
        helpText += 'certifications - Certificações obtidas\n';
        helpText += 'contact - Informações de contato\n';
        helpText += 'social - Links para redes sociais\n';
        helpText += 'ls - Lista arquivos disponíveis\n';
        helpText += 'cat [arquivo] - Exibe conteúdo de um arquivo\n';
        helpText += 'hack - Simula uma invasão (apenas demonstração)\n';
        helpText += 'matrix - Ativa efeito matrix\n';

        this.addResponse(helpText);
    }

    showAbout() {
        const aboutText = `
Nome: Gabriel
Função: Especialista em Segurança da Informação
Foco: Pentesting, Bug Bounty, Segurança Ofensiva

Sou um pesquisador de segurança apaixonado por encontrar vulnerabilidades 
e ajudar organizações a fortalecer suas defesas digitais. Especialista em 
identificar falhas antes que atacantes mal-intencionados as explorem.

Minha abordagem combina técnicas manuais e automação personalizada para 
maximizar eficiência e cobertura em testes de segurança.
        `;

        this.addResponse(aboutText);
    }

    showSkills() {
        const skillsText = `
HABILIDADES TÉCNICAS:

▓▓▓▓▓▓▓▓▓▓ Web App Pentesting (90%)
▓▓▓▓▓▓▓▓░░ Mobile Security (80%)
▓▓▓▓▓▓▓░░░ API Security (75%)
▓▓▓▓▓▓▓▓▓░ OWASP Top 10 (90%)
▓▓▓▓▓▓▓▓░░ Network Security (80%)
▓▓▓▓▓▓░░░░ Cloud Security (60%)
▓▓▓▓▓▓▓░░░ Reverse Engineering (70%)
▓▓▓▓▓▓▓▓░░ Scripting & Automation (80%)

LINGUAGENS:
Python, JavaScript, Bash, PHP, SQL

FERRAMENTAS:
Burp Suite, Metasploit, OWASP ZAP, Nmap, Wireshark, SQLmap
        `;

        this.addResponse(skillsText);
    }

    showContact() {
        const contactText = `
E-MAIL:
[email protegido - role até a seção de contato]

LOCALIZAÇÃO:
Brasil

Para enviar uma mensagem segura, use o formulário de contato criptografado
disponível nesta página.
        `;

        this.addResponse(contactText);
    }

    showProjects() {
        const projectsText = `
PROJETOS DESTACADOS:

1. Web Vulnerability Scanner
   • Scanner automatizado para detecção de vulnerabilidades web
   • Tecnologias: Python, Requests, BeautifulSoup
   
2. Network Traffic Analyzer
   • Ferramenta de análise de tráfego e detecção de anomalias
   • Tecnologias: Python, Scapy, TensorFlow
   
3. Payload Generator
   • Gerador de payloads customizados para testes de penetração
   • Tecnologias: Bash, Python, JavaScript
   
4. API Security Tester
   • Suite de testes para validação de segurança em APIs
   • Tecnologias: Node.js, Express, Jest
        `;

        this.addResponse(projectsText);
    }

    showCertifications() {
        const certText = `
CERTIFICAÇÕES:

• Google Cybersecurity Professional
• CC50 - Harvard
• Ethical Hacking - Solyd
• GitHub Foundations
• Graduação em Segurança da Informação (em andamento)
        `;

        this.addResponse(certText);
    }

    showSocial() {
        const socialText = `
REDES SOCIAIS:

[Github] https://github.com/
[LinkedIn] https://linkedin.com/
[HackTheBox] https://app.hackthebox.com/
        `;

        this.addResponse(socialText);
    }

    simulateHack() {
        this.addResponse("Iniciando simulação de invasão (demonstrativa)...");

        // Adiciona a simulação com tempo entre etapas
        const steps = [
            "Executando reconhecimento de rede...",
            "Identificando portas abertas: 22, 80, 443...",
            "Detectando sistema operacional: Linux 5.4.0...",
            "Encontrado serviço vulnerável na porta 443...",
            "Explorando CVE-2023-XXXX...",
            "Gerando payload especializado...",
            "Enviando exploit...",
            "Estabelecendo conexão reversa...",
            "Elevando privilégios...",
            "Acesso root obtido!",
            "$ whoami",
            "root",
            "Simulação concluída - Em um cenário real, este alvo seria vulnerável."
        ];

        let delay = 500;
        steps.forEach((step, index) => {
            setTimeout(() => {
                this.addResponse(step);
            }, delay);
            delay += 500;
        });
    }

    showMatrix() {
        this.addResponse("Ativando modo Matrix...");

        // Ativa o efeito visual matrix na página
        const matrixRain = document.createElement('div');
        matrixRain.className = 'matrix-rain';
        document.body.appendChild(matrixRain);

        // Cria um canvas para o efeito
        const canvas = document.createElement('canvas');
        matrixRain.appendChild(canvas);

        // Inicializa o efeito Matrix
        const ctx = canvas.getContext('2d');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        // Caracteres para o efeito
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const charArray = chars.split('');

        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Executa a animação
        const matrixAnimation = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00a8ff';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const matrixInterval = setInterval(matrixAnimation, 40);

        // Remove o efeito após 10 segundos
        setTimeout(() => {
            clearInterval(matrixInterval);
            document.body.removeChild(matrixRain);
            this.addResponse("Modo Matrix desativado.");
        }, 10000);
    }

    echo(args) {
        if (!args) {
            this.addResponse("");
        } else {
            this.addResponse(args);
        }
    }

    listFiles() {
        const files = [
            "about.txt",
            "skills.dat",
            "mission.txt",
            "projects.log",
            "contacts.enc",
            "certifications.md"
        ];

        let output = "";
        files.forEach(file => {
            output += file + "\n";
        });

        this.addResponse(output);
    }

    catFile(args) {
        const files = {
            "about.txt": "Gabriel - Especialista em Segurança da Informação\nFoco em pentesting e bug bounty.\n\nPara mais informações, use o comando 'about'.",
            "skills.dat": "Arquivo de habilidades. Use o comando 'skills' para visualizar o conteúdo formatado.",
            "mission.txt": "Protegendo o futuro, quebrando barreiras no presente.",
            "projects.log": "Registro de projetos. Use o comando 'projects' para detalhes.",
            "contacts.enc": "Arquivo criptografado. Use o comando 'contact' para visualizar informações de contato.",
            "certifications.md": "# Certificações\n\nUse o comando 'certifications' para visualizar a lista completa."
        };

        if (!args) {
            this.addResponse("Uso: cat [arquivo]");
            return;
        }

        if (files[args]) {
            this.addResponse(files[args]);
        } else {
            this.addResponse(`Arquivo não encontrado: ${args}`);
        }
    }
}

// Inicializa o terminal quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new TerminalEmulator('.terminal');
});