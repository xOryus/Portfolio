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
  initializeAdvancedCounters(); // Usando nova função de contador simplificada
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

  // Configura o formulário de contato
  setupContactForm();
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

// Configura efeito de partículas no fundo - VERSÃO REFATORADA
function initializeParticles() {
  if (typeof particlesJS === "undefined") {
    console.warn("particles.js não está carregado");
    return;
  }

  // Configuração adaptativa baseada no dispositivo
  const config = createParticlesConfig();
  particlesJS("particles-bg", config);
}

// Cria a configuração para as partículas baseado no tipo de dispositivo
function createParticlesConfig() {
  // Detecta capacidade do dispositivo para ajustar configurações
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Configurações otimizadas baseadas no tipo de dispositivo
  const particleCount = isMobile ? 40 : 80;
  const particleSpeed = isMobile ? 0.8 : 1;
  const lineOpacity = isMobile ? 0.3 : 0.4;

  return {
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
      opacity: createOpacityConfig(particleSpeed),
      size: createSizeConfig(isMobile, particleSpeed),
      line_linked: createLineConfig(isMobile, lineOpacity),
      move: createMoveConfig(particleSpeed),
    },
    interactivity: createInteractivityConfig(isMobile),
    retina_detect: !isMobile, // Desativa em mobile para melhor desempenho
  };
}

// Configuração de opacidade das partículas
function createOpacityConfig(particleSpeed) {
  return {
    value: 0.5,
    random: true,
    anim: {
      enable: true,
      speed: 0.5 * particleSpeed,
      opacity_min: 0.1,
      sync: false,
    },
  };
}

// Configuração de tamanho das partículas
function createSizeConfig(isMobile, particleSpeed) {
  return {
    value: isMobile ? 2 : 3,
    random: true,
    anim: {
      enable: true,
      speed: 1 * particleSpeed,
      size_min: 0.1,
      sync: false,
    },
  };
}

// Configuração das linhas entre partículas
function createLineConfig(isMobile, lineOpacity) {
  return {
    enable: true,
    distance: isMobile ? 120 : 150,
    color: "#00a8ff",
    opacity: lineOpacity,
    width: isMobile ? 0.8 : 1,
  };
}

// Configuração de movimentação das partículas
function createMoveConfig(particleSpeed) {
  return {
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
  };
}

// Configuração de interatividade das partículas
function createInteractivityConfig(isMobile) {
  return {
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
  };
}

// Funcionalidades de navegação - VERSÃO REFATORADA
function initializeNavigation() {
  setupMobileMenu();
  setupSmoothScrolling();
  setupHeaderScrollEffect();
}

// Configura o menu mobile
function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (!(menuToggle && nav)) return;

  // Alternância do menu mobile
  menuToggle.addEventListener("click", () => {
    toggleMobileMenu(nav);
  });

  // Adiciona handler para fechar o menu ao clicar fora
  document.addEventListener("click", handleOutsideClick);
}

// Função separada para verificar e lidar com cliques fora do menu
function handleOutsideClick(e) {
  const nav = document.querySelector("nav");
  if (!nav || !nav.classList.contains("active")) return;

  const isClickedOutside =
    !e.target.closest("nav") && !e.target.closest(".menu-toggle");

  if (isClickedOutside) {
    toggleMobileMenu(nav, false);
  }
}

// Função auxiliar para alternar estado do menu
function toggleMobileMenu(nav, force) {
  const newState =
    force !== undefined ? force : !nav.classList.contains("active");

  if (newState) {
    nav.classList.add("active");
    document.body.classList.add("menu-open");
  } else {
    nav.classList.remove("active");
    document.body.classList.remove("menu-open");
  }
}

// Configura rolagem suave para links de navegação
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll(
    ".nav-link, .footer-links a, .scroll-indicator"
  );
  const nav = document.querySelector("nav");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Apenas processa links de âncora
      if (!href || !href.startsWith("#")) return;

      e.preventDefault();
      const targetSection = document.querySelector(href);

      // Só continua se o elemento alvo existir
      if (!targetSection) return;

      // Fecha menu mobile se estiver aberto
      if (nav && nav.classList.contains("active")) {
        toggleMobileMenu(nav, false);
      }

      // Rolagem suave
      scrollToSection(targetSection, href);
    });
  });
}

