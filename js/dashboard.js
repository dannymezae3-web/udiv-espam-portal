// dashboard.js - Funciones generales para todos los dashboards - UNIVERSIDAD ESPAM MFL

class DashboardManager {
    constructor() {
        this.userData = null;
        this.notifications = [];
        this.identidadESPAM = {
            colores: {
                primario: "#005846",      // Color principal ESPAM
                secundario1: "#39b54a",   // Verde institucional
                secundario2: "#cbdb2a",   // Amarillo verdoso
                secundario3: "#08b89d",   // Turquesa
                fondoClaro: "#F8F8F2",    // Fondo claro / Pantone 663 C
                blanco: "#FFFFFF",
                grisClaro: "#F8F9FA",
                grisMedio: "#6C757D",
                grisOscuro: "#343A40"
            },
            tipografias: {
                principal: "'Libertad Mono', monospace",
                alternativa: "'Work Sans', sans-serif"
            }
        };
        this.init();
    }

    init() {
        this.aplicarEstilosInstitucionales();
        this.loadUserData();
        this.setupEventListeners();
        this.loadNotifications();
        this.updateUI();
        this.setupSidebar();
    }

    aplicarEstilosInstitucionales() {
        // Aplicar estilos CSS institucionales dinámicamente
        const estilos = document.createElement('style');
        estilos.id = 'dashboard-estilos-espam';
        estilos.textContent = `
            /* ESTILOS INSTITUCIONALES ESPAM MFL PARA DASHBOARD */
            
            /* Sidebar con colores institucionales */
            .sidebar {
                background: linear-gradient(180deg, ${this.identidadESPAM.colores.primario} 0%, rgba(0, 88, 70, 0.95) 100%) !important;
            }
            
            .sidebar-menu li.active > a {
                border-left-color: ${this.identidadESPAM.colores.secundario2} !important;
                background-color: rgba(255, 255, 255, 0.15) !important;
            }
            
            .sidebar-menu a:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            /* Badges con colores institucionales */
            .badge, .notification-count {
                background-color: ${this.identidadESPAM.colores.secundario1} !important;
            }
            
            /* Top bar */
            .top-bar {
                background-color: white !important;
                border-bottom: 1px solid ${this.identidadESPAM.colores.primario}15;
            }
            
            .top-bar h1 {
                color: ${this.identidadESPAM.colores.primario} !important;
                font-family: ${this.identidadESPAM.tipografias.principal} !important;
            }
            
            /* Botones */
            .btn-login, .btn-primary {
                background-color: ${this.identidadESPAM.colores.primario} !important;
                border-color: ${this.identidadESPAM.colores.primario} !important;
                font-family: ${this.identidadESPAM.tipografias.alternativa} !important;
            }
            
            .btn-secondary {
                background-color: ${this.identidadESPAM.colores.secundario3} !important;
                border-color: ${this.identidadESPAM.colores.secundario3} !important;
                font-family: ${this.identidadESPAM.tipografias.alternativa} !important;
            }
            
            /* Tarjetas estadísticas */
            .stat-card {
                border-top: 3px solid ${this.identidadESPAM.colores.primario};
            }
            
            .stat-number {
                color: ${this.identidadESPAM.colores.primario} !important;
                font-family: ${this.identidadESPAM.tipografias.principal} !important;
            }
            
            /* Estados con colores institucionales */
            .status.confirmed {
                background-color: ${this.identidadESPAM.colores.secundario1}15 !important;
                color: ${this.identidadESPAM.colores.secundario1} !important;
                border: 1px solid ${this.identidadESPAM.colores.secundario1} !important;
            }
            
            .status.pending {
                background-color: ${this.identidadESPAM.colores.secundario2}15 !important;
                color: ${this.identidadESPAM.colores.secundario2} !important;
                border: 1px solid ${this.identidadESPAM.colores.secundario2} !important;
            }
            
            .status.cancelled {
                background-color: #dc354515 !important;
                color: #dc3545 !important;
                border: 1px solid #dc3545 !important;
            }
            
            /* Alertas */
            .alerta-urgente {
                border-left-color: #dc3545 !important;
            }
            
            .alerta-warning {
                border-left-color: ${this.identidadESPAM.colores.secundario2} !important;
                background-color: ${this.identidadESPAM.colores.secundario2}10 !important;
            }
            
            .alerta-info {
                border-left-color: ${this.identidadESPAM.colores.secundario3} !important;
                background-color: ${this.identidadESPAM.colores.secundario3}10 !important;
            }
            
            /* Tipografías generales */
            body, .search-box input, .btn-mark-all, .btn-view-all, .btn-action {
                font-family: ${this.identidadESPAM.tipografias.alternativa} !important;
            }
            
            h1, h2, h3, h4, h5, h6, .section-header h2, .quick-actions h2 {
                font-family: ${this.identidadESPAM.tipografias.principal} !important;
                font-weight: 700 !important;
                color: ${this.identidadESPAM.colores.primario} !important;
            }
        `;
        document.head.appendChild(estilos);
    }

