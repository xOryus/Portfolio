/**
 * MAIN.JS - PORTFÓLIO CYBERSECURITY
 * Funcionalidades principais do site - VERSÃO OTIMIZADA
 */

// Inicializa quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Cache para otimização de performance
  const performance = {
    lastScrollY: window.scrollY,
    ticking: false,
    // Detecta capacidade do dispositivo
    isMobile:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    supportsIntersectionObserver: "IntersectionObserver" in window,
  };

  // Inicializa todas as funcionalidades
  initializeNavigation();
  initializeScrollEffects();
  initializeAdvancedCounters(); // Usando nova função de contador aprimorada
  addScanlines();
  addStaticEffect();

  // Lazy load particles effect for better initial load performance
  if (performance.supportsIntersectionObserver) {
    const observer = new IntersectionObserver(() => {
      initializeParticles();
      observer.disconnect();
    });
    observer.observe(document.querySelector("#home"));
  } else {
    // Fallback for browsers without IntersectionObserver
    initializeParticles();
  }

  // Inicializa o Security Dashboard (certificando-se que ele é carregado)
  if (typeof SecurityDashboard === "function") {
    const dashboard = new SecurityDashboard(".security-dashboard");
  }
});

// Função para limitar chamadas de funções (throttle)
function throttle(callback, delay = 100) {
  let isThrottled = false;
  return function (...args) {
    if (!isThrottled) {
      requestAnimationFrame(() => {
        callback.apply(this, args);
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, delay);
      });
    }
  };
}

// Configura efeito de partículas no fundo - VERSÃO OTIMIZADA
function initializeParticles() {
  if (typeof particlesJS !== "undefined") {
    // Detecta capacidade do dispositivo para ajustar configurações
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const particleCount = isMobile ? 40 : 80;
    const particleSpeed = isMobile ? 0.8 : 1;
    const lineOpacity = isMobile ? 0.3 : 0.4;

    particlesJS("particles-bg", {
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#00a8ff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 0.5 * particleSpeed,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: isMobile ? 2 : 3,
          random: true,
          anim: {
            enable: true,
            speed: 1 * particleSpeed,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: isMobile ? 120 : 150,
          color: "#00a8ff",
          opacity: lineOpacity,
          width: isMobile ? 0.8 : 1,
        },
        move: {
          enable: true,
          speed: particleSpeed,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !isMobile, // Desativa em mobile para melhor desempenho
            mode: "grab",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: !isMobile, // Desativa em mobile para melhor desempenho
    });
  } else {
    console.warn("particles.js não está carregado");
  }
}

// Funcionalidades de navegação - VERSÃO OTIMIZADA
function initializeNavigation() {
  // Menu mobile toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      // Adiciona classe no body para controlar scroll quando menu mobile estiver aberto
      document.body.classList.toggle("menu-open");
    });
  }

  // Smooth scroll para links de navegação com melhor performance
  const navLinks = document.querySelectorAll(
    ".nav-link, .footer-links a, .scroll-indicator"
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Se o link tem um hash (âncora)
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();

        // Fecha menu mobile se estiver aberto
        if (nav && nav.classList.contains("active")) {
          nav.classList.remove("active");
          document.body.classList.remove("menu-open");
        }

        const targetId = href;
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          // Usa scrollIntoView com comportamento suave, mais eficiente
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });

          // Atualiza URL sem causar scroll adicional
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      }
    });
  });

  // Adiciona evento para fechar o menu ao clicar fora dele - com delegação de eventos
  document.addEventListener("click", (e) => {
    // Verifica se o menu está aberto e o clique não foi no menu ou no botão do menu
    if (
      nav &&
      nav.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".menu-toggle")
    ) {
      nav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Altera o header ao scroll - com throttle para melhor performance
  const headerScroll = throttle(() => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 50) {
        if (!header.classList.contains("scrolled")) {
          header.classList.add("scrolled");
        }
      } else {
        if (header.classList.contains("scrolled")) {
          header.classList.remove("scrolled");
        }
      }
    }
  }, 100); // 100ms throttle

  window.addEventListener("scroll", headerScroll);
}

