// main.js - Funciones generales para todo el sitio - UNIVERSIDAD ESPAM MFL

document.addEventListener('DOMContentLoaded', function() {
    // Aplicar estilos institucionales ESPAM
    aplicarEstilosInstitucionales();
    
    // 1. Inicializar navegación responsive
    initResponsiveNav();
    
    // 2. Configurar enlaces activos
    highlightActiveLinks();
    
    // 3. Inicializar animaciones
    initAnimations();
    
    // 4. Configurar modales
    initModals();
    
    // 5. Manejar formularios de contacto ESPAM
    initContactForms();
    
    // 6. Verificar sesión activa ESPAM
    checkActiveSession();
    
    // 7. Cargar datos iniciales ESPAM
    loadInitialData();
});

// Aplicar estilos institucionales ESPAM MFL
function aplicarEstilosInstitucionales() {
    const coloresESPAM = {
        primario: "#005846",      // Color principal ESPAM
        secundario1: "#39b54a",   // Verde institucional
        secundario2: "#cbdb2a",   // Amarillo verdoso
        secundario3: "#08b89d",   // Turquesa
        fondoClaro: "#F8F8F2",    // Fondo claro / Pantone 663 C
        blanco: "#FFFFFF",
        grisClaro: "#F8F9FA",
        grisMedio: "#6C757D",
        grisOscuro: "#343A40"
    };

    // Crear y agregar estilos CSS dinámicos
    const estilos = document.createElement('style');
    estilos.id = 'main-estilos-espam';
    estilos.textContent = `
        /* ESTILOS INSTITUCIONALES ESPAM MFL - MAIN */
        
        /* Variables de color ESPAM */
        :root {
            --espam-color-primario: ${coloresESPAM.primario};
            --espam-color-secundario-1: ${coloresESPAM.secundario1};
            --espam-color-secundario-2: ${coloresESPAM.secundario2};
            --espam-color-secundario-3: ${coloresESPAM.secundario3};
            --espam-color-fondo-claro: ${coloresESPAM.fondoClaro};
        }
        
        /* Header ESPAM */
        .header {
            background: linear-gradient(135deg, ${coloresESPAM.primario} 0%, rgba(0, 88, 70, 0.9) 100%) !important;
        }
        
        .main-nav a:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }
        
        .main-nav a.active {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-bottom: 2px solid ${coloresESPAM.secundario2} !important;
        }
        
        /* Botones ESPAM */
        .btn-primary, .btn-login {
            background-color: ${coloresESPAM.primario} !important;
            border-color: ${coloresESPAM.primario} !important;
            font-family: 'Work Sans', sans-serif !important;
            font-weight: 600 !important;
        }
        
        .btn-primary:hover, .btn-login:hover {
            background-color: #004235 !important;
            border-color: #004235 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0, 88, 70, 0.2) !important;
        }
        
        .btn-secondary {
            background-color: ${coloresESPAM.secundario3} !important;
            border-color: ${coloresESPAM.secundario3} !important;
            font-family: 'Work Sans', sans-serif !important;
        }
        
        /* Hero section ESPAM */
        .hero {
            background: linear-gradient(rgba(0, 88, 70, 0.9), rgba(57, 181, 74, 0.8)) !important;
        }
        
        /* Laboratorios ESPAM */
        .lab-card {
            border-top: 3px solid ${coloresESPAM.primario} !important;
        }
        
        .btn-lab {
            background-color: ${coloresESPAM.secundario3} !important;
            border-color: ${coloresESPAM.secundario3} !important;
        }
        
        .btn-lab:hover {
            background-color: transparent !important;
            color: ${coloresESPAM.secundario3} !important;
            border-color: ${coloresESPAM.secundario3} !important;
        }
        
        /* Footer ESPAM */
        .footer {
            background-color: ${coloresESPAM.primario} !important;
        }
        
        .footer-section h4 {
            color: ${coloresESPAM.secundario2} !important;
        }
        
        /* Tipografías ESPAM */
        h1, h2, h3, h4, .title-container h1, .hero h2, .section-title {
            font-family: 'Libertad Mono', monospace !important;
            font-weight: 700 !important;
        }
        
        body, p, .subtitle, .hero p, .lab-card p, .footer-section p {
            font-family: 'Work Sans', sans-serif !important;
        }
        
        /* Animaciones ESPAM */
        @keyframes fadeInESPAM {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRightESPAM {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* Notificaciones ESPAM */
        .notification.success {
            background-color: ${coloresESPAM.secundario1} !important;
            border-left: 4px solid ${coloresESPAM.secundario1} !important;
        }
        
        .notification.error {
            background-color: #dc3545 !important;
            border-left: 4px solid #dc3545 !important;
        }
        
        .notification.warning {
            background-color: ${coloresESPAM.secundario2} !important;
            border-left: 4px solid ${coloresESPAM.secundario2} !important;
        }
        
        .notification.info {
            background-color: ${coloresESPAM.secundario3} !important;
            border-left: 4px solid ${coloresESPAM.secundario3} !important;
        }
    `;
    document.head.appendChild(estilos);
    
    // Agregar clase al body para identificación ESPAM
    document.body.classList.add('sistema-espam-mfl');
}

