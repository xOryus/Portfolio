/**
 * ANIMATIONS.JS - EFEITOS VISUAIS AVANÇADOS
 * Animações específicas para o tema de cibersegurança
 */

// Detector de dispositivo para ajustar animações
const deviceDetection = {
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024,

  // Cache para animações ativas para evitar duplicação
  activeAnimations: {
    matrix: false,
    circuit: [],
  },
};

// Ajusta configurações baseado no dispositivo
window.addEventListener("resize", () => {
  deviceDetection.isMobile = window.innerWidth < 768;
  deviceDetection.isTablet =
    window.innerWidth >= 768 && window.innerWidth < 1024;
  deviceDetection.isDesktop = window.innerWidth >= 1024;
});

document.addEventListener("DOMContentLoaded", () => {
  // Inicializa todos os efeitos visuais apenas uma vez
  setTimeout(() => {
    // Atraso pequeno para garantir carregamento completo
    if (!deviceDetection.activeAnimations.matrix) {
      initializeMatrixEffect();
      initializeGlitchEffect();
      initializeTypewriterEffect();
      createDigitalGrid();
    }
  }, 100);
});

// Efeito de Chuva Digital (Matrix) no background
function initializeMatrixEffect() {
  // Verifica se já existe um canvas para o efeito
  if (document.querySelector(".matrix-effect-bg")) return;
  if (deviceDetection.activeAnimations.matrix) return;

  deviceDetection.activeAnimations.matrix = true;

  // Cria o canvas para o efeito
  const matrixCanvas = document.createElement("canvas");
  matrixCanvas.className = "matrix-effect-bg";
  matrixCanvas.style.position = "fixed";
  matrixCanvas.style.top = "0";
  matrixCanvas.style.left = "0";
  matrixCanvas.style.width = "100%";
  matrixCanvas.style.height = "100%";
  matrixCanvas.style.zIndex = "-3";
  matrixCanvas.style.opacity = "0.05";
  matrixCanvas.style.pointerEvents = "none"; // Desabilita completamente interações
  document.body.appendChild(matrixCanvas);

  const ctx = matrixCanvas.getContext("2d");

  // Dimensões do canvas
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  // Caracteres para o efeito Matrix
  const matrix =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const characters = matrix.split("");

  // Ajusta densidade baseada no dispositivo
  const fontSize = deviceDetection.isMobile ? 10 : 12;
  const density = deviceDetection.isDesktop ? 1.5 : 1; // Reduz densidade em desktops
  const columns = Math.floor(matrixCanvas.width / fontSize / density);

  // Array de posições Y para cada coluna
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  // Taxa de atualização baseada no dispositivo
  const frameRate = deviceDetection.isDesktop ? 50 : 35; // Taxa mais lenta em desktop
  let lastTime = 0;

  // Função de desenho para o efeito Matrix com controle de framerate
  function drawMatrixRain(timestamp) {
    // Controle de framerate
    if (timestamp - lastTime < frameRate) {
      requestAnimationFrame(drawMatrixRain);
      return;
    }

    lastTime = timestamp;

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
      ctx.fillText(text, i * fontSize * density, drops[i] * fontSize);

      // Move a posição para baixo
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(drawMatrixRain);
  }

  // Inicia a animação Matrix com requestAnimationFrame em vez de setInterval
  requestAnimationFrame(drawMatrixRain);

  // Ajusta o tamanho quando a janela é redimensionada
  window.addEventListener("resize", () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  });
}

// Aplica efeito glitch animado ao texto
function initializeGlitchEffect() {
  const glitchTexts = document.querySelectorAll(".glitch");

  if (!glitchTexts.length) return;

  glitchTexts.forEach((text) => {
    // Garante que o atributo data-text está definido
    if (!text.getAttribute("data-text")) {
      text.setAttribute("data-text", text.textContent);
    }

    // Reduz frequência em desktop
    const interval = deviceDetection.isDesktop ? 4500 : 3000;

    // Adiciona efeito de glitch aleatório ocasional
    setInterval(() => {
      // Chance aleatória de aplicar o efeito
      if (Math.random() > 0.9) {
        text.classList.add("active-glitch");

        // Remove a classe após um curto período
        setTimeout(() => {
          text.classList.remove("active-glitch");
        }, 200);
      }
    }, interval);
  });
}

