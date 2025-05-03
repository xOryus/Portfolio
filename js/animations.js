/**
 * Animações avançadas para portfólio
 * Efeitos visuais interativos com temática de cibersegurança
 */

// Inicialização de todas as animações
document.addEventListener("DOMContentLoaded", () => {
  // Detecta preferências de redução de movimento
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Inicializa animações apenas se o usuário não preferir movimento reduzido
  if (!prefersReducedMotion) {
    initMatrixRain();
    initGlitchEffect();
    initCounterAnimations();
    initGlassShimmer();
    initGlassParticles();
    initTextTypingEffect();
  } else {
    // Ainda inicializa contadores com animação mínima
    initCounterAnimations(true);
  }
});

// Inicializa animação de chuva digital estilo Matrix
function initMatrixRain() {
  // Verifica se o elemento canvas já existe
  if (document.querySelector(".digital-rain-canvas")) return;

  // Cria o elemento canvas para a chuva digital
  const canvas = document.createElement("canvas");
  canvas.className = "digital-rain-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Detecta se é dispositivo móvel para ajustar a densidade
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Símbolos utilizados na animação (caracteres cibernéticos/matriz)
  const symbols =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
      ""
    );

  // Configurações da matriz
  const fontSize = isMobile ? 10 : 14;
  const columns = Math.floor(canvas.width / fontSize) + 1;

  // Array para controlar a posição Y de cada coluna
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -canvas.height;
  }

  let lastTime = 0;
  const fps = isMobile ? 15 : 30; // Limita FPS para melhor desempenho em mobile
  const interval = 1000 / fps;

  // Função de desenho da chuva digital
  function drawMatrix(timestamp) {
    // Controle de FPS
    if (timestamp - lastTime < interval) {
      requestAnimationFrame(drawMatrix);
      return;
    }
    lastTime = timestamp;

    // Aplica efeito de desvanecimento para trilha
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Define estilo para caracteres
    ctx.fillStyle = "#0fa";
    ctx.font = fontSize + "px monospace";

    // Desenha caracteres
    for (let i = 0; i < drops.length; i++) {
      // Escolhe um caractere aleatório para desenhar
      const text = symbols[Math.floor(Math.random() * symbols.length)];

      // Desenha o caractere
      ctx.fillText(text, i * fontSize, drops[i] * 1);

      // Reseta quando atinge o fundo com chance aleatória
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      // Move as gotas para baixo
      drops[i]++;
    }

    // Continua a animação
    requestAnimationFrame(drawMatrix);
  }

  // Inicia a animação com requestAnimationFrame
  requestAnimationFrame(drawMatrix);

  // Redimensiona o canvas quando a janela é redimensionada
  window.addEventListener("resize", () => {
    // Limita a frequência de redimensionamento
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recalcula colunas
      const newColumns = Math.floor(canvas.width / fontSize) + 1;
      // Redefine gotas para novas dimensões
      while (drops.length < newColumns) {
        drops.push(Math.random() * -canvas.height);
      }
      // Trunca o array se necessário
      drops.length = newColumns;
    }, 200);
  });
}

// Inicializa efeito Glitch para elementos com a classe .glitch
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll(".glitch");

  glitchElements.forEach((element) => {
    // Armazena o texto original como atributo data-text para uso pelo pseudo-elemento
    if (!element.hasAttribute("data-text")) {
      element.setAttribute("data-text", element.textContent);
    }

    // Adiciona interatividade ao passar o mouse
    element.addEventListener("mouseenter", () => {
      element.classList.add("active-glitch");
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("active-glitch");
    });

    // Efeito glitch aleatório periódico
    setInterval(() => {
      if (Math.random() > 0.95) {
        element.classList.add("active-glitch");
        setTimeout(() => {
          element.classList.remove("active-glitch");
        }, 500 + Math.random() * 1000);
      }
    }, 3000);
  });
}