// 1. Navegación responsive ESPAM
function initResponsiveNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        // Aplicar estilo institucional al botón toggle
        menuToggle.style.color = '#005846';
        
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Cambiar ícono
            const icon = this.querySelector('i');
            if (icon) {
                if (this.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace (en móviles)
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.style.fontFamily = "'Work Sans', sans-serif";
        link.style.fontWeight = "500";
        
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
}

// 2. Resaltar enlaces activos ESPAM
function highlightActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        }
    });
}

// 3. Animaciones ESPAM
function initAnimations() {
    // Animación de aparición suave para elementos
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Si es una tarjeta de estadística, animar contador
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-target') || entry.target.textContent);
                    animateCounterESPAM(entry.target, target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos con clase 'animate-on-scroll'
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Animación para tarjetas de laboratorios ESPAM
    const labCards = document.querySelectorAll('.lab-card');
    labCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.border = '1px solid rgba(0, 88, 70, 0.1)';
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0, 88, 70, 0.15)';
            this.style.borderColor = '#08b89d';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            this.style.borderColor = 'rgba(0, 88, 70, 0.1)';
        });
        
        // Aplicar tipografía institucional
        const cardTitle = card.querySelector('h3');
        if (cardTitle) {
            cardTitle.style.fontFamily = "'Libertad Mono', monospace";
            cardTitle.style.color = '#005846';
            cardTitle.style.fontWeight = '700';
        }
        
        const cardText = card.querySelector('p');
        if (cardText) {
            cardText.style.fontFamily = "'Work Sans', sans-serif";
        }
    });
}

// Animación de contador ESPAM
function animateCounterESPAM(element, target) {
    let current = 0;
    const increment = target / 50; // 50 pasos
    const duration = 1500; // 1.5 segundos
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, stepTime);
}

// 4. Modales ESPAM
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    // Abrir modales
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Aplicar estilos institucionales al modal
                aplicarEstilosModalESPAM(modal);
            }
        });
    });
    
    // Cerrar modales
    modals.forEach(modal => {
        // Botón de cerrar
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.style.fontFamily = "'Work Sans', sans-serif";
            closeBtn.style.color = '#005846';
            
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modals.forEach(m => {
                    m.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            }
        });
    });
}

function aplicarEstilosModalESPAM(modal) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.fontFamily = "'Work Sans', sans-serif";
        modalContent.style.borderTop = '4px solid #005846';
        
        // Aplicar estilos a títulos dentro del modal
        const modalTitles = modalContent.querySelectorAll('h2, h3, h4');
        modalTitles.forEach(title => {
            title.style.fontFamily = "'Libertad Mono', monospace";
            title.style.color = '#005846';
            title.style.fontWeight = '700';
        });
        
        // Aplicar estilos a botones dentro del modal
        const modalButtons = modalContent.querySelectorAll('button');
        modalButtons.forEach(button => {
            if (button.classList.contains('btn-primary')) {
                button.style.backgroundColor = '#005846';
                button.style.borderColor = '#005846';
                button.style.fontFamily = "'Work Sans', sans-serif";
            } else if (button.classList.contains('btn-secondary')) {
                button.style.backgroundColor = '#08b89d';
                button.style.borderColor = '#08b89d';
                button.style.fontFamily = "'Work Sans', sans-serif";
            }
        });
    }
}

