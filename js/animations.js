/**
 * ANIMATIONS.JS - EFEITOS VISUAIS AVANÇADOS
 * Animações específicas para o tema de cibersegurança
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os efeitos visuais
    initializeMatrixEffect();
    initializeGlitchEffect();
    initializeTypewriterEffect();
    createDigitalGrid();
});

// Efeito de Chuva Digital (Matrix) no background
function initializeMatrixEffect() {
    // Verifica se já existe um canvas para o efeito
    if (document.querySelector('.matrix-effect-bg')) return;

    // Cria o canvas para o efeito
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.className = 'matrix-effect-bg';
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.width = '100%';
    matrixCanvas.style.height = '100%';
    matrixCanvas.style.zIndex = '-3';
    matrixCanvas.style.opacity = '0.05';
    document.body.appendChild(matrixCanvas);

    const ctx = matrixCanvas.getContext('2d');

    // Dimensões do canvas
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    // Caracteres para o efeito Matrix
    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const characters = matrix.split("");

    const fontSize = 10;
    const columns = matrixCanvas.width / fontSize;

    // Array de posições Y para cada coluna
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    // Função de desenho para o efeito Matrix
    function drawMatrixRain() {
        // Cria um efeito de rastro com fundo semi-transparente
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        // Define cor e fonte para os caracteres
        ctx.fillStyle = "#0F0"; // Verde característico do Matrix
        ctx.font = fontSize + "px monospace";

        // Loop para desenhar os caracteres
        for (let i = 0; i < drops.length; i++) {
            // Seleciona um caractere aleatório
            const text = characters[Math.floor(Math.random() * characters.length)];

            // Desenha o caractere na posição
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Move a posição para baixo
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Executa a animação Matrix
    setInterval(drawMatrixRain, 35);

    // Ajusta o tamanho quando a janela é redimensionada
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
}

// Aplica efeito glitch animado ao texto
function initializeGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.glitch');

    if (!glitchTexts.length) return;

    glitchTexts.forEach(text => {
        // Garante que o atributo data-text está definido
        if (!text.getAttribute('data-text')) {
            text.setAttribute('data-text', text.textContent);
        }

        // Adiciona efeito de glitch aleatório ocasional
        setInterval(() => {
            // Chance aleatória de aplicar o efeito
            if (Math.random() > 0.9) {
                text.classList.add('active-glitch');

                // Remove a classe após um curto período
                setTimeout(() => {
                    text.classList.remove('active-glitch');
                }, 200);
            }
        }, 3000);
    });
}

// Efeito de digitação para textos com classe typewriter
function initializeTypewriterEffect() {
    const typeElements = document.querySelectorAll('.typing');

    typeElements.forEach(element => {
        const text = element.textContent;
        const duration = parseInt(element.dataset.speed) || 100; // Velocidade de digitação em ms

        // Limpa o conteúdo original
        element.textContent = '';

        // Função para digitar caractere por caractere
        function typeCharacter(index) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                setTimeout(() => typeCharacter(index + 1), duration);
            }
        }

        // Inicia o efeito de digitação quando o elemento estiver visível
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeCharacter(0);
                    observer.unobserve(element);
                }
            });
        });

        observer.observe(element);
    });
}

// Cria grid digital animado em elementos com classe digital-grid
function createDigitalGrid() {
    const gridElements = document.querySelectorAll('.digital-grid-container');

    gridElements.forEach(container => {
        const grid = document.createElement('div');
        grid.className = 'digital-grid';
        container.appendChild(grid);

        // Adiciona pontos piscantes aleatórios
        for (let i = 0; i < 50; i++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';

            // Posição aleatória
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;

            // Tamanho aleatório
            const size = 2 + Math.random() * 3;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;

            // Animação aleatória
            dot.style.animationDuration = `${2 + Math.random() * 3}s`;
            dot.style.animationDelay = `${Math.random() * 2}s`;

            grid.appendChild(dot);
        }
    });
}

// Efeito de distorção em imagens com hover
document.addEventListener('DOMContentLoaded', () => {
    const glitchImages = document.querySelectorAll('.glitch-image');

    glitchImages.forEach(image => {
        // Cria camadas para o efeito glitch
        for (let i = 1; i <= 2; i++) {
            const glitchLayer = document.createElement('div');
            glitchLayer.className = `glitch-layer glitch-layer-${i}`;
            glitchLayer.style.backgroundImage = `url(${image.src})`;

            // Insere antes da imagem original
            image.parentNode.insertBefore(glitchLayer, image);
        }

        // Adiciona eventos
        const imageContainer = image.parentNode;
        imageContainer.addEventListener('mouseenter', () => {
            imageContainer.classList.add('glitching');
        });

        imageContainer.addEventListener('mouseleave', () => {
            imageContainer.classList.remove('glitching');
        });
    });
});

// Animação dos elementos ao scroll
document.addEventListener('DOMContentLoaded', () => {
    // Configuração do Intersection Observer para animação ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Observa apenas uma vez
            }
        });
    }, observerOptions);

    // Observa todos os elementos que devem ser animados
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

// Efeito de circuito fluindo em elementos com classe circuit-animation
document.addEventListener('DOMContentLoaded', () => {
    const circuitElements = document.querySelectorAll('.circuit-animation');

    circuitElements.forEach(element => {
        // Cria canvas para desenhar o circuito
        const canvas = document.createElement('canvas');
        canvas.className = 'circuit-canvas';
        element.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        // Configura o canvas para preencher o elemento
        function resizeCanvas() {
            canvas.width = element.offsetWidth;
            canvas.height = element.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Pontos do circuito
        const points = [];
        const numPoints = Math.floor(element.offsetWidth / 30);

        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }

        // Função para desenhar o circuito
        function drawCircuit() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Desenha as linhas de conexão
            ctx.strokeStyle = 'rgba(0, 168, 255, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Conecta pontos próximos
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Desenha os pontos
            ctx.fillStyle = 'rgba(0, 168, 255, 0.7)';

            for (let i = 0; i < points.length; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Move os pontos
                points[i].x += points[i].vx;
                points[i].y += points[i].vy;

                // Rebate nas bordas
                if (points[i].x < 0 || points[i].x > canvas.width) points[i].vx *= -1;
                if (points[i].y < 0 || points[i].y > canvas.height) points[i].vy *= -1;
            }

            requestAnimationFrame(drawCircuit);
        }

        drawCircuit();
    });
});