// Função para rolar suavemente para uma seção
function scrollToSection(section, href) {
  // Rolagem suave usando API nativa
  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });

  // Atualiza URL sem causar scroll adicional
  if (history.pushState) {
    history.pushState(null, null, href);
  }
}

// Efeito de scroll no cabeçalho
function setupHeaderScrollEffect() {
  const headerScroll = throttle(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const scrolled = window.scrollY > 50;
    header.classList.toggle("scrolled", scrolled);
  }, 100);

  window.addEventListener("scroll", headerScroll);
}

// Efeitos de scroll - VERSÃO REFATORADA
function initializeScrollEffects() {
  // Detecta suporte a IntersectionObserver
  const hasIntersectionObserver = "IntersectionObserver" in window;

  if (!hasIntersectionObserver) {
    setupLegacyScrollEffects();
    return;
  }

  // Configura animações baseadas em IntersectionObserver
  setupModernScrollEffects();
}

// Configuração de animações de scroll para navegadores modernos
function setupModernScrollEffects() {
  setupCertificationAnimations();
  setupRegularElementAnimations();
}

// Configura animações para certificações e badges
function setupCertificationAnimations() {
  const certObserverOptions = {
    root: null,
    rootMargin: "0px 0px -5% 0px",
    threshold: 0.1,
  };

  const certObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-up");
        observer.unobserve(entry.target);
      }
    });
  }, certObserverOptions);

  // Observa elementos de certificação
  document
    .querySelectorAll(".certification-card, .badge")
    .forEach((element) => {
      certObserver.observe(element);
    });
}

// Configura animações para outros elementos (timeline, projetos)
function setupRegularElementAnimations() {
  const regularObserverOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const regularObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateWithDelay(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, regularObserverOptions);

  // Observa elementos regulares com delay escalonado
  const regularElements = document.querySelectorAll(
    ".timeline-item, .project-card"
  );
  regularElements.forEach((element, index) => {
    element.dataset.animationDelay = index % 5;
    regularObserver.observe(element);
  });
}

// Aplica animação com delay escalonado
function animateWithDelay(element) {
  const delay = element.dataset.animationDelay || 0;
  setTimeout(() => {
    element.classList.add("slide-up");
  }, delay * 50);
}

// Configuração de efeitos de scroll para navegadores legados
function setupLegacyScrollEffects() {
  const animateVisibleElements = () => {
    const elements = document.querySelectorAll(
      ".timeline-item, .certification-card, .project-card, .badge"
    );

    elements.forEach((element) => {
      const isVisible = isElementInViewport(element, 150);
      if (isVisible) {
        element.classList.add("slide-up");
      }
    });
  };

  // Executa primeiro para elementos já visíveis na carga inicial
  animateVisibleElements();

  // Adiciona ao evento de scroll com throttle para melhor performance
  window.addEventListener("scroll", throttle(animateVisibleElements, 100));
}

// Função auxiliar para verificar se elemento está visível
function isElementInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight - offset;
}

// Sistema de animação de contador - VERSÃO SIMPLIFICADA
function initializeAdvancedCounters() {
  // Uso prioritário da implementação em animations.js
  if (typeof initCounterAnimations === "function") {
    initCounterAnimations();
    return;
  }

  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  // Detecta preferências e capacidades do navegador
  const options = {
    useObserver: "IntersectionObserver" in window,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  };

  // Seleciona a estratégia apropriada baseada nos recursos disponíveis
  if (options.useObserver) {
    setupObserverBasedCounters(counters, options);
  } else {
    setupLegacyCounters(counters, options);
  }
}

// Configura contadores usando IntersectionObserver
function setupObserverBasedCounters(counters, options) {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initializeCounter(entry.target, options.reducedMotion);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => counterObserver.observe(counter));
}

// Configura contadores para navegadores sem suporte a IntersectionObserver
function setupLegacyCounters(counters, options) {
  counters.forEach((counter) => {
    initializeCounter(counter, options.reducedMotion);
  });
}

// Prepara e inicia a animação de um contador individual
function initializeCounter(counter, reducedMotion) {
  // Previne inicialização dupla
  if (counter.dataset.counted === "true") return;

  counter.dataset.counted = "true";
  counter.classList.add("visible-counter");

  // Pequeno atraso para melhor efeito visual
  setTimeout(() => {
    animateSimpleCounter(counter, reducedMotion);
  }, 200);
}