// 5. Formularios de contacto ESPAM
function initContactForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Aplicar estilos institucionales a los inputs
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.fontFamily = "'Work Sans', sans-serif";
            input.style.borderColor = '#ddd';
            
            input.addEventListener('focus', function() {
                this.style.borderColor = '#005846';
                this.style.boxShadow = '0 0 0 3px rgba(0, 88, 70, 0.1)';
            });
            
            input.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
                this.style.boxShadow = 'none';
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario ESPAM
            if (validateContactFormESPAM()) {
                // Simular envío
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando a ESPAM...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                
                // Simular delay de envío
                setTimeout(() => {
                    showNotificationESPAM('Mensaje enviado exitosamente al equipo ESPAM. Nos pondremos en contacto pronto.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 2000);
            }
        });
    }
}

function validateContactFormESPAM() {
    const nombre = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const mensaje = document.getElementById('contactMessage');
    let isValid = true;
    
    // Validar nombre
    if (!nombre.value.trim()) {
        showFieldErrorESPAM(nombre, 'El nombre es requerido - ESPAM');
        isValid = false;
    } else {
        clearFieldErrorESPAM(nombre);
    }
    
    // Validar email
    if (!email.value.trim()) {
        showFieldErrorESPAM(email, 'El email es requerido - ESPAM');
        isValid = false;
    } else if (!isValidEmailESPAM(email.value)) {
        showFieldErrorESPAM(email, 'Ingrese un email válido de ESPAM');
        isValid = false;
    } else {
        clearFieldErrorESPAM(email);
    }
    
    // Validar mensaje
    if (!mensaje.value.trim()) {
        showFieldErrorESPAM(mensaje, 'El mensaje es requerido - ESPAM');
        isValid = false;
    } else if (mensaje.value.trim().length < 10) {
        showFieldErrorESPAM(mensaje, 'El mensaje debe tener al menos 10 caracteres - ESPAM');
        isValid = false;
    } else {
        clearFieldErrorESPAM(mensaje);
    }
    
    return isValid;
}

