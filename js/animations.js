/**
 * ANIMATIONS.JS - EFEITOS VISUAIS AVANÇADOS
 * Animações específicas para o tema de cibersegurança - VERSÃO OTIMIZADA
 */

// Detector de dispositivo para ajustar animações
const deviceDetection = {
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024,
  // Detecção de dispositivos de baixa performance
  isLowPower: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  // Preferência por redução de movimento (acessibilidade)
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  // Cache para animações ativas para evitar duplicação
  activeAnimations: {
    matrix: false,
    circuit: [],
  },
};

// Função para controle de throttling - limita a frequência de chamadas de funções
function throttle(callback, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}

// Ajusta configurações baseado no dispositivo - com throttling para melhor performance
window.addEventListener("resize", throttle(() => {
  deviceDetection.isMobile = window.innerWidth < 768;
  deviceDetection.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  deviceDetection.isDesktop = window.innerWidth >= 1024;
}, 250)); // Throttle a 250ms para reduzir carga durante redimensionamento

document.addEventListener("DOMContentLoaded", () => {
  // Verifica preferência por animações reduzidas para acessibilidade
  if (deviceDetection.prefersReducedMotion) {
    console.info("Modo de animações reduzidas ativado para acessibilidade");
    document.body.classList.add("reduced-motion");
    return; // Evita inicializar animações pesadas
  }

  // Inicializa todos os efeitos visuais apenas uma vez após um leve atraso
  // Usa requestAnimationFrame para melhor integração com ciclo de renderização
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (!deviceDetection.activeAnimations.matrix) {
        // Reduz carga de animação em dispositivos de baixa potência
        if (!deviceDetection.isLowPower) {
          initializeMatrixEffect();
          createDigitalGrid();
        } else {
          console.info("Limitando efeitos visuais em dispositivo de baixa potência");
        }

        // Inicializa efeitos mais leves em todos os dispositivos
        initializeGlitchEffect();
        initializeTypewriterEffect();
      }
    }, 100);
  });
});