// Versão simplificada de animação de contador
function animateSimpleCounter(counter, reducedMotion) {
  const targetValue = parseFloat(
    counter.getAttribute("data-target").replace(/[^\d.-]/g, "")
  );
  const counterDisplay = counter.querySelector(".counter-value") || counter;

  // Para preferência de movimento reduzido, apenas define o valor final
  if (reducedMotion) {
    counterDisplay.textContent = formatCounterValue(targetValue);
    counter.classList.add("counter-complete");
    return;
  }

  // Configurações de animação simplificadas
  const duration = 1500;
  const steps = 30;
  const stepDuration = duration / steps;

  let currentStep = 0;

  // Anima em passos para melhor performance
  const counterInterval = setInterval(() => {
    currentStep++;

    // Easing simples
    const progress = currentStep / steps;
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    const currentValue = Math.floor(easedProgress * targetValue);
    counterDisplay.textContent = formatCounterValue(currentValue);

    if (currentStep >= steps) {
      clearInterval(counterInterval);
      counterDisplay.textContent = formatCounterValue(targetValue);
      counter.classList.add("counter-complete");
    }
  }, stepDuration);
}

// Formatador simples para valores numéricos
function formatCounterValue(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

// Configura o formulário de contato
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", handleFormSubmit);
}

// Manipula o envio do formulário
function handleFormSubmit(e) {
  e.preventDefault();

  const form = this;
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector(".btn-icon");
  const formContainer = document.querySelector(".contact-form-container");

  // Verifica se já está processando
  if (submitBtn.disabled) return;

  // Atualiza estado do botão para "enviando"
  updateButtonState(submitBtn, btnText, btnIcon, "sending");

  // Simula envio (em produção usar serviço real)
  simulateFormSubmission({
    form,
    button: submitBtn,
    textElement: btnText,
    iconElement: btnIcon,
    container: formContainer,
  });
}

// Atualiza o estado do botão de envio
function updateButtonState(button, textElement, iconElement, state) {
  // Estados possíveis: default, sending, sent
  const states = {
    default: {
      disabled: false,
      text: "ENVIAR",
      icon: '<i class="fas fa-paper-plane"></i>',
    },
    sending: {
      disabled: true,
      text: "ENVIANDO",
      icon: '<i class="fas fa-circle-notch fa-spin"></i>',
    },
    sent: {
      disabled: true,
      text: "ENVIADO!",
      icon: '<i class="fas fa-check"></i>',
    },
  };

  const newState = states[state] || states.default;

  button.disabled = newState.disabled;
  textElement.textContent = newState.text;
  iconElement.innerHTML = newState.icon;
}

// Simula o envio do formulário
function simulateFormSubmission(context) {
  const { form, button, textElement, iconElement, container } = context;

  setTimeout(() => {
    // Limpa formulário e atualiza estado do botão
    form.reset();
    updateButtonState(button, textElement, iconElement, "sent");

    // Mostra mensagem de sucesso
    showSuccessMessage(container);

    // Restaura estado original após 3 segundos
    setTimeout(() => {
      updateButtonState(button, textElement, iconElement, "default");
      hideSuccessMessage(container);
    }, 3000);
  }, 1500);
}

// Mostra mensagem de sucesso
function showSuccessMessage(container) {
  // Evita duplicação
  if (container.querySelector(".success-message")) return;

  const successMsg = document.createElement("div");
  successMsg.className = "success-message";
  successMsg.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Mensagem enviada com sucesso!</p>
  `;

  // Aplica animação de entrada
  successMsg.style.opacity = "0";
  successMsg.style.transform = "translateY(10px)";
  container.appendChild(successMsg);

  // Força reflow para garantir a transição
  successMsg.offsetHeight;

  // Aplica a transição
  successMsg.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  successMsg.style.opacity = "1";
  successMsg.style.transform = "translateY(0)";
}

// Esconde mensagem de sucesso
function hideSuccessMessage(container) {
  const successMsg = container.querySelector(".success-message");
  if (!successMsg) return;

  // Anima a saída
  successMsg.style.opacity = "0";
  successMsg.style.transform = "translateY(10px)";

  // Remove do DOM após a animação
  setTimeout(() => {
    if (successMsg.parentNode === container) {
      container.removeChild(successMsg);
    }
  }, 300);
}
