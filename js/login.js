// login.js - Manejo del formulario de login - UNIVERSIDAD ESPAM MFL

document.addEventListener('DOMContentLoaded', function() {
    // COLETOS INSTITUCIONALES ESPAM MFL
    const coloresESPAM = {
        primario: "#005846",      // Color principal
        secundario1: "#39b54a",   // Verde institucional
        secundario2: "#cbdb2a",   // Amarillo verdoso
        secundario3: "#08b89d",   // Turquesa
        fondoClaro: "#F8F8F2",    // Fondo claro / Pantone 663 C
        blanco: "#FFFFFF"
    };

    // Aplicar estilos institucionales dinámicamente
    aplicarEstilosESPAM();

    // La autenticación ahora se maneja a través de Supabase
    // Los usuarios se registran y autentican directamente contra la base de datos

    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const roleOptions = document.querySelectorAll('.role-option');
    const userTypeSelect = document.getElementById('userType');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginLogo = document.querySelector('.login-logo');

    // Aplicar estilos a elementos específicos
    aplicarEstilosElementos();

    // Manejar selección de rol con estilos ESPAM
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            roleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const role = this.getAttribute('data-role');
            userTypeSelect.value = role;
            
            // Aplicar color institucional al activo
            this.style.borderColor = coloresESPAM.primario;
            this.style.backgroundColor = coloresESPAM.primario + '10';
            this.style.color = coloresESPAM.primario;
            
            // Restaurar estilos de los no activos
            roleOptions.forEach(opt => {
                if (opt !== this) {
                    opt.style.borderColor = '#e0e0e0';
                    opt.style.backgroundColor = 'white';
                    opt.style.color = '#333';
                }
            });
        });
    });

    // Sincronizar select con opciones visuales
    userTypeSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        roleOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-role') === selectedRole) {
                opt.classList.add('active');
                opt.style.borderColor = coloresESPAM.primario;
                opt.style.backgroundColor = coloresESPAM.primario + '10';
                opt.style.color = coloresESPAM.primario;
            } else {
                opt.style.borderColor = '#e0e0e0';
                opt.style.backgroundColor = 'white';
                opt.style.color = '#333';
            }
        });
    });

    // Mostrar/ocultar contraseña con estilo ESPAM
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
            this.style.color = coloresESPAM.primario;
        });
    }

    // Manejar envío del formulario ESPAM con Supabase
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            // Validar campos ESPAM
            if (!username || !password || !userType) {
                showMessage('Por favor complete todos los campos requeridos', 'error');
                return;
            }

            // Construir email: si no incluye @, agregar dominio institucional
            const email = username.includes('@') ? username : `${username.toLowerCase()}@espam.edu.ec`;

            // Deshabilitar botón mientras se procesa
            const submitBtn = loginForm.querySelector('button[type="submit"], .btn-login-submit');
            const originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.textContent = 'Verificando...';
                submitBtn.disabled = true;
            }

            try {
                // Autenticar con Supabase
                const resultado = await AuthService.login(email, password);

                if (resultado.success && resultado.perfil) {
                    // Los admins pueden entrar con cualquier rol seleccionado
                    const esAdmin = resultado.perfil.tipo === 'admin';

                    if (!esAdmin && resultado.perfil.tipo !== userType) {
                        showMessage('El tipo de cuenta seleccionado no coincide con su perfil ESPAM.', 'error');
                        if (submitBtn) {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }
                        return;
                    }

                    // Para admins, usar el rol seleccionado en el formulario
                    const rolNavegar = esAdmin ? userType : resultado.perfil.tipo;

                    // Guardar sesión en formato legacy para compatibilidad
                    // Para admins, guardar el rol con el que están entrando
                    const perfilParaSesion = esAdmin
                        ? { ...resultado.perfil, tipo: rolNavegar, tipo_real: 'admin' }
                        : resultado.perfil;
                    await SessionHelper.guardarSesionLegacy(perfilParaSesion);

                    showMessage(`¡Bienvenido/a ${resultado.perfil.nombre}! Accediendo al sistema UDIV ESPAM...`, 'success');

                    // Redirigir según el rol seleccionado
                    setTimeout(() => {
                        switch(rolNavegar) {
                            case 'tecnico':
                                window.location.href = 'dashboard-tecnico.html';
                                break;
                            case 'docente':
                                window.location.href = 'dashboard-docente.html';
                                break;
                            case 'estudiante':
                                window.location.href = 'dashboard-estudiante.html';
                                break;
                            case 'admin':
                                window.location.href = 'dashboard-tecnico.html';
                                break;
                            default:
                                window.location.href = 'index.html';
                        }
                    }, 1500);
                } else {
                    showMessage('Credenciales incorrectas. Por favor verifique su usuario y contraseña ESPAM.', 'error');
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }
            } catch (error) {
                console.error('Error en login ESPAM:', error);
                showMessage('Error al conectar con el servidor. Intente nuevamente.', 'error');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Función para mostrar mensajes institucionales
    function showMessage(message, type) {
        // Eliminar mensaje anterior si existe
        const oldMessage = document.querySelector('.message-alert');
        if (oldMessage) oldMessage.remove();

        // Determinar color según tipo (usando colores institucionales)
        let color, icono;
        switch(type) {
            case 'success':
                color = coloresESPAM.secundario1; // Verde institucional
                icono = 'check-circle';
                break;
            case 'error':
                color = '#dc3545'; // Rojo (mantenido para contraste)
                icono = 'exclamation-circle';
                break;
            case 'warning':
                color = coloresESPAM.secundario2; // Amarillo institucional
                icono = 'exclamation-triangle';
                break;
            default: // info
                color = coloresESPAM.secundario3; // Turquesa institucional
                icono = 'info-circle';
        }

        // Crear nuevo mensaje con identidad ESPAM
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-alert ${type}`;
        messageDiv.style.cssText = `
            position: relative;
            padding: 15px 20px;
            margin-bottom: 20px;
            background-color: ${color}15;
            color: ${color === '#dc3545' ? '#721c24' : color === coloresESPAM.secundario2 ? '#856404' : color === coloresESPAM.secundario1 ? '#155724' : '#0c5460'};
            border-left: 4px solid ${color};
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Work Sans', sans-serif;
            font-size: 0.95rem;
            animation: fadeIn 0.3s ease;
        `;

        messageDiv.innerHTML = `
            <i class="fas fa-${icono}" style="color: ${color}; font-size: 1.2rem;"></i>
            <span style="flex: 1; font-weight: 500;">${message}</span>
            <button class="close-message" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0;">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Insertar en el formulario
        const form = document.querySelector('form');
        form.parentNode.insertBefore(messageDiv, form);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);

        // Botón para cerrar mensaje
        messageDiv.querySelector('.close-message').addEventListener('click', function() {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        });
    }

    // Verificar si ya hay una sesión activa ESPAM (via Supabase)
    async function checkExistingSession() {
        try {
            const { session, perfil } = await AuthService.getSesion();

            if (session && perfil) {
                // Redirigir según el tipo de usuario
                setTimeout(() => {
                    switch(perfil.tipo) {
                        case 'tecnico':
                            window.location.href = 'dashboard-tecnico.html';
                            break;
                        case 'docente':
                            window.location.href = 'dashboard-docente.html';
                            break;
                        case 'estudiante':
                            window.location.href = 'dashboard-estudiante.html';
                            break;
                        case 'admin':
                            window.location.href = 'dashboard-admin.html';
                            break;
                    }
                }, 500);
            }
        } catch (error) {
            console.log('No hay sesión activa ESPAM');
        }
    }

    // Aplicar estilos CSS institucionales
    function aplicarEstilosESPAM() {
        const estilos = document.createElement('style');
        estilos.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            /* Estilos para inputs con identidad ESPAM */
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                border-color: ${coloresESPAM.primario} !important;
                box-shadow: 0 0 0 3px ${coloresESPAM.primario}15 !important;
            }
            
            /* Botón de login con identidad ESPAM */
            .btn-login-submit {
                background-color: ${coloresESPAM.primario} !important;
                border-color: ${coloresESPAM.primario} !important;
                font-family: 'Work Sans', sans-serif !important;
                font-weight: 600 !important;
            }
            
            .btn-login-submit:hover {
                background-color: #004235 !important;
                border-color: #004235 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0, 88, 70, 0.2) !important;
            }
            
            /* Checkbox ESPAM */
            .checkbox-container input:checked + .checkmark {
                background-color: ${coloresESPAM.primario} !important;
                border-color: ${coloresESPAM.primario} !important;
            }
            
            /* Enlaces ESPAM */
            .forgot-link, .register-link {
                color: ${coloresESPAM.primario} !important;
                font-family: 'Work Sans', sans-serif !important;
            }
            
            .forgot-link:hover, .register-link:hover {
                color: ${coloresESPAM.secundario3} !important;
            }
            
            /* Tipografías institucionales */
            .login-header h1 {
                font-family: 'Libertad Mono', monospace !important;
                font-weight: 700 !important;
            }
            
            .login-header p, .form-group label, .role-option span {
                font-family: 'Work Sans', sans-serif !important;
            }
            
            /* Logo ESPAM */
            .login-logo {
                filter: brightness(0) saturate(100%) invert(16%) sepia(65%) saturate(1472%) hue-rotate(142deg) brightness(95%) contrast(101%);
            }
        `;
        document.head.appendChild(estilos);
    }

    // Aplicar estilos a elementos específicos
    function aplicarEstilosElementos() {
        // Aplicar colores a los inputs
        const inputs = document.querySelectorAll('.form-group input, .form-group select');
        inputs.forEach(input => {
            input.style.fontFamily = "'Work Sans', sans-serif";
            input.style.borderColor = '#ddd';
            input.addEventListener('focus', function() {
                this.style.borderColor = coloresESPAM.primario;
                this.style.boxShadow = `0 0 0 3px ${coloresESPAM.primario}15`;
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
                this.style.boxShadow = 'none';
            });
        });

        // Aplicar estilos al botón de login
        const loginBtn = document.querySelector('.btn-login-submit');
        if (loginBtn) {
            loginBtn.style.cssText = `
                background-color: ${coloresESPAM.primario} !important;
                border-color: ${coloresESPAM.primario} !important;
                color: white !important;
                font-family: 'Work Sans', sans-serif !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
            `;
            
            loginBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#004235 !important';
                this.style.borderColor = '#004235 !important';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = `0 4px 12px rgba(0, 88, 70, 0.2)`;
            });
            
            loginBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = `${coloresESPAM.primario} !important`;
                this.style.borderColor = `${coloresESPAM.primario} !important`;
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        }

        // Aplicar estilos al logo
        if (loginLogo) {
            loginLogo.style.cssText = `
                height: 100px !important;
                width: auto !important;
                margin-bottom: 20px !important;
                min-height: 100px !important;
            `;
        }

        // Aplicar estilos a las opciones de rol
        roleOptions.forEach(option => {
            option.style.fontFamily = "'Work Sans', sans-serif";
            option.style.transition = 'all 0.3s ease';
        });

        // Aplicar estilos al select
        if (userTypeSelect) {
            userTypeSelect.style.fontFamily = "'Work Sans', sans-serif";
            userTypeSelect.style.borderColor = '#ddd';
            userTypeSelect.addEventListener('focus', function() {
                this.style.borderColor = coloresESPAM.primario;
                this.style.boxShadow = `0 0 0 3px ${coloresESPAM.primario}15`;
            });
            userTypeSelect.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
                this.style.boxShadow = 'none';
            });
        }
    }

    // Ejecutar al cargar la página
    checkExistingSession();
});