// Efeito de Chuva Digital (Matrix) no background - VERSÃO OTIMIZADA
function initializeMatrixEffect() {
  // Verifica se já existe um canvas para o efeito
  if (document.querySelector(".matrix-effect-bg")) return;
  if (deviceDetection.activeAnimations.matrix) return;

  deviceDetection.activeAnimations.matrix = true;

  // Cria o canvas para o efeito com configurações melhoradas para performance
  const matrixCanvas = document.createElement("canvas");
  matrixCanvas.className = "matrix-effect-bg";
  matrixCanvas.style.position = "fixed";
  matrixCanvas.style.top = "0";
  matrixCanvas.style.left = "0";
  matrixCanvas.style.width = "100%";
  matrixCanvas.style.height = "100%";
  matrixCanvas.style.zIndex = "-3";
  // Reduz opacidade em dispositivos móveis para melhorar performance
  matrixCanvas.style.opacity = deviceDetection.isMobile ? "0.03" : "0.05";
  matrixCanvas.style.pointerEvents = "none"; // Desabilita completamente interações
  // Adiciona propriedade transform para melhor performance com GPU
  matrixCanvas.style.transform = "translateZ(0)";
  matrixCanvas.style.willChange = "transform"; // Indica ao navegador para otimizar animações
  document.body.appendChild(matrixCanvas);

  const ctx = matrixCanvas.getContext("2d", { alpha: true, desynchronized: true }); // Melhoria de performance

  // Dimensões do canvas com melhor ajuste para dispositivos
  const updateCanvasDimensions = () => {
    // Em dispositivos móveis, reduz a resolução para melhor performance
    const scaleFactor = deviceDetection.isMobile ? 0.75 : 1;
    matrixCanvas.width = window.innerWidth * scaleFactor;
    matrixCanvas.height = window.innerHeight * scaleFactor;
  };

  updateCanvasDimensions();

  // Caracteres para o efeito Matrix
  const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const characters = matrix.split("");

  // Ajusta densidade baseada no dispositivo - OTIMIZADO
  const fontSize = deviceDetection.isMobile ? 10 : deviceDetection.isTablet ? 11 : 12;
  const density = deviceDetection.isDesktop ? 1.8 : deviceDetection.isTablet ? 1.5 : 1; // Reduz densidade em desktops
  const columns = Math.floor(matrixCanvas.width / fontSize / density);

  // Array de posições Y para cada coluna
  const drops = Array(columns).fill(1);

  // Cores otimizadas para melhor renderização
  const baseColor = deviceDetection.isMobile ? "rgba(0, 255, 0, 0.65)" : "rgba(0, 255, 0, 0.8)";
  const fadeColor = "rgba(0, 0, 0, 0.05)";

  // Taxa de atualização baseada no dispositivo
  const frameRate = deviceDetection.isDesktop ? 60 : deviceDetection.isTablet ? 45 : 30; // Taxa adaptada
  const frameDelay = 1000 / frameRate;
  let lastTime = 0;

  // Função de desenho para o efeito Matrix com controle de framerate aprimorado
  function drawMatrixRain(timestamp) {
    // Controle de framerate mais preciso
    if (timestamp - lastTime < frameDelay) {
      requestAnimationFrame(drawMatrixRain);
      return;
    }

    lastTime = timestamp;

    // Cria um efeito de rastro com fundo semi-transparente
    ctx.fillStyle = fadeColor;
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    // Define cor e fonte para os caracteres
    ctx.fillStyle = baseColor;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    // Loop para desenhar os caracteres - OTIMIZADO
    for (let i = 0; i < drops.length; i++) {
      // Seleciona um caractere aleatório
      const text = characters[Math.floor(Math.random() * characters.length)];

      // Desenha o caractere na posição
      ctx.fillText(text, i * fontSize * density, drops[i] * fontSize);

      // Move a posição para baixo (com velocidade ajustada por dispositivo)
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += deviceDetection.isMobile ? 0.5 : 1; // Movimentação mais suave em mobile
    }

    // Usar requestAnimationFrame para sincronizar com a taxa de atualização do navegador
    requestAnimationFrame(drawMatrixRain);
  }

  // Inicia a animação Matrix com requestAnimationFrame 
  requestAnimationFrame(drawMatrixRain);

  // Ajusta o tamanho quando a janela é redimensionada (com throttle)
  window.addEventListener("resize", throttle(() => {
    updateCanvasDimensions();
  }, 250));
}

// Aplica efeito glitch animado ao texto - VERSÃO OTIMIZADA
function initializeGlitchEffect() {
  const glitchTexts = document.querySelectorAll(".glitch");

  if (!glitchTexts.length) return;

  glitchTexts.forEach((text) => {
    // Garante que o atributo data-text está definido
    if (!text.getAttribute("data-text")) {
      text.setAttribute("data-text", text.textContent);
    }

    // Reduz frequência em desktop e dispositivos de baixa potência
    const interval = deviceDetection.isLowPower ? 5000 :
      deviceDetection.isDesktop ? 4500 : 3000;

    // Adiciona efeito de glitch com controle de performance
    let glitchInterval;

    const startGlitchInterval = () => {
      glitchInterval = setInterval(() => {
        // Chance aleatória de aplicar o efeito, reduzida em dispositivos de baixa potência
        const threshold = deviceDetection.isLowPower ? 0.95 : 0.9;
        if (Math.random() > threshold) {
          text.classList.add("active-glitch");

          // Remove a classe após um curto período com transição suavizada
          setTimeout(() => {
            text.classList.remove("active-glitch");
          }, deviceDetection.isLowPower ? 100 : 200);
        }
      }, interval);
    };

    // Otimização: pausa o glitch quando a página não está visível
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && glitchInterval) {
        clearInterval(glitchInterval);
      } else if (!document.hidden && !glitchInterval) {
        startGlitchInterval();
      }
    });

    // Inicia o intervalo
    startGlitchInterval();

    // Ativa o glitch no hover para interatividade adicional
    text.addEventListener("mouseenter", () => {
      if (!deviceDetection.isLowPower) {
        text.classList.add("active-glitch");
        setTimeout(() => text.classList.remove("active-glitch"), 300);
      }
    });
  });
}