    loadUserData() {
        // Intentar cargar desde Supabase primero, con fallback a localStorage
        this.loadUserDataAsync();
    }

    async loadUserDataAsync() {
        try {
            // Intentar obtener sesión de Supabase
            if (window.AuthService) {
                const { session, perfil } = await AuthService.getSesion();

                if (session && perfil) {
                    this.userData = {
                        id: perfil.id,
                        nombre: perfil.nombre || 'Usuario ESPAM',
                        tipo: perfil.tipo || 'estudiante',
                        carrera: perfil.carrera_nombre || 'ESPAM',
                        laboratorio: perfil.laboratorio_nombre || null,
                        institucion: 'Universidad ESPAM MFL',
                        email: perfil.email
                    };

                    // Sincronizar con localStorage para compatibilidad
                    await SessionHelper.guardarSesionLegacy(perfil);
                    this.updateUI();
                    return;
                }
            }
        } catch (error) {
            console.log('Fallback a localStorage para sesión ESPAM');
        }

        // Fallback: cargar desde localStorage
        const sessionData = SessionHelper.obtenerSesionLegacy();

        if (sessionData.loggedIn) {
            this.userData = {
                id: sessionData.username || sessionData.userId,
                nombre: sessionData.nombre || 'Usuario ESPAM',
                tipo: sessionData.tipo || 'estudiante',
                carrera: sessionData.carrera || 'ESPAM',
                laboratorio: sessionData.laboratorio || null,
                institucion: 'Universidad ESPAM MFL',
                email: sessionData.email || ''
            };
        } else {
            // Redirigir al login si no hay sesión
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
        }
    }

    setupEventListeners() {
        // Menú toggle para responsive
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
            // Aplicar estilo institucional
            menuToggle.style.color = this.identidadESPAM.colores.primario;
        }

