// register.js - Manejo del formulario de registro - UNIVERSIDAD ESPAM MFL

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
    const registerForm = document.getElementById('registerForm');
    const userTypeSelect = document.getElementById('userType');
    const carreraSelect = document.getElementById('carrera');
    const otraCarreraContainer = document.getElementById('otraCarreraContainer');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress-bar');
    
    // CARRERAS ESPAM MFL
    const carrerasESPAM = [
        "Ingeniería de la Producción",
        "Ingeniería en Alimentos",
        "Biotecnología",
        "Ingeniería Ambiental",
        "Ingeniería Agroindustrial",
        "Administración de Empresas",
        "Contabilidad y Auditoría",
        "Informática",
        "Turismo",
        "Otra"
    ];
    
    // LABORATORIOS ESPAM
    const laboratoriosESPAM = [
        "Bromatología",
        "Biología",
        "Producción",
        "Química",
        "Física",
        "Computación",
        "Investigación"
    ];
    
    // Inicializar página de registro ESPAM
    initRegisterPageESPAM();
    
    function initRegisterPageESPAM() {
        // Configurar carreras ESPAM
        setupCarrerasESPAM();
        
        // Configurar laboratorios ESPAM
        setupLaboratoriosESPAM();
        
        // Configurar event listeners con estilos ESPAM
        setupEventListenersESPAM();
        
        // Aplicar estilos a elementos del formulario
        aplicarEstilosFormulario();
        
        // Inicializar validaciones específicas ESPAM
        initValidacionesESPAM();
    }
    
    function setupCarrerasESPAM() {
        if (carreraSelect) {
            // Limpiar opciones existentes
            carreraSelect.innerHTML = '<option value="">Seleccione una carrera</option>';
            
            // Agregar carreras ESPAM
            carrerasESPAM.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera.toLowerCase().replace(/\s+/g, '_');
                option.textContent = carrera;
                carreraSelect.appendChild(option);
            });
            
            // Agregar evento para "Otra" carrera
            carreraSelect.addEventListener('change', function() {
                if (this.value === 'otra') {
                    otraCarreraContainer.style.display = 'block';
                    document.getElementById('otra_carrera').required = true;
                } else {
                    otraCarreraContainer.style.display = 'none';
                    document.getElementById('otra_carrera').required = false;
                }
            });
        }
    }
    
    function setupLaboratoriosESPAM() {
        const labAsignado = document.getElementById('laboratorio_asignado');
        if (labAsignado) {
            // Limpiar opciones existentes
            labAsignado.innerHTML = '<option value="">Seleccione un laboratorio</option>';
            
            // Agregar laboratorios ESPAM
            laboratoriosESPAM.forEach(lab => {
                const option = document.createElement('option');
                option.value = lab.toLowerCase().replace(/\s+/g, '_');
                option.textContent = `Laboratorio de ${lab} ESPAM`;
                labAsignado.appendChild(option);
            });
        }
    }
    
    function setupEventListenersESPAM() {
        // Manejar cambio de tipo de usuario
        if (userTypeSelect) {
            userTypeSelect.addEventListener('change', function() {
                const isEstudiante = this.value === 'estudiante';
                const isTecnico = this.value === 'tecnico';
                const isDocente = this.value === 'docente';
                
                // Mostrar/ocultar campo de carrera para estudiantes y docentes
                const carreraContainer = document.getElementById('carreraContainer');
                if (carreraContainer) {
                    carreraContainer.style.display = (isEstudiante || isDocente) ? 'block' : 'none';
                }
                
                // Mostrar/ocultar campo de semestre solo para estudiantes
                const semestreContainer = document.getElementById('semestreContainer');
                if (semestreContainer) {
                    semestreContainer.style.display = isEstudiante ? 'block' : 'none';
                }
                
                // Mostrar/ocultar campo de laboratorio para técnicos
                const labAsignado = document.getElementById('laboratorio_asignado');
                if (labAsignado) {
                    labAsignado.required = isTecnico;
                    labAsignado.parentElement.style.display = isTecnico ? 'block' : 'none';
                }
                
                // Actualizar etiqueta de email según tipo
                const emailLabel = document.querySelector('label[for="email"]');
                if (emailLabel) {
                    if (isTecnico || isDocente) {
                        emailLabel.innerHTML = '<i class="fas fa-envelope"></i> Correo Institucional ESPAM';
                    } else if (isEstudiante) {
                        emailLabel.innerHTML = '<i class="fas fa-envelope"></i> Correo Estudiantil ESPAM';
                    }
                }
            });
        }
        
        // Validar fortaleza de contraseña ESPAM
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                checkPasswordStrengthESPAM(this.value);
            });
        }
        
        // Verificar coincidencia de contraseñas ESPAM
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                checkPasswordMatchESPAM();
            });
        }
    }
    
    function aplicarEstilosFormulario() {
        // Aplicar estilos a todos los inputs, selects y textareas
        const formElements = document.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            element.style.fontFamily = "'Work Sans', sans-serif";
            element.style.borderColor = '#ddd';
            
            element.addEventListener('focus', function() {
                this.style.borderColor = coloresESPAM.primario;
                this.style.boxShadow = `0 0 0 3px ${coloresESPAM.primario}15`;
            });
            
            element.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
                this.style.boxShadow = 'none';
            });
        });
        
        // Aplicar estilos a los botones de navegación
        const navButtons = document.querySelectorAll('.btn-next, .btn-prev');
        navButtons.forEach(button => {
            button.style.fontFamily = "'Work Sans', sans-serif";
            button.style.fontWeight = '600';
            
            if (button.classList.contains('btn-next')) {
                button.style.backgroundColor = coloresESPAM.primario;
                button.style.borderColor = coloresESPAM.primario;
            } else {
                button.style.backgroundColor = coloresESPAM.grisClaro;
                button.style.borderColor = coloresESPAM.grisClaro;
                button.style.color = '#343A40';
            }
        });
        
        // Aplicar estilos al botón de submit final
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.backgroundColor = coloresESPAM.primario;
            submitBtn.style.borderColor = coloresESPAM.primario;
            submitBtn.style.fontFamily = "'Work Sans', sans-serif";
            submitBtn.style.fontWeight = '600';
        }
    }
    
    // Navegación entre pasos ESPAM
    window.nextStep = function(stepNumber) {
        // Validar paso actual antes de continuar
        if (!validateCurrentStepESPAM(stepNumber - 1)) {
            return;
        }
        
        // Actualizar barra de progreso
        updateProgressBarESPAM(stepNumber);
        
        // Ocultar paso actual
        steps.forEach(step => step.classList.remove('active'));
        
        // Mostrar siguiente paso
        const nextStep = document.getElementById(`step${stepNumber}`);
        if (nextStep) {
            nextStep.classList.add('active');
            animateStepTransition(nextStep);
            scrollToTopESPAM();
        }
    };
    
    window.prevStep = function(stepNumber) {
        // Actualizar barra de progreso
        updateProgressBarESPAM(stepNumber);
        
        // Ocultar paso actual
        steps.forEach(step => step.classList.remove('active'));
        
        // Mostrar paso anterior
        const prevStep = document.getElementById(`step${stepNumber}`);
        if (prevStep) {
            prevStep.classList.add('active');
            animateStepTransition(prevStep);
            scrollToTopESPAM();
        }
    };
    
    function updateProgressBarESPAM(currentStep) {
        if (progressBar) {
            const totalSteps = steps.length;
            const progress = ((currentStep) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.style.backgroundColor = coloresESPAM.primario;
        }
    }
    
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
    function validateCurrentStepESPAM(stepNumber) {
        const currentStep = document.getElementById(`step${stepNumber + 1}`);
        const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        let firstInvalidInput = null;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = input;
                
                input.style.borderColor = '#dc3545';
                input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
                
                // Remover el estilo de error cuando el usuario empiece a escribir
                input.addEventListener('input', function() {
                    this.style.borderColor = coloresESPAM.primario;
                    this.style.boxShadow = `0 0 0 3px ${coloresESPAM.primario}15`;
                }, { once: true });
            }
        });
        
        // Validaciones específicas por paso ESPAM
        if (isValid) {
            switch(stepNumber) {
                case 0: // Datos personales
                    isValid = validateDatosPersonalesESPAM();
                    break;
                case 1: // Datos académicos
                    isValid = validateDatosAcademicosESPAM();
                    break;
                case 2: // Credenciales
                    isValid = validateCredencialesESPAM();
                    break;
            }
        }
        
        if (!isValid) {
            showMessageESPAM('Por favor complete correctamente todos los campos requeridos - ESPAM', 'error');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
        }
        
        return isValid;
    }
    
    function validateDatosPersonalesESPAM() {
        const cedula = document.getElementById('cedula').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        
        let isValid = true;
        
        // Validar cédula ecuatoriana
        if (cedula && !validateCedulaESPAM(cedula)) {
            showFieldError('cedula', 'Número de cédula ecuatoriana inválido');
            isValid = false;
        }
        
        // Validar teléfono ecuatoriano
        if (telefono && !validatePhoneESPAM(telefono)) {
            showFieldError('telefono', 'Número de teléfono inválido. Formato: 0987654321');
            isValid = false;
        }
        
        // Validar email institucional ESPAM
        if (email && !email.endsWith('@espam.edu.ec')) {
            showFieldError('email', 'Debe usar un correo institucional ESPAM (@espam.edu.ec)');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateDatosAcademicosESPAM() {
        const userType = userTypeSelect.value;
        const carrera = carreraSelect.value;
        const otraCarrera = document.getElementById('otra_carrera');
        
        let isValid = true;
        
        // Validar carrera para estudiantes y docentes
        if ((userType === 'estudiante' || userType === 'docente') && !carrera) {
            showFieldError('carrera', 'La carrera es requerida para estudiantes y docentes ESPAM');
            isValid = false;
        }
        
        // Validar "Otra" carrera
        if (carrera === 'otra' && otraCarrera && !otraCarrera.value.trim()) {
            showFieldError('otra_carrera', 'Especifique su carrera');
            isValid = false;
        }
        
        // Validar laboratorio para técnicos
        if (userType === 'tecnico') {
            const laboratorio = document.getElementById('laboratorio_asignado').value;
            if (!laboratorio) {
                showFieldError('laboratorio_asignado', 'El laboratorio asignado es requerido para técnicos ESPAM');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function validateCredencialesESPAM() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = document.querySelector('input[name="terms"]').checked;
        
        let isValid = true;
        
        // Validar fortaleza de contraseña
        if (!validatePasswordStrengthESPAM(password)) {
            showMessageESPAM('La contraseña no cumple con los requisitos de seguridad ESPAM', 'error');
            isValid = false;
        }
        
        // Validar coincidencia de contraseñas
        if (password !== confirmPassword) {
            showFieldError('confirm_password', 'Las contraseñas no coinciden');
            isValid = false;
        }
        
        // Validar términos y condiciones
        if (!termsAccepted) {
            showMessageESPAM('Debe aceptar los términos y condiciones de uso de ESPAM', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#dc3545';
            field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
            
            // Mostrar mensaje de error
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
    }
    
    // Verificar fortaleza de contraseña ESPAM
    function checkPasswordStrengthESPAM(password) {
        const requirements = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const passed = Object.values(requirements).filter(Boolean).length;
        const total = Object.keys(requirements).length;
        const percentage = (passed / total) * 100;
        
        // Actualizar barra de progreso ESPAM
        if (strengthBar) {
            strengthBar.style.width = `${percentage}%`;
            
            if (percentage < 40) {
                strengthBar.style.backgroundColor = '#dc3545';
                if (strengthText) strengthText.textContent = 'Débil';
                strengthText.style.color = '#dc3545';
            } else if (percentage < 80) {
                strengthBar.style.backgroundColor = coloresESPAM.secundario2;
                if (strengthText) strengthText.textContent = 'Moderada';
                strengthText.style.color = coloresESPAM.secundario2;
            } else {
                strengthBar.style.backgroundColor = coloresESPAM.secundario1;
                if (strengthText) strengthText.textContent = 'Fuerte';
                strengthText.style.color = coloresESPAM.secundario1;
            }
        }
        
        // Actualizar lista de requisitos ESPAM
        updateRequirementsListESPAM(requirements);
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
    
    function updateRequirementsListESPAM(requirements) {
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
    
    // Verificar coincidencia de contraseñas ESPAM
    function checkPasswordMatchESPAM() {
        const password = passwordInput.value;
        const confirm = confirmPasswordInput.value;
        
        if (password && confirm) {
            const matchElement = document.getElementById('passwordMatch') || document.createElement('div');
            
            if (!matchElement.id) {
                matchElement.id = 'passwordMatch';
                matchElement.style.cssText = `
                    margin-top: 5px;
                    font-size: 0.85rem;
                    font-family: 'Work Sans', sans-serif;
                    font-weight: 500;
                `;
                confirmPasswordInput.parentNode.appendChild(matchElement);
            }
            
            if (password === confirm) {
                matchElement.innerHTML = `<i class="fas fa-check" style="color: ${coloresESPAM.secundario1}; margin-right: 5px;"></i> Las contraseñas coinciden`;
                matchElement.style.color = coloresESPAM.secundario1;
            } else {
                matchElement.innerHTML = `<i class="fas fa-times" style="color: #dc3545; margin-right: 5px;"></i> Las contraseñas no coinciden`;
                matchElement.style.color = '#dc3545';
            }
        }
    }
    
    // Manejar envío del formulario ESPAM
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar todos los pasos
            let allValid = true;
            for (let i = 1; i <= 3; i++) {
                if (!validateCurrentStepESPAM(i - 1)) {
                    allValid = false;
                    // Ir al paso con error
                    steps.forEach(step => step.classList.remove('active'));
                    document.getElementById(`step${i}`).classList.add('active');
                    updateProgressBarESPAM(i - 1);
                    break;
                }
            }
            
            if (!allValid) {
                return;
            }
            
            // Mostrar indicador de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registrando en ESPAM...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Recolectar datos del formulario ESPAM
            const formData = {
                nombres: document.getElementById('nombres').value.trim(),
                apellidos: document.getElementById('apellidos').value.trim(),
                cedula: document.getElementById('cedula').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                sexo: document.getElementById('sexo').value,
                fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
                discapacidad: document.getElementById('discapacidad').value || 'Ninguna',
                userType: document.getElementById('userType').value,
                carrera: carreraSelect.value === 'otra' 
                    ? document.getElementById('otra_carrera').value.trim()
                    : carreraSelect.options[carreraSelect.selectedIndex].text,
                semestre: document.getElementById('semestre').value || null,
                laboratorio_asignado: document.getElementById('laboratorio_asignado').value || null,
                email: document.getElementById('email').value.trim(),
                email_personal: document.getElementById('email_personal').value.trim(),
                password: passwordInput.value,
                newsletter: document.querySelector('input[name="newsletter"]').checked,
                registro_fecha: new Date().toISOString(),
                institucion: 'Universidad ESPAM MFL'
            };
            
            // Registrar usuario en Supabase
            try {
                const resultado = await AuthService.registrar(formData.email, formData.password, {
                    nombre: `${formData.nombres} ${formData.apellidos}`,
                    tipo: formData.userType,
                    carrera: formData.carrera,
                    semestre: formData.semestre,
                    laboratorio: formData.laboratorio_asignado,
                    telefono: formData.telefono,
                    cedula: formData.cedula,
                    sexo: formData.sexo,
                    fecha_nacimiento: formData.fecha_nacimiento,
                    discapacidad: formData.discapacidad,
                    email_personal: formData.email_personal
                });

                if (resultado.success) {
                    showMessageESPAM('¡Registro exitoso en la Universidad ESPAM MFL! Redirigiendo al login...', 'success');
                    registerForm.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessageESPAM('Error al registrar: ' + (resultado.error || 'Intente nuevamente.'), 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            } catch (error) {
                console.error('Error en registro ESPAM:', error);
                showMessageESPAM('Error al conectar con el servidor. Intente nuevamente.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
    
    // La función saveUserESPAM ha sido reemplazada por AuthService.registrar()
    // que guarda los datos directamente en Supabase (PostgreSQL)
    
    // Inicializar validaciones específicas ESPAM
    function initValidacionesESPAM() {
        // Validación de cédula ecuatoriana
        const cedulaInput = document.getElementById('cedula');
        if (cedulaInput) {
            cedulaInput.addEventListener('blur', function() {
                if (this.value.trim() && !validateCedulaESPAM(this.value.trim())) {
                    showFieldError('cedula', 'Número de cédula ecuatoriana inválido');
                }
            });
        }
        
        // Validación de teléfono
        const phoneInput = document.getElementById('telefono');
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (this.value.trim() && !validatePhoneESPAM(this.value.trim())) {
                    showFieldError('telefono', 'Número de teléfono inválido. Formato: 0987654321');
                }
            });
        }
        
        // Validación de email ESPAM
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (!this.value.endsWith('@espam.edu.ec')) {
                        showFieldError('email', 'Debe usar un correo institucional ESPAM (@espam.edu.ec)');
                    } else if (!validateEmailESPAM(this.value)) {
                        showFieldError('email', 'Formato de email inválido');
                    }
                }
            });
        }
    }
    
    // FUNCIONES DE VALIDACIÓN ESPECÍFICAS ESPAM
    
    function validateCedulaESPAM(cedula) {
        if (cedula.length !== 10) return false;
        if (!/^\d+$/.test(cedula)) return false;
        
        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        const provincia = parseInt(cedula.substring(0, 2));
        const tercerDigito = parseInt(cedula.substring(2, 3));
        
        if (provincia < 1 || provincia > 24) return false;
        if (tercerDigito < 0 || tercerDigito > 6) return false;
        
        let suma = 0;
        for (let i = 0; i < 9; i++) {
            let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
            if (valor >= 10) valor -= 9;
            suma += valor;
        }
        
        const digitoVerificador = parseInt(cedula.charAt(9));
        const resultado = (Math.ceil(suma / 10) * 10) - suma;
        
        return resultado === digitoVerificador;
    }
    
    function validatePhoneESPAM(phone) {
        const regex = /^(09\d{8}|\+593\d{9})$/;
        return regex.test(phone);
    }
    
    function validateEmailESPAM(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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
        const activeStep = document.querySelector('.form-step.active');
        if (activeStep) {
            const form = activeStep.querySelector('form');
            if (form) {
                form.parentNode.insertBefore(messageDiv, form);
            }
        }
        
        // Auto-eliminar después de la duración
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
            
            /* Estilos para pasos del formulario ESPAM */
            .form-step h3 {
                font-family: 'Libertad Mono', monospace !important;
                font-weight: 700 !important;
                color: ${coloresESPAM.primario} !important;
                margin-bottom: 20px !important;
            }
            
            .form-step p {
                font-family: 'Work Sans', sans-serif !important;
                color: #666 !important;
                margin-bottom: 25px !important;
            }
            
            /* Barra de progreso ESPAM */
            .progress {
                background-color: ${coloresESPAM.fondoClaro} !important;
                border-radius: 10px !important;
                height: 8px !important;
                margin-bottom: 30px !important;
            }
            
            .progress-bar {
                background-color: ${coloresESPAM.primario} !important;
                border-radius: 10px !important;
                transition: width 0.3s ease !important;
            }
            
            /* Indicador de fortaleza de contraseña ESPAM */
            .strength-indicator {
                margin-top: 10px !important;
                font-family: 'Work Sans', sans-serif !important;
            }
            
            .strength-bar-container {
                background-color: ${coloresESPAM.fondoClaro} !important;
                border-radius: 4px !important;
                height: 6px !important;
                margin: 5px 0 !important;
                overflow: hidden !important;
            }
            
            /* Lista de requisitos ESPAM */
            .requirements-list {
                list-style: none !important;
                padding: 0 !important;
                margin-top: 15px !important;
            }
            
            .requirements-list li {
                font-family: 'Work Sans', sans-serif !important;
                font-size: 0.85rem !important;
                margin-bottom: 8px !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            
            /* Checkbox ESPAM */
            .checkbox-container input:checked + .checkmark {
                background-color: ${coloresESPAM.primario} !important;
                border-color: ${coloresESPAM.primario} !important;
            }
            
            /* Enlaces ESPAM */
            .terms-link {
                color: ${coloresESPAM.primario} !important;
                font-family: 'Work Sans', sans-serif !important;
                font-weight: 600 !important;
                text-decoration: none !important;
            }
            
            .terms-link:hover {
                color: ${coloresESPAM.secundario3} !important;
                text-decoration: underline !important;
            }
        `;
        document.head.appendChild(estilos);
    }
});