// Efeito de digitação para textos com classe typewriter - VERSÃO OTIMIZADA
function initializeTypewriterEffect() {
  const typeElements = document.querySelectorAll(".typing");

  typeElements.forEach((element) => {
    const text = element.textContent;
    // Ajusta velocidade baseada no dispositivo com mais suavidade
    const baseDuration = parseInt(element.dataset.speed) || 100;
    const duration = deviceDetection.isDesktop
      ? baseDuration * 0.8
      : deviceDetection.isTablet
        ? baseDuration * 0.9
        : baseDuration;

    // Limpa o conteúdo original
    element.textContent = "";

    // Adiciona espaço pré-alocado para evitar reflow
    element.style.minHeight = `${element.offsetHeight || 20}px`;

    // Função para digitar caractere por caractere com melhor performance
    function typeCharacter(index) {
      // Usa requestAnimationFrame para melhor sincronização com ciclo de renderização
      if (index < text.length) {
        requestAnimationFrame(() => {
          element.textContent += text.charAt(index);
          setTimeout(() => typeCharacter(index + 1), duration);
        });
      } else {
        // Adiciona cursor piscante no final
        element.classList.add("typing-done");
      }
    }

    // Inicia o efeito de digitação quando o elemento estiver visível
    // Usa IntersectionObserver para melhor performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeno atraso para melhor efeito visual
          setTimeout(() => {
            typeCharacter(0);
          }, 300);
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    });

    observer.observe(element);
  });
}

// Cria grid digital animado em elementos com classe digital-grid - VERSÃO OTIMIZADA
function createDigitalGrid() {
  const gridElements = document.querySelectorAll(".digital-grid-container");

  gridElements.forEach((container) => {
    // Verifica se já existe uma grid para evitar duplicação
    if (container.querySelector(".digital-grid")) return;

    const grid = document.createElement("div");
    grid.className = "digital-grid";
    grid.style.pointerEvents = "none"; // Desabilita interações
    // Ativa aceleração de hardware
    grid.style.transform = "translateZ(0)";
    grid.style.willChange = "opacity"; // Melhora performance de animações de opacidade
    container.appendChild(grid);

    // Reduz número de pontos com base na performance do dispositivo
    const numDots = deviceDetection.isLowPower ? 15 :
      deviceDetection.isDesktop ? 30 :
        deviceDetection.isTablet ? 40 : 25;

    // Adiciona pontos piscantes aleatórios com melhor performance
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.className = "grid-dot";

      // Posição aleatória
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;

      // Tamanho aleatório mas consistente com o dispositivo
      const size = deviceDetection.isMobile ?
        (1.5 + Math.random() * 2) :
        (2 + Math.random() * 3);
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;

      // Animação aleatória otimizada para performance
      const duration = 2 + Math.random() * 3;
      const delay = Math.random() * 2;

      // Usa CSS Transitions em vez de animations em dispositivos de baixa potência
      if (deviceDetection.isLowPower) {
        dot.style.transition = `opacity ${duration}s ease-in-out`;
        setInterval(() => {
          dot.style.opacity = dot.style.opacity === "0.1" ? "0.7" : "0.1";
        }, duration * 1000);
      } else {
        dot.style.animationDuration = `${duration}s`;
        dot.style.animationDelay = `${delay}s`;
      }

      grid.appendChild(dot);
    }
  });
}

