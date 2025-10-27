/* ============================================
   Marketplace Solidário - Script Principal
   ============================================ */

/**
 * Função para rolar suavemente até uma seção específica
 * @param {string} sectionId - ID da seção para rolar
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Inicializar event listeners quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para os botões de ação
    const btnNecessidade = document.querySelector('[onclick="scrollToSection(\'doacao\')"]');
    const btnDoacao = document.querySelector('[onclick="scrollToSection(\'doar\')"]');

    if (btnNecessidade) {
        btnNecessidade.addEventListener('click', function() {
            console.log('Usuário clicou em "Preciso de Doação"');
            // Aqui você pode adicionar lógica para redirecionar ou abrir um modal
        });
    }

    if (btnDoacao) {
        btnDoacao.addEventListener('click', function() {
            console.log('Usuário clicou em "Faça Sua Doação"');
            // Aqui você pode adicionar lógica para redirecionar ou abrir um modal
        });
    }

    // Adicionar classe ativa ao link de navegação baseado na seção visível
    observeNavigation();

    // Adicionar efeito de scroll ao header
    handleHeaderScroll();
});

/**
 * Observar qual seção está visível e atualizar navegação
 */
function observeNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    const options = {
        threshold: 0.5,
        rootMargin: '-50% 0px -50% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remover classe ativa de todos os links
                navLinks.forEach(link => link.style.color = '');

                // Adicionar classe ativa ao link correspondente
                const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.style.color = 'var(--primary-orange)';
                }
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));
}

/**
 * Adicionar efeito visual ao header quando fazer scroll
 */
function handleHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

/**
 * Função para rastrear eventos (Analytics)
 * @param {string} eventName - Nome do evento
 * @param {object} eventData - Dados do evento
 */
function trackEvent(eventName, eventData = {}) {
    console.log(`Evento: ${eventName}`, eventData);
    
    // Aqui você pode integrar com Google Analytics ou outro serviço
    // if (window.gtag) {
    //     gtag('event', eventName, eventData);
    // }
}

/**
 * Função para validar email
 * @param {string} email - Email para validar
 * @returns {boolean} - True se válido, False caso contrário
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Função para mostrar notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, info)
 * @param {number} duration - Duração em milissegundos
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Função para adicionar estilos de animação dinamicamente
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Adicionar estilos de animação ao carregar
addAnimationStyles();

/**
 * Função para detectar suporte a WebP
 * @returns {boolean} - True se WebP é suportado
 */
function supportsWebP() {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Log de informações úteis para desenvolvimento
 */
console.log('Marketplace Solidário - Script Carregado');
console.log('Suporte a WebP:', supportsWebP());
console.log('Viewport Width:', window.innerWidth);
console.log('Viewport Height:', window.innerHeight);