// Inicializa animações de contador para estatísticas
function initCounterAnimations(reducedMotion = false) {
  const counters = document.querySelectorAll(".counter:not(.counted)");

  counters.forEach((counter) => {
    // Marca o contador para evitar inicialização dupla
    counter.classList.add("counted");

    // Usa IntersectionObserver para iniciar apenas quando visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(counter, reducedMotion);
            observer.unobserve(counter);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(counter);
  });

  function animateCounter(counterElement, isReducedMotion) {
    // Obtém o valor alvo como string para preservar formatação
    const targetString = counterElement.getAttribute("data-target");
    const counterDisplay =
      counterElement.querySelector(".counter-value") || counterElement;

    // Detecta se é um contador de moeda
    const isCurrency =
      targetString.includes("$") ||
      targetString.includes("€") ||
      targetString.includes("£") ||
      targetString.includes("¥");

    // Processa corretamente o valor com formatação
    let prefix = "",
      suffix = "",
      targetNumber;

    if (isCurrency) {
      // Extrai símbolo de moeda/prefixo e valor numérico
      const currencyMatch = targetString.match(/^([^\d]*)(\d[\d,.]*)([^\d]*)$/);
      if (currencyMatch) {
        prefix = currencyMatch[1]; // Símbolo de moeda ou prefixo
        const numericPart = currencyMatch[2].replace(/,/g, ""); // Remove vírgulas
        targetNumber = parseFloat(numericPart);
        suffix = currencyMatch[3]; // Qualquer sufixo
      } else {
        // Fallback se a correspondência falhar
        targetNumber = parseFloat(targetString.replace(/[^\d.]/g, ""));
      }
    } else {
      // Número regular
      targetNumber = parseInt(targetString.replace(/[^\d]/g, ""), 10);
    }

    // Padrão para 0 se a análise falhar
    if (isNaN(targetNumber)) {
      targetNumber = 0;
    }

    // Para movimento reduzido, apenas defina o valor final
    if (isReducedMotion) {
      if (isCurrency) {
        counterDisplay.textContent =
          prefix + formatNumber(targetNumber.toFixed(2)) + suffix;
      } else {
        counterDisplay.textContent = formatNumber(targetNumber);
      }
      counterElement.classList.add("visible-counter", "counter-complete");
      return;
    }

    // Mostrar elementos de contador inicialmente
    counterElement.classList.add("visible-counter");

    // Configuração de animação
    const duration = 2500; // Duração da animação em ms
    const framesPerSecond = 60;
    const totalFrames = (duration / 1000) * framesPerSecond;
    let currentFrame = 0;

    // Função de easing personalizada para movimento natural
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    // Para formatar números com vírgulas
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Formata moedas conforme necessário
    function formatCurrency(num) {
      // Determina se devemos mostrar casas decimais
      const hasDecimal = targetNumber % 1 !== 0;
      const digits = hasDecimal ? 2 : 0;
      return formatNumber(num.toFixed(digits));
    }

    // Função de animação usando requestAnimationFrame
    function updateCounter() {
      currentFrame++;

      // Calcula o progresso atual (0 a 1)
      const progress = currentFrame / totalFrames;

      // Aplica easing para animação natural
      const easedProgress = easeOutExpo(Math.min(progress, 1));

      // Calcula o valor atual
      let currentValue = Math.floor(easedProgress * targetNumber);

      // Formata o valor adequadamente
      let displayValue;
      if (isCurrency) {
        displayValue = formatCurrency(currentValue);
      } else {
        displayValue = formatNumber(currentValue);
      }

      // Atualiza o display
      counterDisplay.textContent = displayValue;

      // Continua a animação se não estiver completa
      if (currentFrame < totalFrames) {
        requestAnimationFrame(updateCounter);
      } else {
        // Garante que o valor final seja exatamente o alvo
        if (isCurrency) {
          counterDisplay.textContent = formatCurrency(targetNumber);
        } else {
          counterDisplay.textContent = formatNumber(targetNumber);
        }

        // Adiciona classe de conclusão para estilo adicional
        counterElement.classList.add("counter-complete");

        // Inicia animação de brilho após concluído
        if (isCurrency) {
          const glowAnimation = [
            { textShadow: "0 0 0px rgba(0, 216, 255, 0)" },
            { textShadow: "0 0 8px rgba(0, 216, 255, 0.6)" },
            { textShadow: "0 0 2px rgba(0, 216, 255, 0.2)" },
          ];

          const glowTiming = {
            duration: 1500,
            iterations: 1,
            fill: "forwards",
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
          };

          counterDisplay.animate(glowAnimation, glowTiming);
        }
      }
    }

    // Inicia animação
    requestAnimationFrame(updateCounter);
  }
}