// Efeito de distorção em imagens com hover - VERSÃO OTIMIZADA
document.addEventListener("DOMContentLoaded", () => {
  const glitchImages = document.querySelectorAll(".glitch-image");

  glitchImages.forEach((image) => {
    // Não aplica em dispositivos de baixa potência
    if (deviceDetection.isLowPower) return;

    // Verifica se já tem camadas para evitar duplicação
    const parent = image.parentNode;
    if (parent.querySelector(".glitch-layer")) return;

    // Cria camadas para o efeito glitch com melhor performance
    for (let i = 1; i <= 2; i++) {
      const glitchLayer = document.createElement("div");
      glitchLayer.className = `glitch-layer glitch-layer-${i}`;
      glitchLayer.style.backgroundImage = `url(${image.src})`;

      // Adiciona propriedades para aceleração de hardware
      glitchLayer.style.transform = "translateZ(0)";
      glitchLayer.style.willChange = "transform, clip-path";

      // Insere antes da imagem original
      image.parentNode.insertBefore(glitchLayer, image);
    }

    // Adiciona eventos com melhor gestão de performance
    const imageContainer = image.parentNode;

    // Usa evento com throttle para evitar chamadas excessivas
    imageContainer.addEventListener("mouseenter", throttle(() => {
      imageContainer.classList.add("glitching");
    }, 50));

    imageContainer.addEventListener("mouseleave", throttle(() => {
      imageContainer.classList.remove("glitching");
    }, 50));
  });
});

// Animação dos elementos ao scroll - VERSÃO OTIMIZADA COM INTERSECTION OBSERVER
document.addEventListener("DOMContentLoaded", () => {
  // Configuração aprimorada do Intersection Observer
  const observerOptions = {
    threshold: deviceDetection.isMobile ? 0.1 : 0.15, // Ajuste de sensibilidade por dispositivo
    rootMargin: "0px 0px -10% 0px", // Aciona um pouco antes da visibilidade total
  };

  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in, .timeline-item, .certification-card, .project-card, .badge"
  );

  // Callback otimizado para melhor performance
  const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      // Verifica se o elemento está visível
      if (entry.isIntersecting) {
        // Aplica classes com pequeno atraso sequencial para criar efeito cascata
        const delay = parseFloat(entry.target.dataset.delay || 0);

        setTimeout(() => {
          // Adiciona classe de animação apropriada
          if (entry.target.classList.contains("timeline-item")) {
            entry.target.classList.add("slide-up");
          } else if (entry.target.classList.contains("project-card")) {
            entry.target.classList.add("slide-up");
            // Adiciona atraso baseado na posição
            entry.target.style.animationDelay = `${delay + 0.1}s`;
          } else if (entry.target.classList.contains("certification-card")) {
            entry.target.classList.add("slide-up");
          } else if (entry.target.classList.contains("badge")) {
            entry.target.classList.add("slide-up");
          } else {
            entry.target.classList.add("visible");
          }

          // Usa setTimeout para garantir que a transição seja completada antes de remover propriedades
          setTimeout(() => {
            entry.target.style.willChange = "auto"; // Libera recursos após a animação
          }, 1000);
        }, delay * 100);

        observer.unobserve(entry.target); // Observa apenas uma vez
      }
    });
  };

  // Cria o observer com callback otimizado
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Prepara e observa os elementos
  animatedElements.forEach((element, index) => {
    // Prepara para animação
    element.style.willChange = "transform, opacity"; // Otimiza para as propriedades que serão animadas

    // Adiciona atributo para controlar atraso baseado na posição
    element.dataset.delay = index % 5; // Limita a 5 grupos para evitar atrasos muito longos

    // Inicia observação
    observer.observe(element);
  });
});