function isValidEmailESPAM(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldErrorESPAM(field, message) {
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    
    // Mostrar mensaje de error ESPAM
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message-espam')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message-espam';
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 5px;
            font-family: 'Work Sans', sans-serif;
            font-weight: 500;
        `;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    errorElement.textContent = message;
}

function clearFieldErrorESPAM(field) {
    field.style.borderColor = '#ddd';
    field.style.boxShadow = 'none';
    
    // Eliminar mensaje de error
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message-espam')) {
        errorElement.remove();
    }
}

// 6. Verificar sesión activa ESPAM (Supabase con fallback)
async function checkActiveSession() {
    try {
        let perfil = null;

        // Intentar Supabase primero
        if (window.AuthService) {
            const sesion = await AuthService.getSesion();
            if (sesion.session && sesion.perfil) {
                perfil = sesion.perfil;
            }
        }

        // Fallback a localStorage
        if (!perfil) {
            const sessionData = SessionHelper
                ? SessionHelper.obtenerSesionLegacy()
                : JSON.parse(localStorage.getItem('espam_userSession') || sessionStorage.getItem('espam_userSession') || '{}');

            if (sessionData.loggedIn) {
                perfil = { tipo: sessionData.tipo, nombre: sessionData.nombre };
            }
        }

        // Si hay sesión activa y estamos en la página de inicio, mostrar botón de dashboard
        if (perfil && window.location.pathname.includes('index.html')) {
            const loginBtn = document.querySelector('.btn-login');
            if (loginBtn) {
                loginBtn.textContent = `Ir al Dashboard - ${getRolTextESPAM(perfil.tipo)}`;
                loginBtn.href = getDashboardUrlESPAM(perfil.tipo);
                loginBtn.style.backgroundColor = '#39b54a';
                loginBtn.style.borderColor = '#39b54a';
            }
        }
    } catch (error) {
        console.log('No hay sesión activa ESPAM');
    }
}

function getDashboardUrlESPAM(userType) {
    switch(userType) {
        case 'tecnico':
            return 'dashboard-tecnico.html';
        case 'docente':
            return 'dashboard-docente.html';
        case 'estudiante':
            return 'dashboard-estudiante.html';
        case 'admin':
            return 'dashboard-admin.html';
        default:
            return 'login.html';
    }
}

function getRolTextESPAM(tipo) {
    const roles = {
        'tecnico': 'Técnico ESPAM',
        'docente': 'Docente ESPAM',
        'estudiante': 'Estudiante ESPAM',
        'admin': 'Admin ESPAM'
    };
    return roles[tipo] || 'ESPAM';
}

// 7. Cargar datos iniciales ESPAM
function loadInitialData() {
    // Cargar estadísticas de laboratorios ESPAM
    loadLabStatsESPAM();
    
    // Cargar eventos próximos ESPAM
    loadUpcomingEventsESPAM();
    
    // Inicializar tooltips ESPAM
    initTooltipsESPAM();
}

function loadLabStatsESPAM() {
    // En producción, esto vendría de una API ESPAM
    const stats = {
        totalLabs: 4,
        activeReservations: 24,
        totalUsers: 156,
        satisfactionRate: 4.6,
        practicasMes: 89,
        institucion: 'ESPAM MFL'
    };
    
    // Actualizar UI si existen elementos para mostrar stats
    const statsElements = {
        'total-labs': { value: stats.totalLabs, label: 'Laboratorios ESPAM' },
        'active-reservations': { value: stats.activeReservations, label: 'Reservas Activas' },
        'total-users': { value: stats.totalUsers, label: 'Usuarios ESPAM' },
        'satisfaction-rate': { value: stats.satisfactionRate, label: 'Satisfacción' },
        'practicas-mes': { value: stats.practicasMes, label: 'Prácticas/Mes' }
    };
    
    Object.entries(statsElements).forEach(([id, data]) => {
        const element = document.getElementById(id);
        if (element) {
            // Si el elemento es un contador, animarlo
            if (element.classList.contains('stat-number') || element.classList.contains('counter')) {
                animateCounterESPAM(element, data.value);
            } else {
                element.textContent = data.value;
            }
            
            // Agregar label si existe elemento hermano
            const labelElement = element.nextElementSibling;
            if (labelElement && labelElement.classList.contains('stat-label')) {
                labelElement.textContent = data.label;
            }
        }
    });
}

function loadUpcomingEventsESPAM() {
    // Datos de ejemplo ESPAM
    const events = [
        { date: '15/01', lab: 'Bromatología ESPAM', time: '08:00-12:00', course: 'Análisis de Alimentos', color: '#005846' },
        { date: '16/01', lab: 'Producción ESPAM', time: '14:00-18:00', course: 'Procesos Industriales', color: '#08b89d' },
        { date: '17/01', lab: 'Biología ESPAM', time: '10:00-12:00', course: 'Microbiología', color: '#39b54a' },
        { date: '18/01', lab: 'Química ESPAM', time: '09:00-11:00', course: 'Análisis Químico', color: '#cbdb2a' }
    ];
    
    const eventsContainer = document.getElementById('upcoming-events');
    if (eventsContainer) {
        let html = '';
        events.forEach(event => {
            html += `
                <div class="event-item" style="border-left: 4px solid ${event.color};">
                    <div class="event-date" style="font-family: 'Libertad Mono', monospace; font-weight: 700; color: ${event.color};">${event.date}</div>
                    <div class="event-info">
                        <div class="event-lab" style="font-family: 'Work Sans', sans-serif; font-weight: 600;">${event.lab}</div>
                        <div class="event-time" style="font-family: 'Work Sans', sans-serif; color: #6C757D;">${event.time} • ${event.course}</div>
                    </div>
                </div>
            `;
        });
        eventsContainer.innerHTML = html;
    }
}

function initTooltipsESPAM() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip-espam';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: fixed;
                background-color: #005846;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: 'Work Sans', sans-serif;
                font-size: 0.85rem;
                z-index: 10000;
                pointer-events: none;
                animation: fadeInESPAM 0.2s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.custom-tooltip-espam');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Función para mostrar notificaciones ESPAM
function showNotificationESPAM(message, type = 'info') {
    // Eliminar notificación anterior si existe
    const oldNotification = document.querySelector('.notification-espam');
    if (oldNotification) oldNotification.remove();
    
    // Determinar color según tipo (usando colores institucionales)
    let color, icono;
    switch(type) {
        case 'success':
            color = '#39b54a'; // Verde institucional
            icono = 'check-circle';
            break;
        case 'error':
            color = '#dc3545'; // Rojo (mantenido)
            icono = 'exclamation-circle';
            break;
        case 'warning':
            color = '#cbdb2a'; // Amarillo institucional
            icono = 'exclamation-triangle';
            break;
        default: // info
            color = '#08b89d'; // Turquesa institucional
            icono = 'info-circle';
    }
    
    // Crear nueva notificación ESPAM
    const notification = document.createElement('div');
    notification.className = `notification-espam ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${color}15;
        color: ${color === '#dc3545' ? '#721c24' : color === '#cbdb2a' ? '#856404' : color === '#39b54a' ? '#155724' : '#0c5460'};
        border-left: 4px solid ${color};
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 10000;
        animation: slideInRightESPAM 0.3s ease;
        font-family: 'Work Sans', sans-serif;
        font-size: 0.95rem;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <div class="notification-content" style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${icono}" style="color: ${color}; font-size: 1.1rem;"></i>
            <span style="font-weight: 500;">${message}</span>
        </div>
        <button class="close-notification" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; margin-left: 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Botón para cerrar
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.style.animation = 'slideOutRightESPAM 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRightESPAM 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Función para formatear fechas ESPAM
function formatDateESPAM(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    switch(format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'dd/mm/yyyy hh:mm':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'texto-completo':
            return `${dayNames[d.getDay()]} ${day} de ${monthNames[d.getMonth()]} de ${year}`;
        case 'texto-corto':
            return `${day} ${monthNames[d.getMonth()].substring(0, 3)} ${year}`;
        default:
            return d.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });
    }
}

