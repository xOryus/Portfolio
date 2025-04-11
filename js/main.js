/**
 * MAIN.JS - PORTFÓLIO CYBERSECURITY
 * Funcionalidades principais do site
 */

// Inicializa quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa todas as funcionalidades
  initializeParticles();
  initializeNavigation();
  initializeScrollEffects();
  initializeCounters();
  addScanlines();
  addStaticEffect();

  // Inicializa o Security Dashboard (certificando-se que ele é carregado)
  if (typeof SecurityDashboard === "function") {
    const dashboard = new SecurityDashboard(".security-dashboard");
  }
});

// Configura efeito de partículas no fundo
function initializeParticles() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-bg", {
      particles: {
        number: {
          value: 80,
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
            speed: 0.5,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00a8ff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
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
            enable: true,
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
      retina_detect: true,
    });
  } else {
    console.warn("particles.js não está carregado");
  }
}

// Funcionalidades de navegação
function initializeNavigation() {
  // Menu mobile toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // Smooth scroll para links de navegação
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
        }

        const targetId = href;
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 70, // Ajusta para o header fixo
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Adiciona evento para fechar o menu ao clicar fora dele
  document.addEventListener("click", (e) => {
    // Verifica se o menu está aberto e o clique não foi no menu ou no botão do menu
    if (
      nav &&
      nav.classList.contains("active") &&
      !e.target.closest("nav") &&
      !e.target.closest(".menu-toggle")
    ) {
      nav.classList.remove("active");
    }
  });

  // Altera o header ao scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}

// Efeitos de scroll
function initializeScrollEffects() {
  // Animação de fade-in aos elementos ao fazer scroll
  const animateOnScroll = () => {
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
  animateOnScroll();

  // Adiciona ao evento de scroll
  window.addEventListener("scroll", animateOnScroll);
}

// Inicializa contadores
function initializeCounters() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const counterValue = counter.querySelector(".counter-value");

    if (!counterValue) return;

    const duration = 2000; // 2 segundos
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    let value = 0;

    // Função para verificar se o elemento está visível na tela
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    // Inicia o contador quando visível
    const startCounterIfVisible = () => {
      if (isElementInViewport(counter) && frame === 0) {
        // Anima o contador
        const animate = () => {
          frame++;
          // Usa easing para desacelerar no final
          const progress = frame / totalFrames;
          const easedProgress =
            progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          value = Math.floor(easedProgress * target);

          counterValue.textContent = value;

          if (frame < totalFrames) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    };

    // Verifica visibilidade no scroll
    window.addEventListener("scroll", startCounterIfVisible);

    // Verifica no carregamento inicial
    startCounterIfVisible();
  });
}

// Adiciona efeito de scanlines
function addScanlines() {
  if (!document.querySelector(".scanlines")) {
    const scanlines = document.createElement("div");
    scanlines.className = "scanlines";
    document.body.appendChild(scanlines);
  }
}

// Adiciona efeito de estática
function addStaticEffect() {
  if (!document.querySelector(".static-effect")) {
    const staticEffect = document.createElement("div");
    staticEffect.className = "static-effect";
    document.body.appendChild(staticEffect);
  }
}

// Processa submissão do formulário
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simula envio (em produção usar serviço real para processar o formulário)
      const submitBtn = this.querySelector(".submit-btn");
      const btnText = submitBtn.querySelector(".btn-text");
      const btnIcon = submitBtn.querySelector(".btn-icon");

      // Muda o botão para estado de envio
      btnText.textContent = "ENVIANDO";
      btnIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

      // Simula resposta após 2 segundos
      setTimeout(() => {
        // Limpa formulário
        this.reset();

        // Muda o botão para sucesso
        btnText.textContent = "ENVIADO!";
        btnIcon.innerHTML = '<i class="fas fa-check"></i>';

        // Retorna ao estado original após 3 segundos
        setTimeout(() => {
          btnText.textContent = "ENVIAR";
          btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }, 3000);

        // Exibe mensagem de sucesso
        const formContainer = document.querySelector(".contact-form-container");
        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Mensagem enviada com sucesso!</p>
                `;

        formContainer.appendChild(successMsg);

        // Remove a mensagem após alguns segundos
        setTimeout(() => {
          if (successMsg.parentNode === formContainer) {
            formContainer.removeChild(successMsg);
          }
        }, 5000);
      }, 2000);
    });
  }
});