// Efeitos de scroll - VERSÃO SUPER SUAVE para as Seções de Cards
function initializeScrollEffects() {
  // Verifica suporte para IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    // Fallback para navegadores antigos
    const simpleAnimateElements = () => {
      const elements = document.querySelectorAll(
        ".timeline-item, .certification-card, .project-card, .badge"
      );

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("slide-up");
        }
      });
    };

    // Executa uma vez ao carregar para elementos já visíveis
    simpleAnimateElements();

    // Adiciona ao evento de scroll com throttle
    window.addEventListener("scroll", throttle(simpleAnimateElements, 100));
    return;
  }

  // Versão com IntersectionObserver para melhor performance
  const certObserverOptions = {
    root: null,
    rootMargin: "0px 0px -5% 0px", // Menor margem para animar mais cedo
    threshold: 0.1, // Mais sensível para acionar animação com menos scroll
  };

  const handleCertIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Não usamos setTimeout aqui para deixar o controle com a animação CSS
        entry.target.classList.add("slide-up");
        observer.unobserve(entry.target);
      }
    });
  };

  // Observer específico para elementos de certificação e badges
  const certObserver = new IntersectionObserver(
    handleCertIntersect,
    certObserverOptions
  );

  // Observer para outros elementos com animação padrão
  const regularObserverOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const handleRegularIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Adiciona delay escalonado para elementos sequenciais
        const delay = entry.target.dataset.animationDelay || 0;
        setTimeout(() => {
          entry.target.classList.add("slide-up");
        }, delay * 50);
        observer.unobserve(entry.target);
      }
    });
  };

  const regularObserver = new IntersectionObserver(
    handleRegularIntersect,
    regularObserverOptions
  );

  // Seleciona e observa elementos de certificação com o observer especializado
  const certElements = document.querySelectorAll(".certification-card, .badge");

  certElements.forEach((element) => {
    certObserver.observe(element);
  });

  // Seleciona e observa outros elementos com o observer regular
  const regularElements = document.querySelectorAll(
    ".timeline-item, .project-card"
  );

  regularElements.forEach((element, index) => {
    // Adiciona um atributo de delay para escalonar a animação
    element.dataset.animationDelay = index % 5;
    regularObserver.observe(element);
  });
}

// COMPLETAMENTE REVAMPADO: Sistema de animação de contador avançado
function initializeAdvancedCounters() {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) return;

  // Usa IntersectionObserver moderno quando disponível
  if (!("IntersectionObserver" in window)) {
    // Fallback para navegadores antigos
    const simpleCounterInit = () => {
      counters.forEach((counter) => {
        if (counter.dataset.counted === "true") return;

        const elementTop = counter.getBoundingClientRect().top;
        if (elementTop < window.innerHeight) {
          startAdvancedCounter(counter);
          counter.dataset.counted = "true";
          counter.classList.add("visible-counter");
        }
      });
    };

    window.addEventListener("scroll", throttle(simpleCounterInit, 100));
    simpleCounterInit();
    return;
  }

  // Implementação aprimorada de IntersectionObserver
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible-counter");
          startAdvancedCounter(entry.target);
        }, 200);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  // Nova função aprimorada de animação de contador com formatação adequada de moeda e precisão
  function startAdvancedCounter(counterElement) {
    // Obtém o valor alvo como string primeiro para preservar a formatação
    const targetValueString = counterElement.getAttribute("data-target");
    const counterDisplay = counterElement.querySelector(".counter-value");

    if (!counterDisplay) return;

    // Detecta se é um contador de moeda
    const isCurrency =
      targetValueString.includes("$") ||
      targetValueString.includes("€") ||
      targetValueString.includes("£") ||
      targetValueString.includes("¥");

    // Analisa o valor alvo corretamente - lida com símbolos de moeda e vírgulas
    let prefix = "",
      suffix = "",
      targetNumber;

    if (isCurrency) {
      // Extrai prefixo/sufixo de moeda e valor numérico
      const currencyMatch = targetValueString.match(
        /^([^\d]*)(\d[\d,.]*)([^\d]*)$/
      );
      if (currencyMatch) {
        prefix = currencyMatch[1]; // Símbolo ou prefixo de moeda
        const numericPart = currencyMatch[2].replace(/,/g, ""); // Remove vírgulas
        targetNumber = parseFloat(numericPart);
        suffix = currencyMatch[3]; // Qualquer sufixo
      } else {
        // Fallback se a correspondência falhar
        targetNumber = parseFloat(targetValueString.replace(/[^\d.]/g, ""));
      }
    } else {
      // Número regular
      targetNumber = parseInt(targetValueString.replace(/[^\d]/g, ""), 10);
    }

    // Padrão para 0 se a análise falhar
    if (isNaN(targetNumber)) {
      targetNumber = 0;
    }

    // Configuração de animação
    const duration = 2000; // Duração da animação em ms
    const framesPerSecond = 60;
    const totalFrames = (duration / 1000) * framesPerSecond;
    let currentFrame = 0;

    // Função de easing personalizada para movimento natural
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    // Para formatar números com vírgulas
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Formatador de moeda, se necessário
    const formatCurrency = (num) => {
      // Determina se devemos mostrar casas decimais
      const hasDecimal = targetNumber % 1 !== 0;
      const digits = hasDecimal ? 2 : 0;
      return formatNumber(num.toFixed(digits));
    };

    // Função de animação usando requestAnimationFrame
    function updateCounter() {
      currentFrame++;

      // Calcula o progresso atual (0 a 1)
      const progress = currentFrame / totalFrames;

      // Aplica easing para animação natural
      const easedProgress = easeOutExpo(Math.min(progress, 1));

      // Calcula o valor atual
      let currentValue = Math.floor(easedProgress * targetNumber);

      // Formata o valor apropriadamente
      let displayValue;
      if (isCurrency) {
        displayValue = formatCurrency(currentValue);
      } else {
        displayValue = formatNumber(currentValue);
      }

      // Atualiza a exibição
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

        // Adiciona classe de conclusão para estilização adicional
        counterElement.classList.add("counter-complete");
      }
    }

    // Inicia a animação
    requestAnimationFrame(updateCounter);
  }
}