// Efeito de circuito fluindo em elementos com classe circuit-animation - VERSÃO OTIMIZADA
document.addEventListener("DOMContentLoaded", () => {
  // Evita aplicar em dispositivos de baixa potência
  if (deviceDetection.isLowPower) return;

  const circuitElements = document.querySelectorAll(".circuit-animation");

  circuitElements.forEach((element, index) => {
    // Evitar duplicação de animações
    if (deviceDetection.activeAnimations.circuit.includes(index)) return;
    deviceDetection.activeAnimations.circuit.push(index);

    // Verifica se já existe um canvas para evitar duplicação
    if (element.querySelector(".circuit-canvas")) return;

    // Cria canvas para desenhar o circuito com configurações otimizadas
    const canvas = document.createElement("canvas");
    canvas.className = "circuit-canvas";
    canvas.style.pointerEvents = "none"; // Desabilita interações
    canvas.style.transform = "translateZ(0)"; // Aceleração de hardware
    canvas.style.willChange = "transform"; // Otimizado para animações
    element.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true }); // Contexto otimizado

    // Configura o canvas para preencher o elemento
    function resizeCanvas() {
      // Reduz resolução em dispositivos móveis para melhorar performance
      const scaleFactor = deviceDetection.isMobile ? 0.75 : 1;
      canvas.width = element.offsetWidth * scaleFactor;
      canvas.height = element.offsetHeight * scaleFactor;
    }

    resizeCanvas();
    window.addEventListener("resize", throttle(resizeCanvas, 250));

    // Pontos do circuito - reduz densidade em dispositivos de menor capacidade
    const points = [];
    const divisor = deviceDetection.isDesktop ? 45 :
      deviceDetection.isTablet ? 35 : 30;
    const numPoints = Math.min(
      Math.floor(element.offsetWidth / divisor),
      deviceDetection.isDesktop ? 40 :
        deviceDetection.isTablet ? 30 : 20
    );

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (deviceDetection.isDesktop ? 1 : 1.5), // Velocidade ajustada
        vy: (Math.random() - 0.5) * (deviceDetection.isDesktop ? 1 : 1.5),
      });
    }

    // Taxa de atualização adaptativa por dispositivo
    const frameRate = deviceDetection.isDesktop ? 30 : 24; // Reduzido para melhor performance
    const frameDelay = 1000 / frameRate;
    let lastFrameTime = 0;

    // Função para desenhar o circuito com otimizações
    function drawCircuit(timestamp) {
      // Controle de framerate mais preciso
      if (timestamp - lastFrameTime < frameDelay) {
        requestAnimationFrame(drawCircuit);
        return;
      }

      lastFrameTime = timestamp;

      // Limpa com contexto otimizado
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenha as linhas de conexão
      ctx.strokeStyle = "rgba(0, 168, 255, 0.2)";
      ctx.lineWidth = deviceDetection.isMobile ? 0.5 : 1;

      // Ajusta o raio de conexão baseado no dispositivo
      const connectionRadius = deviceDetection.isDesktop ? 80 :
        deviceDetection.isTablet ? 90 : 100;

      // Otimização: pré-calcula todas as distâncias entre pontos
      const connections = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            connections.push({
              x1: points[i].x,
              y1: points[i].y,
              x2: points[j].x,
              y2: points[j].y,
              opacity: 1 - (distance / connectionRadius)
            });
          }
        }
      }

      // Desenha todas as conexões de uma vez
      connections.forEach(conn => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 168, 255, ${conn.opacity * 0.2})`;
        ctx.moveTo(conn.x1, conn.y1);
        ctx.lineTo(conn.x2, conn.y2);
        ctx.stroke();
      });

      // Desenha os pontos com tamanho adaptativo
      const pointRadius = deviceDetection.isMobile ? 1.5 : 2;
      ctx.fillStyle = "rgba(0, 168, 255, 0.7)";

      for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, pointRadius, 0, Math.PI * 2);
        ctx.fill();

        // Move os pontos com física suavizada
        points[i].x += points[i].vx;
        points[i].y += points[i].vy;

        // Rebate nas bordas com amortecimento
        if (points[i].x < 0 || points[i].x > canvas.width) {
          points[i].vx *= -0.95; // Amortecimento
          points[i].x = Math.max(0, Math.min(points[i].x, canvas.width));
        }
        if (points[i].y < 0 || points[i].y > canvas.height) {
          points[i].vy *= -0.95; // Amortecimento
          points[i].y = Math.max(0, Math.min(points[i].y, canvas.height));
        }
      }

      // Usa requestAnimationFrame para sincronizar com ciclo de renderização
      requestAnimationFrame(drawCircuit);
    }

    // Inicia a animação com requestionAnimationFrame
    requestAnimationFrame(drawCircuit);

    // Pausar animação quando elemento não estiver visível
    const visibilityObserver = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting;
      if (isVisible) {
        requestAnimationFrame(drawCircuit);
      }
    }, { threshold: 0.1 });

    visibilityObserver.observe(element);
  });
});
