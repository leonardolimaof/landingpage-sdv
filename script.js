// script.js - comportamentos: header scrolled, mobile menu, reveal on scroll, counter, form submit + modal + theme toggle

// Sistema de Notificações
class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notification-container');
    this.notifications = [];
  }

  show(title, message, type = 'info', duration = 5000) {
    const notification = this.createElement(title, message, type);
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration);
    }

    return notification;
  }

  createElement(title, message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕', 
      warning: '!',
      info: 'i'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Fechar notificação">×</button>
    `;

    // Event listener para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  remove(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300);
  }

  success(title, message, duration = 5000) {
    return this.show(title, message, 'success', duration);
  }

  error(title, message, duration = 7000) {
    return this.show(title, message, 'error', duration);
  }

  warning(title, message, duration = 6000) {
    return this.show(title, message, 'warning', duration);
  }

  info(title, message, duration = 5000) {
    return this.show(title, message, 'info', duration);
  }
}

// Instância global do sistema de notificações
const notifications = new NotificationSystem();

// Sistema de Log personalizado (apenas para desenvolvimento)
const logger = {
  enabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  log(message, ...args) {
    if (this.enabled) {
      console.log(`🔍 [LOG]: ${message}`, ...args);
    }
  },
  
  error(message, error, ...args) {
    if (this.enabled) {
      console.error(`❌ [ERROR]: ${message}`, error, ...args);
    }
    // Sempre mostrar notificação de erro para o usuário
    notifications.error('Erro detectado', message);
  },
  
  warn(message, ...args) {
    if (this.enabled) {
      console.warn(`⚠️ [WARNING]: ${message}`, ...args);
    }
  },
  
  success(message, ...args) {
    if (this.enabled) {
      console.log(`✅ [SUCCESS]: ${message}`, ...args);
    }
  }
};

// Utilitário para verificação segura de elementos DOM
const safeElementQuery = {
  get(selector, context = document) {
    try {
      const element = context.querySelector(selector);
      if (!element) {
        logger.warn(`Elemento não encontrado: ${selector}`);
      }
      return element;
    } catch (error) {
      logger.error(`Erro ao buscar elemento: ${selector}`, error);
      return null;
    }
  },
  
  getAll(selector, context = document) {
    try {
      const elements = context.querySelectorAll(selector);
      if (elements.length === 0) {
        logger.warn(`Nenhum elemento encontrado: ${selector}`);
      }
      return elements;
    } catch (error) {
      logger.error(`Erro ao buscar elementos: ${selector}`, error);
      return [];
    }
  },
  
  getId(id) {
    try {
      const element = document.getElementById(id);
      if (!element) {
        logger.warn(`Elemento com ID não encontrado: ${id}`);
      }
      return element;
    } catch (error) {
      logger.error(`Erro ao buscar elemento por ID: ${id}`, error);
      return null;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS
  emailjs.init("YOUR_PUBLIC_KEY"); // Será configurado posteriormente
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  
  // Update icon based on current theme
  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  // Initialize icon
  updateThemeIcon(currentTheme);
  
  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  // header scroll effect
  const header = document.querySelector('.header');
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const onScrollHeader = () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader);

  // mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if(mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      const isOpen = mobileMenu.hasAttribute('data-open');
      
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      
      if (isOpen) {
        mobileMenu.removeAttribute('data-open');
      } else {
        mobileMenu.setAttribute('data-open', '');
      }
    });
  }

  // close mobile menu when clicking a link
  document.querySelectorAll('.mobile-link').forEach(el => {
    el.addEventListener('click', () => {
      if(mobileMenu) {
        mobileMenu.removeAttribute('data-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
      if(mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // simple reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.section, .card, .hero-text, .testimonial, .about-photo, .hero-card');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = 'none';
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => {
    r.style.opacity = 0;
    r.style.transform = 'translateY(30px)';
    revealObs.observe(r);
  });

  // counters and charts
  const counters = document.querySelectorAll('.counter');
  const charts = document.querySelectorAll('.circular-chart');
  const timeCharts = document.querySelectorAll('.time-progress');
  
  const chartObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate circular charts
        if (entry.target.classList.contains('circular-chart')) {
          animateCircularChart(entry.target);
        }
        // Animate counters (if any remaining)
        else if (entry.target.classList.contains('counter')) {
          const target = parseInt(entry.target.dataset.target || '0', 10);
          animateCounter(entry.target, target);
        }
        chartObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  // Observe charts and counters
  charts.forEach(c => chartObs.observe(c));
  counters.forEach(c => chartObs.observe(c));
  
  // Animate time progress bars
  const timeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateTimeChart(entry.target);
        timeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  
  timeCharts.forEach(c => timeObs.observe(c));

  function animateCircularChart(chart) {
    const circle = chart.querySelector('.circle');
    const text = chart.querySelector('.percentage');
    const target = parseInt(circle.dataset.target || '0', 10);
    const max = parseInt(circle.dataset.max || '100', 10);
    const percentage = Math.round((target / max) * 100);
    
    // Animate the circle
    const circumference = 2 * Math.PI * 15.9155;
    const dashArray = `${percentage}, 100`;
    
    setTimeout(() => {
      circle.style.strokeDasharray = dashArray;
    }, 200);
    
    // Animate the text
    animateTextCounter(text, target, chart.classList.contains('success'));
  }
  
  function animateTimeChart(progressBar) {
    const progress = parseInt(progressBar.dataset.progress || '0', 10);
    const max = parseInt(progressBar.dataset.max || '100', 10);
    const percentage = (progress / max) * 100;
    
    setTimeout(() => {
      progressBar.style.width = `${percentage}%`;
    }, 500);
  }
  
  function animateTextCounter(el, to, isPercentage = false) {
    const start = 0;
    const duration = 1800;
    const startTime = performance.now();
    
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * (to - start) + start);
      el.textContent = isPercentage ? `${current}%` : current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isPercentage ? `${to}%` : to;
    }
    requestAnimationFrame(step);
  }

  function animateCounter(el, to) {
    const start = 0;
    const duration = 1400;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * (to - start) + start);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = to;
    }
    requestAnimationFrame(step);
  }

  // Form submission with EmailJS
  const form = document.getElementById('contactForm');

  if(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;
      
      // Validação básica
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
      const mensagem = form.mensagem.value.trim();
      
      if (!nome || !email || !telefone || !mensagem) {
        notifications.error('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        notifications.error('Email inválido', 'Por favor, insira um email válido.');
        return;
      }

      // Loading state
      submitBtn.innerHTML = 'Enviando...';
      submitBtn.disabled = true;

      try {
        // Para funcionar, você precisa:
        // 1. Criar conta no EmailJS (https://www.emailjs.com/)
        // 2. Configurar um serviço de email
        // 3. Criar um template
        // 4. Substituir os valores abaixo pelos seus
        
        const templateParams = {
          to_email: 'leonardolima453@gmail.com',
          from_name: nome,
          from_email: email,
          phone: telefone,
          subject: form.assunto.value || 'Contato via Site',
          message: mensagem
        };

        // Simulação de envio (remova esta parte quando configurar EmailJS)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Uncomment when you have EmailJS configured:
        // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        
        // Show success modal APENAS após envio bem-sucedido
        const modal = document.getElementById('successModal');
        if(modal) {
          modal.hidden = false;
          const modalText = modal.querySelector('.modal-inner p');
          if(modalText) {
            modalText.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em até 24 horas úteis.';
          }
        }
        
        // Notificação de sucesso
        notifications.success('Mensagem enviada!', 'Entraremos em contato em até 24 horas úteis.');
        logger.success('Formulário de contato enviado com sucesso');
        
        // Reset form
        form.reset();
        
      } catch (error) {
        logger.error('Falha no envio do formulário de contato', error);
        notifications.error('Erro no envio', 'Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Setup modal close functionality
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');
  
  // Certifica que o modal está oculto no carregamento
  if(modal) {
    modal.hidden = true;
  }
  
  // Close modal button
  if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if(modal) modal.hidden = true;
    });
  }

  // close modal on ESC
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const modal = document.getElementById('successModal');
      if(modal) modal.hidden = true;
      
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileToggle = document.getElementById('mobileToggle');
      if (mobileMenu && mobileToggle) {
        mobileMenu.removeAttribute('data-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if(modal && e.target === modal) {
      modal.hidden = true;
    }
    
    // Close mobile menu when clicking outside
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    if(mobileMenu && mobileToggle && mobileMenu.hasAttribute('data-open')) {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.removeAttribute('data-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});
