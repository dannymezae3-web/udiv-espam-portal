// recovery.js - Manejo de recuperación de contraseña - UNIVERSIDAD ESPAM MFL

document.addEventListener('DOMContentLoaded', function() {
    // COLETES INSTITUCIONALES ESPAM MFL
    const coloresESPAM = {
        primario: "#005846",      // Color principal ESPAM
        secundario1: "#39b54a",   // Verde institucional
        secundario2: "#cbdb2a",   // Amarillo verdoso
        secundario3: "#08b89d",   // Turquesa
        fondoClaro: "#F8F8F2",    // Fondo claro / Pantone 663 C
        blanco: "#FFFFFF",
        grisClaro: "#F8F9FA"
    };

    // Aplicar estilos institucionales
    aplicarEstilosESPAM();

    // Elementos del DOM
    const recoverySteps = document.querySelectorAll('.recovery-step');
    const codeInputs = document.querySelectorAll('.code-input');
    const fullCodeInput = document.getElementById('fullCode');
    const countdownElement = document.getElementById('countdown');
    const resendLink = document.getElementById('resendLink');
    
    let countdown;
    let countdownTime = 180; // 3 minutos en segundos (estándar ESPAM)
    let verificationCode = '';
    
    // Inicializar página de recuperación ESPAM
    initRecoveryPageESPAM();
    
    function initRecoveryPageESPAM() {
        // Configurar inputs de código con estilos ESPAM
        setupCodeInputsESPAM();
        
        // Iniciar countdown si está en el paso 2
        if (document.getElementById('step2').classList.contains('active')) {
            startCountdownESPAM();
        }
        
        // Configurar evento para reenviar código
        if (resendLink) {
            resendLink.addEventListener('click', function(e) {
                e.preventDefault();
                resendCodeESPAM();
            });
        }
        
        // Configurar validación de contraseña ESPAM
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmNewPassword');
        
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                validatePasswordESPAM(this.value);
            });
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                checkPasswordMatchESPAM();
            });
        }

        // Aplicar estilos a todos los inputs
        aplicarEstilosInputs();
    }
    
    // Configurar inputs de código de verificación ESPAM
    function setupCodeInputsESPAM() {
        codeInputs.forEach((input, index) => {
            // Aplicar estilos institucionales
            input.style.fontFamily = "'Work Sans', sans-serif";
            input.style.borderColor = coloresESPAM.primario;
            input.style.textAlign = 'center';
            input.style.fontSize = '1.2rem';
            input.style.fontWeight = '600';
            input.style.color = coloresESPAM.primario;
            
            input.addEventListener('focus', function() {
                this.style.boxShadow = `0 0 0 3px ${coloresESPAM.primario}15`;
                this.style.borderColor = coloresESPAM.primario;
            });
            
            input.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });
            
            input.addEventListener('input', function(e) {
                // Solo permitir un dígito
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Si se ingresó un dígito, pasar al siguiente input
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Actualizar código completo
                updateFullCodeESPAM();
            });
            
            input.addEventListener('keydown', function(e) {
                // Permitir navegación con teclas de flecha
                if (e.key === 'ArrowLeft' && index > 0) {
                    codeInputs[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                } else if (e.key === 'Backspace') {
                    // Si está vacío y se presiona backspace, ir al anterior
                    if (this.value === '' && index > 0) {
                        codeInputs[index - 1].focus();
                    }
                }
            });
            
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                const numbers = pastedData.replace(/[^0-9]/g, '');
                
                // Distribuir números pegados en los inputs
                for (let i = 0; i < Math.min(numbers.length, codeInputs.length); i++) {
                    codeInputs[i].value = numbers.charAt(i);
                }
                
                updateFullCodeESPAM();
                
                // Enfocar el último input con valor
                const lastFilled = Array.from(codeInputs).findIndex(input => input.value === '');
                if (lastFilled === -1) {
                    codeInputs[codeInputs.length - 1].focus();
                } else {
                    codeInputs[lastFilled].focus();
                }
            });
        });
    }
    
    // Aplicar estilos a inputs del formulario
    function aplicarEstilosInputs() {
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
    }
    
    // Actualizar código completo
    function updateFullCodeESPAM() {
        verificationCode = Array.from(codeInputs)
            .map(input => input.value)
            .join('');
        
        if (fullCodeInput) {
            fullCodeInput.value = verificationCode;
        }
    }
    
    // Navegación entre pasos ESPAM
    window.nextRecoveryStep = function(stepNumber) {
        // Validar paso actual antes de continuar
        if (!validateCurrentRecoveryStepESPAM(stepNumber - 1)) {
            return;
        }
        
        // Ocultar todos los pasos
        recoverySteps.forEach(step => step.classList.remove('active'));
        
        // Mostrar siguiente paso
        const nextStep = document.getElementById(`step${stepNumber}`);
        if (nextStep) {
            nextStep.classList.add('active');
            
            // Iniciar countdown si es el paso 2
            if (stepNumber === 2) {
                startCountdownESPAM();
            }
            
            scrollToTopESPAM();
            animateStepTransition(nextStep);
        }
    };
    
    window.prevRecoveryStep = function(stepNumber) {
        // Ocultar todos los pasos
        recoverySteps.forEach(step => step.classList.remove('active'));
        
        // Mostrar paso anterior
        const prevStep = document.getElementById(`step${stepNumber}`);
        if (prevStep) {
            prevStep.classList.add('active');
            scrollToTopESPAM();
            animateStepTransition(prevStep);
        }
    };
    
    // Animación de transición entre pasos
    function animateStepTransition(stepElement) {
        stepElement.style.opacity = '0';
        stepElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            stepElement.style.transition = 'all 0.3s ease';
            stepElement.style.opacity = '1';
            stepElement.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Validar paso actual ESPAM
    function validateCurrentRecoveryStepESPAM(stepNumber) {
        const currentStep = document.getElementById(`step${stepNumber + 1}`);
        
        switch(stepNumber) {
            case 0: // Validar paso 1 (email ESPAM)
                const email = document.getElementById('recoveryEmail').value.trim();
                const userType = document.getElementById('userTypeRecovery').value;
                
                if (!email || !userType) {
                    showMessageESPAM('Por favor complete todos los campos requeridos - ESPAM', 'error');
                    return false;
                }
                
                // Validar formato de email institucional
                if (!email.includes('@')) {
                    showMessageESPAM('Ingrese un correo electrónico válido - ESPAM', 'error');
                    return false;
                }
                
                // Recomendar email institucional
                if (!email.endsWith('@espam.edu.ec')) {
                    showMessageESPAM('Se recomienda usar su correo institucional @espam.edu.ec', 'warning', 4000);
                }
                
                // Verificar si el usuario existe en ESPAM
                if (!userExistsESPAM(email, userType)) {
                    showMessageESPAM('No se encontró un usuario registrado en ESPAM con esos datos', 'error');
                    return false;
                }
                
                // Guardar datos para recuperación
                localStorage.setItem('espam_recoveryData', JSON.stringify({
                    email: email,
                    userType: userType,
                    timestamp: new Date().getTime(),
                    institucion: 'Universidad ESPAM MFL'
                }));
                
                // Generar y almacenar código de verificación
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem('espam_recoveryCode', verificationCode);
                
                // Simular envío de código (en producción se enviaría por email)
                console.log('Código de verificación ESPAM:', verificationCode);
                showMessageESPAM('Código de verificación generado. En un entorno real se enviaría a su email institucional.', 'info', 5000);
                
                return true;
                
            case 1: // Validar paso 2 (código ESPAM)
                if (verificationCode.length !== 6) {
                    showMessageESPAM('Ingrese el código de 6 dígitos completo - ESPAM', 'error');
                    return false;
                }
                
                // Verificar código ESPAM
                const storedCode = localStorage.getItem('espam_recoveryCode');
                if (verificationCode !== storedCode) {
                    showMessageESPAM('Código incorrecto. Por favor verifique e intente nuevamente - ESPAM', 'error');
                    return false;
                }
                
                // Verificar expiración del código (15 minutos)
                const recoveryData = JSON.parse(localStorage.getItem('espam_recoveryData') || '{}');
                const codeTimestamp = localStorage.getItem('espam_codeTimestamp');
                const now = new Date().getTime();
                
                if (codeTimestamp && (now - parseInt(codeTimestamp)) > 15 * 60 * 1000) {
                    showMessageESPAM('El código ha expirado. Solicite uno nuevo - ESPAM', 'error');
                    return false;
                }
                
                return true;
                
            case 2: // Validar paso 3 (nueva contraseña ESPAM)
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmNewPassword').value;
                
                if (!newPassword || !confirmPassword) {
                    showMessageESPAM('Por favor complete todos los campos - ESPAM', 'error');
                    return false;
                }
                
                if (newPassword !== confirmPassword) {
                    showMessageESPAM('Las contraseñas no coinciden - ESPAM', 'error');
                    return false;
                }
                
                if (!validatePasswordStrengthESPAM(newPassword)) {
                    showMessageESPAM('La contraseña no cumple con los requisitos de seguridad de ESPAM', 'error');
                    return false;
                }
                
                return true;
                
            default:
                return true;
        }
    }
    
    // Verificar si el usuario existe en ESPAM
    function userExistsESPAM(email, userType) {
        // Primero buscar en usuarios ESPAM
        const usuariosESPAM = JSON.parse(localStorage.getItem('espam_usuariosUDIV') || '[]');
        const usuarioESPAM = usuariosESPAM.find(user => 
            (user.username === email || user.email === email) && 
            user.tipo === userType
        );
        
        // Si no se encuentra en usuarios ESPAM, buscar en formato antiguo
        if (!usuarioESPAM) {
            const usuarios = JSON.parse(localStorage.getItem('usuariosUDIV') || '[]');
            return usuarios.some(user => 
                (user.username === email || user.email === email) && 
                user.tipo === userType
            );
        }
        
        return !!usuarioESPAM;
    }
    
    // Iniciar countdown ESPAM
    function startCountdownESPAM() {
        clearInterval(countdown);
        countdownTime = 180; // Resetear a 3 minutos (estándar ESPAM)
        
        updateCountdownDisplayESPAM();
        
        countdown = setInterval(() => {
            countdownTime--;
            updateCountdownDisplayESPAM();
            
            if (countdownTime <= 0) {
                clearInterval(countdown);
                if (countdownElement) {
                    countdownElement.textContent = "00:00";
                    countdownElement.style.color = coloresESPAM.secundario2;
                }
                if (resendLink) {
                    resendLink.style.display = 'inline';
                    resendLink.style.color = coloresESPAM.primario;
                }
                showMessageESPAM('El código de verificación ha expirado. Solicite uno nuevo.', 'warning');
            }
        }, 1000);
    }
    
    function updateCountdownDisplayESPAM() {
        if (!countdownElement) return;
        
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Cambiar color cuando queden menos de 60 segundos
        if (countdownTime < 60) {
            countdownElement.style.color = coloresESPAM.secundario2; // Amarillo de advertencia
        } else {
            countdownElement.style.color = coloresESPAM.secundario1; // Verde
        }
    }
    
    // Reenviar código ESPAM
    window.resendCodeESPAM = function() {
        // Generar nuevo código ESPAM
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('espam_recoveryCode', newCode);
        localStorage.setItem('espam_codeTimestamp', new Date().getTime());
        
        // Resetear countdown
        countdownTime = 180;
        startCountdownESPAM();
        
        // Limpiar inputs
        codeInputs.forEach(input => input.value = '');
        updateFullCodeESPAM();
        
        // Enfocar primer input
        if (codeInputs.length > 0) {
            codeInputs[0].focus();
        }
        
        // Ocultar link de reenvío temporalmente
        if (resendLink) {
            resendLink.style.display = 'none';
        }
        
        // Mostrar mensaje
        showMessageESPAM('Se ha generado un nuevo código de verificación ESPAM', 'success');
        
        // Simular envío de código (en producción se enviaría por email)
        console.log('Nuevo código de verificación ESPAM:', newCode);
    };
    
    // Validar fortaleza de contraseña ESPAM
    function validatePasswordESPAM(password) {
        const requirements = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        // Actualizar lista de requisitos ESPAM
        const reqIds = ['length', 'uppercase', 'lowercase', 'number', 'special'];
        reqIds.forEach(req => {
            const element = document.getElementById(`req-${req}`);
            if (element) {
                const icon = element.querySelector('i') || document.createElement('i');
                if (requirements[req] || (req === 'length' && requirements.length)) {
                    icon.className = 'fas fa-check';
                    icon.style.color = coloresESPAM.secundario1;
                    element.style.color = coloresESPAM.secundario1;
                } else {
                    icon.className = 'fas fa-times';
                    icon.style.color = '#dc3545';
                    element.style.color = '#dc3545';
                }
                if (!element.querySelector('i')) {
                    element.prepend(icon);
                    element.innerHTML += ' ' + element.textContent;
                }
            }
        });
    }
    
    function validatePasswordStrengthESPAM(password) {
        const requirements = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        return Object.values(requirements).every(req => req === true);
    }
    
    // Verificar coincidencia de contraseñas ESPAM
    function checkPasswordMatchESPAM() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        const matchElement = document.getElementById('passwordMatch');
        
        if (!matchElement) return;
        
        if (newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                matchElement.innerHTML = `<i class="fas fa-check" style="color: ${coloresESPAM.secundario1}; margin-right: 5px;"></i> Las contraseñas coinciden`;
                matchElement.style.color = coloresESPAM.secundario1;
                matchElement.style.fontFamily = "'Work Sans', sans-serif";
                matchElement.style.fontWeight = '500';
            } else {
                matchElement.innerHTML = `<i class="fas fa-times" style="color: #dc3545; margin-right: 5px;"></i> Las contraseñas no coinciden`;
                matchElement.style.color = '#dc3545';
                matchElement.style.fontFamily = "'Work Sans', sans-serif";
                matchElement.style.fontWeight = '500';
            }
        } else {
            matchElement.textContent = "";
        }
    }
    
    // Manejar envío del formulario final ESPAM
    const recoveryForm3 = document.getElementById('recoveryForm3');
    if (recoveryForm3) {
        // Aplicar estilos al botón de envío
        const submitBtn = recoveryForm3.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.backgroundColor = coloresESPAM.primario;
            submitBtn.style.borderColor = coloresESPAM.primario;
            submitBtn.style.fontFamily = "'Work Sans', sans-serif";
            submitBtn.style.fontWeight = '600';
            
            submitBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#004235';
                this.style.borderColor = '#004235';
                this.style.transform = 'translateY(-2px)';
            });
            
            submitBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = coloresESPAM.primario;
                this.style.borderColor = coloresESPAM.primario;
                this.style.transform = 'translateY(0)';
            });
        }
        
        recoveryForm3.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateCurrentRecoveryStepESPAM(2)) {
                return;
            }
            
            const newPassword = document.getElementById('newPassword').value;
            const recoveryData = JSON.parse(localStorage.getItem('espam_recoveryData') || '{}');
            
            // Mostrar indicador de carga
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Actualizando contraseña ESPAM...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            
                // Simular delay de procesamiento
                setTimeout(() => {
                    // Actualizar contraseña en ESPAM
                    if (updatePasswordESPAM(recoveryData.email, recoveryData.userType, newPassword)) {
                        // Mostrar mensaje de éxito
                        document.querySelectorAll('.recovery-step').forEach(step => {
                            step.style.display = 'none';
                        });
                        
                        const successMessage = document.getElementById('successMessage');
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            successMessage.style.fontFamily = "'Work Sans', sans-serif";
                            successMessage.style.textAlign = 'center';
                            
                            // Aplicar estilos al mensaje de éxito
                            const successIcon = successMessage.querySelector('i');
                            if (successIcon) {
                                successIcon.style.color = coloresESPAM.secundario1;
                                successIcon.style.fontSize = '3rem';
                                successIcon.style.marginBottom = '20px';
                            }
                        }
                        
                        // Limpiar datos de recuperación ESPAM
                        localStorage.removeItem('espam_recoveryData');
                        localStorage.removeItem('espam_recoveryCode');
                        localStorage.removeItem('espam_codeTimestamp');
                        
                        // También limpiar formato antiguo
                        localStorage.removeItem('recoveryData');
                        localStorage.removeItem('recoveryCode');
                        
                        // Redirigir al login después de 3 segundos
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 3000);
                    } else {
                        showMessageESPAM('Error al actualizar la contraseña en ESPAM. Intente nuevamente.', 'error');
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                    }
                }, 1500);
            }
        });
    }
    
    // Actualizar contraseña en localStorage ESPAM
    function updatePasswordESPAM(email, userType, newPassword) {
        try {
            // Buscar en usuarios ESPAM
            const usuariosESPAM = JSON.parse(localStorage.getItem('espam_usuariosUDIV') || '[]');
            const usuarioESPAMIndex = usuariosESPAM.findIndex(user => 
                (user.username === email || user.email === email) && user.tipo === userType
            );
            
            if (usuarioESPAMIndex !== -1) {
                // Actualizar contraseña en usuarios ESPAM
                usuariosESPAM[usuarioESPAMIndex].password = newPassword;
                localStorage.setItem('espam_usuariosUDIV', JSON.stringify(usuariosESPAM));
            }
            
            // También actualizar en formato antiguo para compatibilidad
            const usuarios = JSON.parse(localStorage.getItem('usuariosUDIV') || '[]');
            const usuarioIndex = usuarios.findIndex(user => 
                (user.username === email || user.email === email) && user.tipo === userType
            );
            
            if (usuarioIndex !== -1) {
                usuarios[usuarioIndex].password = newPassword;
                localStorage.setItem('usuariosUDIV', JSON.stringify(usuarios));
            }
            
            return true;
        } catch (error) {
            console.error('Error actualizando contraseña ESPAM:', error);
            return false;
        }
    }
    
    // Función para mostrar mensajes ESPAM
    function showMessageESPAM(message, type = 'info', duration = 5000) {
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
                color = '#dc3545'; // Rojo (mantenido)
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
        
        // Crear nuevo mensaje ESPAM
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
            font-weight: 500;
            animation: fadeInESPAM 0.3s ease;
        `;
        
        messageDiv.innerHTML = `
            <i class="fas fa-${icono}" style="color: ${color}; font-size: 1.2rem;"></i>
            <span style="flex: 1;">${message}</span>
            <button class="close-message" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Insertar en el formulario activo
        const activeForm = document.querySelector('.recovery-step.active form');
        if (activeForm) {
            activeForm.parentNode.insertBefore(messageDiv, activeForm);
        } else {
            // Insertar al inicio del contenedor de recuperación
            const recoveryContainer = document.querySelector('.login-box') || document.querySelector('.recovery-container');
            if (recoveryContainer) {
                recoveryContainer.insertBefore(messageDiv, recoveryContainer.firstChild);
            }
        }
        
        // Auto-eliminar después de la duración especificada
        if (duration > 0) {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.animation = 'fadeOutESPAM 0.3s ease';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, duration);
        }
        
        // Botón para cerrar mensaje
        messageDiv.querySelector('.close-message').addEventListener('click', function() {
            messageDiv.style.animation = 'fadeOutESPAM 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        });
    }
    
    // Función para hacer scroll al top
    function scrollToTopESPAM() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Aplicar estilos CSS institucionales ESPAM
    function aplicarEstilosESPAM() {
        const estilos = document.createElement('style');
        estilos.textContent = `
            @keyframes fadeInESPAM {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOutESPAM {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            
            /* Estilos para contador ESPAM */
            #countdown {
                font-family: 'Libertad Mono', monospace;
                font-weight: 700;
                font-size: 1.1rem;
            }
            
            /* Botones de navegación ESPAM */
            .btn-next, .btn-prev {
                font-family: 'Work Sans', sans-serif !important;
                font-weight: 600 !important;
            }
            
            .btn-next {
                background-color: ${coloresESPAM.primario} !important;
                border-color: ${coloresESPAM.primario} !important;
            }
            
            .btn-prev {
                background-color: ${coloresESPAM.grisClaro} !important;
                border-color: ${coloresESPAM.grisClaro} !important;
                color: ${coloresESPAM.grisOscuro} !important;
            }
            
            /* Títulos ESPAM */
            .recovery-step h2 {
                font-family: 'Libertad Mono', monospace !important;
                font-weight: 700 !important;
                color: ${coloresESPAM.primario} !important;
            }
            
            .recovery-step p {
                font-family: 'Work Sans', sans-serif !important;
            }
            
            /* Progreso ESPAM */
            .progress-bar {
                background-color: ${coloresESPAM.primario} !important;
            }
            
            /* Código de verificación ESPAM */
            .code-input-group {
                gap: 10px;
            }
            
            .code-input {
                border: 2px solid ${coloresESPAM.primario};
                border-radius: 8px;
                width: 50px;
                height: 60px;
                font-size: 1.5rem;
                transition: all 0.3s ease;
            }
            
            .code-input:focus {
                box-shadow: 0 0 0 3px ${coloresESPAM.primario}15;
                transform: translateY(-2px);
            }
            
            /* Lista de requisitos ESPAM */
            .requirements-list li {
                font-family: 'Work Sans', sans-serif;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .requirements-list i {
                font-size: 0.9rem;
            }
            
            /* Mensaje de éxito ESPAM */
            #successMessage {
                text-align: center;
                padding: 40px 20px;
                font-family: 'Work Sans', sans-serif;
            }
            
            #successMessage i {
                font-size: 3rem;
                color: ${coloresESPAM.secundario1};
                margin-bottom: 20px;
            }
        `;
        document.head.appendChild(estilos);
    }
});