// Función para obtener datos ESPAM (ahora via Supabase)
async function fetchDataESPAM(endpoint, options = {}) {
    try {
        // Usar servicios de Supabase
        if (endpoint.includes('reservas')) {
            const data = await ReservasService.obtenerTodas();
            return { success: true, data, institucion: 'Universidad ESPAM MFL' };
        }
        if (endpoint.includes('laboratorios')) {
            const data = await LaboratoriosService.obtenerTodos();
            return { success: true, data, institucion: 'Universidad ESPAM MFL' };
        }
        if (endpoint.includes('usuarios')) {
            const data = await UsuariosService.listarUsuarios();
            return { success: true, data, institucion: 'Universidad ESPAM MFL' };
        }
        if (endpoint.includes('estadisticas') || endpoint.includes('reportes')) {
            const data = await ReportesService.obtenerEstadisticas();
            return { success: true, data, institucion: 'Universidad ESPAM MFL' };
        }

        return { success: true, data: [], institucion: 'Universidad ESPAM MFL', timestamp: new Date().toISOString() };
    } catch (error) {
        console.error('Error cargando datos ESPAM:', error);
        showNotificationESPAM('Error al cargar los datos del sistema ESPAM', 'error');
        return { success: false, error: error.message, data: [], institucion: 'Universidad ESPAM MFL' };
    }
}

// Agregar animación de slideOutRight
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOutRightESPAM {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(slideOutStyle);

// Exportar funciones ESPAM para uso global
window.UDIV_ESPAM = {
    showNotification: showNotificationESPAM,
    formatDate: formatDateESPAM,
    fetchData: fetchDataESPAM,
    validateEmail: isValidEmailESPAM,
    animateCounter: animateCounterESPAM,
    getDashboardUrl: getDashboardUrlESPAM,
    getRolText: getRolTextESPAM
};