// Adiciona efeito de scanlines - VERSÃO OTIMIZADA
function addScanlines() {
  // Verifica se já existe o elemento
  if (document.querySelector(".scanlines")) return;

  // Verifica preferência por menos movimento
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scanlines = document.createElement("div");
  scanlines.className = "scanlines";
  document.body.appendChild(scanlines);

  // Aplicação de transform3d para garantir aceleração de hardware
  scanlines.style.transform = "translate3d(0,0,0)";
}

// Adiciona efeito de estática - VERSÃO OTIMIZADA
function addStaticEffect() {
  // Verifica se já existe o elemento
  if (document.querySelector(".static-effect")) return;

  // Verifica preferência por menos movimento
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Cria efeito estático
  const staticEffect = document.createElement("div");
  staticEffect.className = "static-effect";
  document.body.appendChild(staticEffect);

  // Aplicação de transform3d para garantir aceleração de hardware
  staticEffect.style.transform = "translate3d(0,0,0)";
}

// Processa submissão do formulário - VERSÃO OTIMIZADA
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simula envio (em produção usar serviço real para processar o formulário)
      const submitBtn = this.querySelector(".submit-btn");
      const btnText = submitBtn.querySelector(".btn-text");
      const btnIcon = submitBtn.querySelector(".btn-icon");

      // Desabilita botão para evitar envios duplicados
      submitBtn.disabled = true;

      // Muda o botão para estado de envio
      btnText.textContent = "ENVIANDO";
      btnIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

      // Simula resposta com requestAnimationFrame para melhor sincronização
      setTimeout(() => {
        // Limpa formulário
        this.reset();

        // Muda o botão para sucesso
        btnText.textContent = "ENVIADO!";
        btnIcon.innerHTML = '<i class="fas fa-check"></i>';

        // Exibe mensagem de sucesso com criação eficiente de elemento
        const formContainer = document.querySelector(".contact-form-container");

        // Verifica se já existe uma mensagem de sucesso para evitar duplicação
        if (!formContainer.querySelector(".success-message")) {
          const successMsg = document.createElement("div");
          successMsg.className = "success-message";
          successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Mensagem enviada com sucesso!</p>
          `;

          // Aplica animação de entrada suave com CSS
          successMsg.style.opacity = "0";
          successMsg.style.transform = "translateY(10px)";
          formContainer.appendChild(successMsg);

          // Força reflow para garantir que a transição seja aplicada
          successMsg.offsetHeight;

          // Aplica a transição
          successMsg.style.transition =
            "opacity 0.3s ease, transform 0.3s ease";
          successMsg.style.opacity = "1";
          successMsg.style.transform = "translateY(0)";
        }

        // Retorna ao estado original após 3 segundos
        setTimeout(() => {
          btnText.textContent = "ENVIAR";
          btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
          submitBtn.disabled = false;

          // Remove a mensagem após alguns segundos com animação de saída
          const successMsg = formContainer.querySelector(".success-message");
          if (successMsg) {
            successMsg.style.opacity = "0";
            successMsg.style.transform = "translateY(10px)";

            // Remove do DOM após a animação
            setTimeout(() => {
              if (successMsg.parentNode === formContainer) {
                formContainer.removeChild(successMsg);
              }
            }, 300);
          }
        }, 3000);
      }, 1500); // Reduzido para melhor UX
    });
  }
});
