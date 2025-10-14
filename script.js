 // MENU MOBILE
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // SCROLL SUAVE PARA ÂNCORAS
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Fechar menu mobile após clique
                    navMenu.classList.remove('active');
                }
            });
        });

        // ANIMAÇÕES DE SCROLL PROFISSIONAIS
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animação de contador
                    if (entry.target.classList.contains('counter')) {
                        animateCounter(entry.target);
                    }
                    
                    // Animação de barra de progresso
                    if (entry.target.classList.contains('progress-fill')) {
                        entry.target.style.width = entry.target.style.getPropertyValue('--progress-width');
                    }
                }
            });
        }, observerOptions);

        // Observar todos os elementos com classes de animação
        const animationClasses = [
            '.fade-in', '.slide-in-left', '.slide-in-right', '.scale-in', 
            '.rotate-in', '.bounce-in', '.flip-in', '.zoom-in', '.text-reveal',
            '.line-draw', '.counter', '.progress-fill'
        ];

        animationClasses.forEach(className => {
            document.querySelectorAll(className).forEach(el => {
                observer.observe(el);
            });
        });

        // FUNÇÃO DE ANIMAÇÃO DE CONTADOR
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        }

        // ANIMAÇÃO DE TYPEWRITER PARA TÍTULOS
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // EFEITO DE PARTÍCULAS INTERATIVAS
        function createParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.position = 'fixed';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }

        // ADICIONAR PARTÍCULAS NO CLIQUE
        document.addEventListener('click', function(e) {
            if (Math.random() > 0.7) { // 30% de chance
                createParticle(e.clientX, e.clientY);
            }
        });



        // EFEITO DE MORPHING SUAVE NOS CAMPOS
        document.querySelectorAll('.morph').forEach(element => {
            element.addEventListener('focus', function() {
                this.style.borderRadius = '25px';
            });
            
            element.addEventListener('blur', function() {
                this.style.borderRadius = '20px';
            });
        });

        // ANIMAÇÃO DE LOADING NO BOTÃO
        const submitBtn = document.querySelector('.submit-btn');
        const loadingDots = submitBtn.querySelector('.loading-dots');
        
        function showLoading() {
            submitBtn.style.position = 'relative';
            submitBtn.style.color = 'transparent';
            loadingDots.style.display = 'inline-flex';
            loadingDots.style.position = 'absolute';
            loadingDots.style.top = '50%';
            loadingDots.style.left = '50%';
            loadingDots.style.transform = 'translate(-50%, -50%)';
        }
        
        function hideLoading() {
            submitBtn.style.color = 'white';
            loadingDots.style.display = 'none';
        }

        // PARALLAX SUAVE APENAS NO HERO
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            // Parallax apenas no hero
            const hero = document.querySelector('.hero');
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // ANIMAÇÃO DE ENTRADA SEQUENCIAL
        function staggerAnimation(elements, delay = 100) {
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * delay);
            });
        }

        // EFEITO DE REVEAL DE TEXTO AVANÇADO
        function revealText(element) {
            const text = element.textContent;
            element.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                span.style.transition = `all 0.3s ease ${index * 0.05}s`;
                element.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 100);
            });
        }

        // APLICAR REVEAL DE TEXTO AOS TÍTULOS
        setTimeout(() => {
            document.querySelectorAll('.text-reveal.visible').forEach(element => {
                if (!element.dataset.revealed) {
                    revealText(element);
                    element.dataset.revealed = 'true';
                }
            });
        }, 500);

        // FORMULÁRIO DE CONTATO
        const contactForm = document.getElementById('contactForm');
        const successModal = document.getElementById('successModal');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            if (!nome || !email || !telefone || !mensagem) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Mostrar loading
            showLoading();
            
            // Simular envio (em produção, aqui seria feita a integração com backend)
            setTimeout(() => {
                hideLoading();
                successModal.style.display = 'block';
                contactForm.reset();
            }, 2000);
        });

        // FECHAR MODAL
        function closeModal() {
            successModal.style.display = 'none';
        }

        // Fechar modal clicando fora dele
        window.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeModal();
            }
        });

        // MÁSCARA PARA TELEFONE
        const telefoneInput = document.getElementById('telefone');
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });

        // EFEITO PARALLAX SUAVE NO HERO
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // DESTACAR MENU ATIVO BASEADO NA SEÇÃO VISÍVEL
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${current}`) {
                    link.style.color = '#90cdf4';
                }
            });
        });

        (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98e4127bd6a56f8c',t:'MTc2MDQxMzQwMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();