// Efeito de digitação para textos com classe typewriter
function initializeTypewriterEffect() {
  const typeElements = document.querySelectorAll(".typing");

  typeElements.forEach((element) => {
    const text = element.textContent;
    // Ajusta velocidade baseada no dispositivo
    const baseDuration = parseInt(element.dataset.speed) || 100;
    const duration = deviceDetection.isDesktop
      ? baseDuration * 0.8
      : baseDuration;

    // Limpa o conteúdo original
    element.textContent = "";

    // Função para digitar caractere por caractere
    function typeCharacter(index) {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeCharacter(index + 1), duration);
      }
    }

    // Inicia o efeito de digitação quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
  const gridElements = document.querySelectorAll(".digital-grid-container");

  gridElements.forEach((container) => {
    // Verifica se já existe uma grid para evitar duplicação
    if (container.querySelector(".digital-grid")) return;

    const grid = document.createElement("div");
    grid.className = "digital-grid";
    grid.style.pointerEvents = "none"; // Desabilita interações
    container.appendChild(grid);

    // Reduz número de pontos em desktop para melhor desempenho
    const numDots = deviceDetection.isDesktop ? 30 : 50;

    // Adiciona pontos piscantes aleatórios
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.className = "grid-dot";

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
document.addEventListener("DOMContentLoaded", () => {
  const glitchImages = document.querySelectorAll(".glitch-image");

  glitchImages.forEach((image) => {
    // Verifica se já tem camadas para evitar duplicação
    const parent = image.parentNode;
    if (parent.querySelector(".glitch-layer")) return;

    // Cria camadas para o efeito glitch
    for (let i = 1; i <= 2; i++) {
      const glitchLayer = document.createElement("div");
      glitchLayer.className = `glitch-layer glitch-layer-${i}`;
      glitchLayer.style.backgroundImage = `url(${image.src})`;

      // Insere antes da imagem original
      image.parentNode.insertBefore(glitchLayer, image);
    }

    // Adiciona eventos
    const imageContainer = image.parentNode;
    imageContainer.addEventListener("mouseenter", () => {
      imageContainer.classList.add("glitching");
    });

    imageContainer.addEventListener("mouseleave", () => {
      imageContainer.classList.remove("glitching");
    });
  });
});

// Animação dos elementos ao scroll
document.addEventListener("DOMContentLoaded", () => {
  // Configuração do Intersection Observer para animação ao scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Observa apenas uma vez
      }
    });
  }, observerOptions);

  // Observa todos os elementos que devem ser animados
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
});

// Efeito de circuito fluindo em elementos com classe circuit-animation
document.addEventListener("DOMContentLoaded", () => {
  const circuitElements = document.querySelectorAll(".circuit-animation");

  circuitElements.forEach((element, index) => {
    // Evitar duplicação de animações
    if (deviceDetection.activeAnimations.circuit.includes(index)) return;
    deviceDetection.activeAnimations.circuit.push(index);

    // Verifica se já existe um canvas para evitar duplicação
    if (element.querySelector(".circuit-canvas")) return;

    // Cria canvas para desenhar o circuito
    const canvas = document.createElement("canvas");
    canvas.className = "circuit-canvas";
    canvas.style.pointerEvents = "none"; // Desabilita interações
    element.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Configura o canvas para preencher o elemento
    function resizeCanvas() {
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pontos do circuito - reduz densidade em desktop
    const points = [];
    const divisor = deviceDetection.isDesktop ? 45 : 30;
    const numPoints = Math.min(Math.floor(element.offsetWidth / divisor), 50); // Limita máximo de pontos

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (deviceDetection.isDesktop ? 1.5 : 2), // Velocidade reduzida em desktop
        vy: (Math.random() - 0.5) * (deviceDetection.isDesktop ? 1.5 : 2),
      });
    }

    // Taxa de atualização mais baixa em desktop
    const frameRate = deviceDetection.isDesktop ? 30 : 16; // ~33fps em desktop, ~60fps em mobile
    let lastFrameTime = 0;

    // Função para desenhar o circuito
    function drawCircuit(timestamp) {
      // Controle de framerate
      if (timestamp - lastFrameTime < frameRate) {
        requestAnimationFrame(drawCircuit);
        return;
      }

      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha as linhas de conexão
      ctx.strokeStyle = "rgba(0, 168, 255, 0.2)";
      ctx.lineWidth = 1;

      // Ajusta o raio de conexão baseado no dispositivo
      const connectionRadius = deviceDetection.isDesktop ? 80 : 100;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Conecta pontos próximos
          if (distance < connectionRadius) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Desenha os pontos
      ctx.fillStyle = "rgba(0, 168, 255, 0.7)";

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

    requestAnimationFrame(drawCircuit);
  });
});