// Adiciona efeito de brilho aos elementos glass
function initGlassShimmer() {
  const glassElements = document.querySelectorAll(".glass-effect, .glass-card");

  glassElements.forEach((element) => {
    // Verifica se o elemento já tem o efeito
    if (element.querySelector(".glass-shimmer-effect")) return;

    // Cria o elemento de efeito shimmer
    const shimmerEffect = document.createElement("div");
    shimmerEffect.className = "glass-shimmer-effect";
    element.appendChild(shimmerEffect);

    // Adiciona o efeito de grade para elementos de vidro
    const gridPattern = document.createElement("div");
    gridPattern.className = "glass-grid-pattern";
    element.appendChild(gridPattern);

    // Adiciona shimmer animation com web animations API
    const shimmerAnimation = [
      { transform: "translateX(-100%) skewX(-15deg)", opacity: 0 },
      {
        transform: "translateX(100%) skewX(-15deg)",
        opacity: 0.3,
        offset: 0.5,
      },
      { transform: "translateX(200%) skewX(-15deg)", opacity: 0 },
    ];

    const shimmerTiming = {
      duration: 4000 + Math.random() * 4000, // Varia entre 4-8s
      iterations: Infinity,
      easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    };

    // Inicia com atraso aleatório para evitar sincronização
    setTimeout(() => {
      shimmerEffect.animate(shimmerAnimation, shimmerTiming);
    }, Math.random() * 2000);
  });
}

// Adiciona partículas aos elementos glass para efeito visual
function initGlassParticles() {
  const glassElements = document.querySelectorAll(".glass-effect, .glass-card");

  glassElements.forEach((element) => {
    // Não adiciona partículas em dispositivos móveis para melhorar o desempenho
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return;
    }

    // Número de partículas baseado no tamanho do elemento
    const elementArea = element.offsetWidth * element.offsetHeight;
    const particleCount = Math.min(Math.floor(elementArea / 10000), 8);

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "glass-particle";

      // Posição aleatória dentro do elemento
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Tamanho variável
      const size = 2 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Opacidade variável
      particle.style.opacity = 0.1 + Math.random() * 0.4;

      element.appendChild(particle);

      // Animação de flutuação para cada partícula
      const particleAnimation = [
        {
          transform: "translate(0, 0) scale(1)",
          opacity: 0.1 + Math.random() * 0.2,
        },
        {
          transform: `translate(${-10 + Math.random() * 20}px, ${
            -15 + Math.random() * 30
          }px) scale(${0.8 + Math.random() * 0.4})`,
          opacity: 0.2 + Math.random() * 0.3,
          offset: 0.4,
        },
        {
          transform: "translate(0, 0) scale(1)",
          opacity: 0.1 + Math.random() * 0.2,
        },
      ];

      const animationTiming = {
        duration: 5000 + Math.random() * 5000,
        iterations: Infinity,
        direction: "alternate",
        easing: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      };

      // Inicia com atraso aleatório
      setTimeout(() => {
        particle.animate(particleAnimation, animationTiming);
      }, Math.random() * 2000);
    }
  });
}

// Implementa efeito de digitação para textos
function initTextTypingEffect() {
  const typingElements = document.querySelectorAll(
    ".typing:not(.typing-initialized)"
  );

  typingElements.forEach((element) => {
    element.classList.add("typing-initialized");

    // Obtém o texto original
    const originalText = element.textContent;
    // Limpa o elemento
    element.textContent = "";

    // Adiciona cursor de digitação
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "|";
    element.appendChild(cursor);

    // Usa IntersectionObserver para iniciar apenas quando visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Inicia a digitação após pequeno atraso
            setTimeout(() => typeText(element, originalText, cursor), 400);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);
  });

  function typeText(element, text, cursor) {
    const characters = text.split("");
    let index = 0;

    // Define velocidade de digitação aleatória para efeito mais natural
    function getTypeSpeed() {
      const baseSpeed = 50;
      const variation = 40;
      return baseSpeed + Math.random() * variation;
    }

    // Função recursiva para digitar caractere por caractere
    function type() {
      if (index < characters.length) {
        // Cria elemento span para o caractere
        const charElement = document.createElement("span");
        charElement.textContent = characters[index];
        element.insertBefore(charElement, cursor);

        // Possível animação sutil para o caractere recém-digitado
        const charAnimation = [
          { opacity: 0, transform: "translateY(5px)" },
          { opacity: 1, transform: "translateY(0)" },
        ];

        const charTiming = {
          duration: 100,
          fill: "forwards",
          easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        };

        charElement.animate(charAnimation, charTiming);

        index++;

        // Programa o próximo caractere
        setTimeout(type, getTypeSpeed());
      } else {
        // Digitação concluída
        element.classList.add("typing-done");

        // Animação sutil de fade out/in para o cursor
        const blinkAnimation = [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }];

        const blinkTiming = {
          duration: 800,
          iterations: Infinity,
        };

        cursor.animate(blinkAnimation, blinkTiming);
      }
    }

    // Inicia o efeito de digitação
    type();
  }
}