        // Cerrar sesión
        const logoutLinks = document.querySelectorAll('.logout');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
            // Aplicar color institucional
            link.style.color = this.identidadESPAM.colores.secundario1 + ' !important';
        });

        // Notificaciones
        const notificationBtn = document.querySelector('.btn-notification');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.toggleNotifications());
            notificationBtn.style.color = this.identidadESPAM.colores.grisOscuro;
        }

        // Buscador
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.search(e.target.value));
            // Aplicar estilo institucional
            searchInput.style.borderColor = this.identidadESPAM.colores.primario;
            searchInput.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
        }

        // Botón de usuario dropdown
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            const userBtn = userDropdown.querySelector('.btn-user');
            if (userBtn) {
                userBtn.style.borderColor = this.identidadESPAM.colores.primario;
                userBtn.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
            }
        }
    }

    setupSidebar() {
        // Resaltar elemento activo en sidebar
        const currentPage = window.location.pathname.split('/').pop();
        const menuItems = document.querySelectorAll('.sidebar-menu a');
        
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage || (href && currentPage.includes(href.replace('.html', '')))) {
                item.parentElement.classList.add('active');
            }
            
            // Aplicar tipografía institucional
            item.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
        });

        // Submenús
        const parentItems = document.querySelectorAll('.sidebar-menu li:has(.submenu) > a');
        parentItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth > 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                    
                    const submenu = parent.querySelector('.submenu');
                    if (submenu) {
                        const isActive = parent.classList.contains('active');
                        submenu.style.maxHeight = isActive ? submenu.scrollHeight + 'px' : '0';
                    }
                }
            });
        });

        // Aplicar estilos a elementos del sidebar
        const sidebarHeader = document.querySelector('.sidebar-header h3');
        if (sidebarHeader) {
            sidebarHeader.style.fontFamily = this.identidadESPAM.tipografias.principal;
            sidebarHeader.style.color = this.identidadESPAM.colores.blanco;
        }

        const userRole = document.querySelector('.user-role');
        if (userRole) {
            userRole.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
            userRole.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }

        const userInfo = document.querySelectorAll('.user-info h4');
        userInfo.forEach(el => {
            el.style.fontFamily = this.identidadESPAM.tipografias.principal;
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    }

    toggleNotifications() {
        // Aquí se implementaría un dropdown de notificaciones
        console.log('Mostrar/ocultar notificaciones ESPAM');
        
        // Para este ejemplo, simplemente marcar como leídas
        this.markNotificationsAsRead();
        
        // Mostrar mensaje de confirmación
        this.showMessage('Notificaciones marcadas como leídas', 'success');
    }

    loadNotifications() {
        // Notificaciones de ejemplo específicas ESPAM
        this.notifications = [
            {
                id: 1,
                title: 'Nueva reserva pendiente - ESPAM',
                message: 'Reserva solicitada para el Laboratorio de Bromatología ESPAM',
                time: 'Hace 2 horas',
                read: false,
                type: 'info',
                icon: 'fa-flask',
                color: this.identidadESPAM.colores.primario
            },
            {
                id: 2,
                title: 'Mantenimiento programado ESPAM',
                message: 'Equipo del Laboratorio de Producción requiere mantenimiento preventivo',
                time: 'Ayer',
                read: false,
                type: 'warning',
                icon: 'fa-tools',
                color: this.identidadESPAM.colores.secundario2
            },
            {
                id: 3,
                title: 'Material crítico - ESPAM',
                message: 'Revisar niveles de reactivos en Laboratorio de Química',
                time: 'Hace 3 días',
                read: true,
                type: 'danger',
                icon: 'fa-exclamation-triangle',
                color: '#dc3545'
            },
            {
                id: 4,
                title: 'Próxima práctica - ESPAM',
                message: 'Recordatorio: Práctica de Biotecnología mañana 10:00',
                time: 'Hace 5 días',
                read: true,
                type: 'info',
                icon: 'fa-calendar-check',
                color: this.identidadESPAM.colores.secundario3
            }
        ];
        
        this.updateNotificationBadge();
        this.updateNotificationsUI();
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-count');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
            badge.style.backgroundColor = this.identidadESPAM.colores.secundario1;
        }
    }

    updateNotificationsUI() {
        // Actualizar UI de notificaciones si existe
        const alertasSection = document.querySelector('.alertas-section');
        if (alertasSection) {
            const alertasList = alertasSection.querySelector('.alertas-list');
            if (alertasList) {
                alertasList.innerHTML = '';
                
                this.notifications.slice(0, 3).forEach(notification => {
                    const alertaDiv = document.createElement('div');
                    alertaDiv.className = `alerta-item ${this.getAlertaClass(notification.type)}`;
                    
                    alertaDiv.innerHTML = `
                        <div class="alerta-icon">
                            <i class="fas ${notification.icon}" style="color: ${notification.color};"></i>
                        </div>
                        <div class="alerta-content">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <div class="alerta-time">${notification.time}</div>
                        </div>
                        <button class="btn-alerta" onclick="dashboard.markNotificationAsRead(${notification.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    alertasList.appendChild(alertaDiv);
                });
            }
        }
    }

    getAlertaClass(type) {
        const clases = {
            'info': 'alerta-info',
            'warning': 'alerta-warning',
            'danger': 'alerta-urgente'
        };
        return clases[type] || 'alerta-info';
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.updateNotificationBadge();
            this.updateNotificationsUI();
            this.showMessage('Notificación marcada como leída', 'success');
        }
    }

    markNotificationsAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationBadge();
        this.updateNotificationsUI();
    }

    search(query) {
        // Implementar búsqueda según el tipo de usuario y página actual
        console.log('Buscando en sistema ESPAM:', query);
        
        // Mostrar mensaje de búsqueda
        if (query.trim()) {
            this.showMessage(`Buscando: "${query}"`, 'info', 3000);
        }
    }

    updateUI() {
        if (!this.userData) return;

        // Actualizar nombre del usuario en la UI
        const userNameElements = document.querySelectorAll('#userName, #topUserName, #sidebarName');
        userNameElements.forEach(el => {
            if (el) {
                el.textContent = this.userData.nombre;
                el.style.fontFamily = this.identidadESPAM.tipografias.principal;
                el.style.fontWeight = '700';
            }
        });

        // Actualizar rol ESPAM
        const roleElements = document.querySelectorAll('.user-role, #userRoleLabel');
        roleElements.forEach(el => {
            if (el) {
                const roleText = this.getRolText(this.userData.tipo);
                el.textContent = roleText;
                el.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
                el.style.fontWeight = '500';
            }
        });

        // Actualizar carrera/laboratorio ESPAM
        const careerLabElements = document.querySelectorAll('#userCareer, .user-info p');
        careerLabElements.forEach(el => {
            if (el) {
                if (this.userData.tipo === 'tecnico') {
                    el.textContent = `Laboratorio ${this.userData.laboratorio} - ESPAM`;
                } else {
                    el.textContent = `${this.userData.carrera} - ESPAM MFL`;
                }
                el.style.fontFamily = this.identidadESPAM.tipografias.alternativa;
            }
        });

        // Actualizar avatar/icono de usuario
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.style.color = this.identidadESPAM.colores.blanco;
        }

        // Actualizar título de la página
        const pageTitle = document.querySelector('title');
        if (pageTitle) {
            pageTitle.textContent = `UDIV ESPAM - ${this.getRolText(this.userData.tipo)}`;
        }
    }

    getRolText(tipo) {
        const roles = {
            'tecnico': 'Técnico Encargado ESPAM',
            'docente': 'Docente ESPAM',
            'estudiante': 'Estudiante ESPAM',
            'admin': 'Administrador ESPAM'
        };
        return roles[tipo] || 'Usuario ESPAM MFL';
    }

    async logout() {
        // Mostrar confirmación
        if (confirm('¿Está seguro que desea cerrar sesión del sistema ESPAM?')) {
            // Cerrar sesión en Supabase y limpiar storage
            if (window.AuthService) {
                await AuthService.logout();
            }

            // Limpiar sesiones legacy
            SessionHelper.limpiarSesionLegacy();

            // Mostrar mensaje de despedida
            this.showMessage('Sesión cerrada exitosamente. ¡Hasta pronto!', 'info');

            // Redirigir al login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    // Función para mostrar mensajes institucionales
    showMessage(message, type = 'info', duration = 5000) {
        // Eliminar mensaje anterior si existe
        const oldMessage = document.querySelector('.dashboard-message');
        if (oldMessage) oldMessage.remove();

        // Determinar color según tipo (usando colores institucionales)
        let color, icono;
        switch(type) {
            case 'success':
                color = this.identidadESPAM.colores.secundario1; // Verde institucional
                icono = 'check-circle';
                break;
            case 'error':
                color = '#dc3545'; // Rojo (mantenido para contraste)
                icono = 'exclamation-circle';
                break;
            case 'warning':
                color = this.identidadESPAM.colores.secundario2; // Amarillo institucional
                icono = 'exclamation-triangle';
                break;
            default: // info
                color = this.identidadESPAM.colores.secundario3; // Turquesa institucional
                icono = 'info-circle';
        }

        // Crear nuevo mensaje con identidad ESPAM
        const messageDiv = document.createElement('div');
        messageDiv.className = `dashboard-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${color}15;
            color: ${color === '#dc3545' ? '#721c24' : color === this.identidadESPAM.colores.secundario2 ? '#856404' : color === this.identidadESPAM.colores.secundario1 ? '#155724' : '#0c5460'};
            border-left: 4px solid ${color};
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 2000;
            animation: slideInRight 0.3s ease;
            font-family: ${this.identidadESPAM.tipografias.alternativa};
            font-size: 0.95rem;
        `;

        messageDiv.innerHTML = `
            <div class="message-content" style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icono}" style="color: ${color}; font-size: 1.1rem;"></i>
                <span style="font-weight: 500;">${message}</span>
            </div>
            <button class="close-message" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; margin-left: 10px;">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(messageDiv);

        // Botón para cerrar
        messageDiv.querySelector('.close-message').addEventListener('click', () => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        });

        // Auto-eliminar después de la duración
        if (duration > 0) {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, duration);
        }
    }

    // Función para cargar datos desde Supabase
    async fetchData(endpoint, options = {}) {
        try {
            // Usar servicios de Supabase según el endpoint
            if (endpoint.includes('reservas')) {
                const data = await ReservasService.obtenerMisReservas();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }
            if (endpoint.includes('laboratorios')) {
                const data = await LaboratoriosService.obtenerTodos();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }
            if (endpoint.includes('equipos')) {
                const data = await EquiposService.obtenerTodos();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }
            if (endpoint.includes('sustancias')) {
                const data = await SustanciasService.obtenerCriticas();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }
            if (endpoint.includes('usuarios')) {
                const data = await UsuariosService.listarUsuarios();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }
            if (endpoint.includes('reportes') || endpoint.includes('estadisticas')) {
                const data = await ReportesService.obtenerEstadisticas();
                return { success: true, data, institucion: 'Universidad ESPAM MFL' };
            }

            return { success: true, data: [], institucion: 'Universidad ESPAM MFL' };
        } catch (error) {
            console.error('Error cargando datos ESPAM:', error);
            this.showMessage('Error al cargar los datos del sistema ESPAM', 'error');
            return { success: false, error: error.message, data: [], institucion: 'Universidad ESPAM MFL' };
        }
    }

    getReservasEjemplo() {
        // Datos de ejemplo específicos ESPAM
        return [
            {
                id: 1,
                laboratorio: 'Bromatología ESPAM',
                docente: 'Dr. Carlos Mendoza',
                asignatura: 'Análisis de Alimentos',
                fecha: new Date().toISOString().split('T')[0],
                hora: '10:00-12:00',
                estado: 'confirmada',
                estudiantes: 15
            },
            {
                id: 2,
                laboratorio: 'Producción ESPAM',
                docente: 'Ing. Roberto Martínez',
                asignatura: 'Procesos Industriales',
                fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                hora: '14:00-16:00',
                estado: 'pendiente',
                estudiantes: 20
            }
        ];
    }

    // Función para formatear fechas ESPAM
    formatDate(date, format = 'dd/mm/yyyy') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        switch(format) {
            case 'dd/mm/yyyy':
                return `${day}/${month}/${year}`;
            case 'dd/mm/yyyy hh:mm':
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            case 'texto':
                const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return `${day} ${meses[d.getMonth()]} ${year}`;
            default:
                return d.toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
        }
    }

    // Función para validar formularios ESPAM
    validateForm(formId, rules) {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const errors = [];

        rules.forEach(rule => {
            const element = form.querySelector(rule.selector);
            if (element) {
                const value = element.value.trim();
                
                if (rule.required && !value) {
                    isValid = false;
                    errors.push(`${rule.label || 'Campo'} es requerido - ESPAM`);
                    this.highlightError(element, true);
                } else if (rule.pattern && !rule.pattern.test(value)) {
                    isValid = false;
                    errors.push(rule.message || `${rule.label || 'Campo'} no es válido`);
                    this.highlightError(element, true);
                } else if (rule.minLength && value.length < rule.minLength) {
                    isValid = false;
                    errors.push(`${rule.label || 'Campo'} debe tener al menos ${rule.minLength} caracteres`);
                    this.highlightError(element, true);
                } else {
                    this.highlightError(element, false);
                }
            }
        });

        if (!isValid && errors.length > 0) {
            this.showMessage(errors[0], 'error');
        }

        return isValid;
    }

    highlightError(element, isError) {
        if (isError) {
            element.style.borderColor = '#dc3545';
            element.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        } else {
            element.style.borderColor = this.identidadESPAM.colores.primario;
            element.style.boxShadow = '0 0 0 3px rgba(0, 88, 70, 0.1)';
        }
    }

    // Función para exportar datos ESPAM
    exportData(data, filename, type = 'csv') {
        let content, mimeType, extension;

        switch(type) {
            case 'csv':
                content = this.convertToCSV(data);
                mimeType = 'text/csv;charset=utf-8;';
                extension = 'csv';
                break;
            case 'json':
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json;charset=utf-8;';
                extension = 'json';
                break;
            case 'pdf':
                this.showMessage('Exportación PDF requiere configuración adicional', 'info');
                return;
            default:
                console.error('Tipo de exportación no soportado por ESPAM');
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_ESPAM_${new Date().toISOString().split('T')[0]}.${extension}`);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showMessage(`Archivo ${filename}.${extension} descargado`, 'success');
    }

    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const rows = data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escapar comas y comillas
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',')
        );
        
        // Agregar encabezado ESPAM
        const encabezadoESPAM = `"Reporte generado por Universidad ESPAM MFL","Fecha: ${new Date().toLocaleDateString('es-ES')}"\n`;
        return encabezadoESPAM + [headers.join(','), ...rows].join('\n');
    }

    // Función para generar estadísticas
    generateStats() {
        // Esta función sería implementada según la página específica
        return {
            totalReservas: 15,
            reservasPendientes: 3,
            reservasConfirmadas: 10,
            reservasCanceladas: 2,
            institucion: 'ESPAM MFL'
        };
    }

    // Función para inicializar gráficos
    initCharts(canvasId, data, type = 'bar') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Simulación de gráfico
        console.log(`Inicializando gráfico ${type} para ESPAM en`, canvasId);
        
        // En un entorno real, aquí se usaría Chart.js o similar
        const ctx = canvas.getContext('2d');
        
        // Ejemplo simple
        if (type === 'bar') {
            // Código para gráfico de barras
        } else if (type === 'pie') {
            // Código para gráfico de pastel
        }
    }
}

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardManager();
    
    // Añadir estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* Estado online con color institucional ESPAM */
        .user-status.online {
            background-color: #39b54a !important;
        }
        
        /* Mejoras visuales ESPAM */
        .sidebar-logo {
            filter: brightness(0) invert(1);
        }
        
        /* Hover effects con colores institucionales */
        .action-card:hover {
            border-color: #005846 !important;
            transform: translateY(-3px);
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 88, 70, 0.15) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Agregar clase al body para identificación ESPAM
    document.body.classList.add('sistema-espam', 'dashboard-espam');
});