// config.js - Configuración global del sistema UDIV ESPAM MFL

const UDIV_CONFIG = {
    // Configuración de la institución
    institucion: {
        nombre: "UDIV ESPAM MFL",
        nombreCompleto: "Universidad de Investigación y Vinculación - ESPAM MFL",
        nombreOficial: "Universidad ESPAM Formación de Líderes",
        sigla: "ESPAM MFL",
        direccion: "Vía Calceta-El Tambo, Manabí, Ecuador",
        telefono: "(05) 301-5000",
        email: "info@espam.edu.ec",
        website: "https://espam.edu.ec",
        mision: "Formar profesionales líderes mediante la investigación y vinculación con la sociedad",
        vision: "Ser referente en educación superior de calidad en la región"
    },

    // IDENTIDAD VISUAL ESPAM MFL - Paleta cromática oficial
    identidadVisual: {
        // PALETA CROMÁTICA PRINCIPAL
        colores: {
            primario: "#005846",      // Color principal - HEX #005846
            primarioRGB: "0, 88, 70", // RGB para gradientes
            secundario1: "#39b54a",   // Verde - HEX #39b54a
            secundario2: "#cbdb2a",   // Amarillo verdoso - HEX #cbdb2a
            secundario3: "#08b89d",   // Turquesa - HEX #08b89d
            fondoClaro: "#F8F8F2",    // Fondo claro / Pantone 663 C
            blanco: "#FFFFFF",
            grisClaro: "#F8F9FA",
            grisMedio: "#6C757D",
            grisOscuro: "#343A40"
        },

        // TIPOGRAFÍAS OFICIALES
        tipografias: {
            principal: {
                nombre: "Libertad Mono",
                familia: "'Libertad Mono', monospace",
                pesos: ["400", "700"], // Regular, Bold
                uso: "Documentos impresos, títulos, encabezados y materiales institucionales"
            },
            alternativa: {
                nombre: "Work Sans",
                familia: "'Work Sans', sans-serif",
                pesos: ["300", "400", "500", "600", "700", "800"], // Thin, Light, Regular, Medium, Bold, Extra Bold
                uso: "Correos electrónicos, presentaciones ofimáticas y documentos internos que no admitan fuentes personalizadas"
            }
        },

        // ESPECIFICACIONES DEL LOGOTIPO
        logotipo: {
            versiones: ["color", "blanco", "negro"],
            reduccionMinima: {
                pantalla: {
                    horizontal: "120px",
                    vertical: "100px"
                },
                impresion: {
                    horizontal: "30mm",
                    vertical: "25mm"
                }
            },
            areaProteccion: "unidad modular X (altura de la letra 'E')"
        },

        // CONSIDERACIONES DE USO
        consideraciones: [
            "Evitar el uso de fuentes decorativas o de fantasía en comunicaciones oficiales",
            "Mantener jerarquías visuales claras mediante el uso coherente de pesos tipográficos",
            "Respetar siempre el interlineado y espaciado definido para una lectura óptima"
        ]
    },

    // COLORES FUNCIONALES (basados en paleta institucional)
    coloresFuncionales: {
        success: "#39b54a",       // Verde institucional
        warning: "#cbdb2a",       // Amarillo institucional
        danger: "#dc3545",        // Rojo (mantenido para alertas críticas)
        info: "#08b89d",          // Turquesa institucional
        destacado: "#005846"      // Color principal
    },

    // Laboratorios disponibles
    laboratorios: [
        {
            id: "bromatologia",
            nombre: "Laboratorio de Bromatología ESPAM",
            descripcion: "Análisis de alimentos, control de calidad y seguridad alimentaria",
            capacidad: 25,
            horario: {
                lunes: { apertura: "08:00", cierre: "18:00" },
                martes: { apertura: "08:00", cierre: "18:00" },
                miercoles: { apertura: "08:00", cierre: "18:00" },
                jueves: { apertura: "08:00", cierre: "18:00" },
                viernes: { apertura: "08:00", cierre: "18:00" },
                sabado: { apertura: "09:00", cierre: "13:00" },
                domingo: null
            },
            tecnico: "Ing. Wellington Espinoza",
            contacto: "05-301-5000 ext. 123",
            ubicacion: "Edificio B, Sala 201",
            equiposPrincipales: ["Microscopios", "Balanzas analíticas", "Estufas", "Centrífugas", "pH-metros"],
            colorAsignado: "#005846" // Color principal
        },
        {
            id: "biologia",
            nombre: "Laboratorio de Biología ESPAM",
            descripcion: "Investigación biológica, microbiología y biotecnología",
            capacidad: 20,
            horario: {
                lunes: { apertura: "08:00", cierre: "17:00" },
                martes: { apertura: "08:00", cierre: "17:00" },
                miercoles: { apertura: "08:00", cierre: "17:00" },
                jueves: { apertura: "08:00", cierre: "17:00" },
                viernes: { apertura: "08:00", cierre: "17:00" },
                sabado: null,
                domingo: null
            },
            tecnico: "Lic. Ana Rodríguez",
            contacto: "05-301-5000 ext. 124",
            ubicacion: "Edificio C, Sala 105",
            equiposPrincipales: ["Microscopios electrónicos", "Autoclaves", "Incubadoras", "Campanas de flujo laminar"],
            colorAsignado: "#39b54a" // Verde institucional
        },
        {
            id: "produccion",
            nombre: "Laboratorio de Producción ESPAM",
            descripcion: "Procesos de producción industrial y manufactura",
            capacidad: 30,
            horario: {
                lunes: { apertura: "07:00", cierre: "19:00" },
                martes: { apertura: "07:00", cierre: "19:00" },
                miercoles: { apertura: "07:00", cierre: "19:00" },
                jueves: { apertura: "07:00", cierre: "19:00" },
                viernes: { apertura: "07:00", cierre: "19:00" },
                sabado: { apertura: "08:00", cierre: "14:00" },
                domingo: null
            },
            tecnico: "Ing. Roberto Martínez",
            contacto: "05-301-5000 ext. 125",
            ubicacion: "Edificio D, Sala 301",
            equiposPrincipales: ["Máquinas CNC", "Impresoras 3D", "Equipo de soldadura", "Tornos", "Fresadoras"],
            colorAsignado: "#08b89d" // Turquesa institucional
        },
        {
            id: "quimica",
            nombre: "Laboratorio de Química ESPAM",
            descripcion: "Análisis químicos y experimentación",
            capacidad: 15,
            horario: {
                lunes: { apertura: "08:00", cierre: "17:00" },
                martes: { apertura: "08:00", cierre: "17:00" },
                miercoles: { apertura: "08:00", cierre: "17:00" },
                jueves: { apertura: "08:00", cierre: "17:00" },
                viernes: { apertura: "08:00", cierre: "17:00" },
                sabado: null,
                domingo: null
            },
            tecnico: "Q.F. Laura González",
            contacto: "05-301-5000 ext. 126",
            ubicacion: "Edificio A, Sala 102",
            equiposPrincipales: ["Espectrofotómetro", "HPLC", "Campanas de extracción", "Balanzas analíticas"],
            colorAsignado: "#cbdb2a" // Amarillo verdoso institucional
        }
    ],

    // Carreras disponibles ESPAM MFL
    carreras: [
        {
            id: "ing-produccion",
            nombre: "Ingeniería de la Producción",
            facultad: "Ciencias Administrativas y Económicas",
            duracion: "10 semestres",
            coordinador: "Ing. Carlos Mendoza"
        },
        {
            id: "ing-alimentos",
            nombre: "Ingeniería en Alimentos",
            facultad: "Ciencias Agropecuarias",
            duracion: "10 semestres",
            coordinador: "Ing. María Torres"
        },
        {
            id: "biotecnologia",
            nombre: "Biotecnología",
            facultad: "Ciencias de la Vida",
            duracion: "10 semestres",
            coordinador: "Dra. Laura Castro"
        },
        {
            id: "ing-ambiental",
            nombre: "Ingeniería Ambiental",
            facultad: "Ciencias de la Vida",
            duracion: "10 semestres",
            coordinador: "Ing. Pablo Rojas"
        },
        {
            id: "ing-agroindustrial",
            nombre: "Ingeniería Agroindustrial",
            facultad: "Ciencias Agropecuarias",
            duracion: "10 semestres",
            coordinador: "Ing. Ricardo Salazar"
        },
        {
            id: "administracion",
            nombre: "Administración de Empresas",
            facultad: "Ciencias Administrativas y Económicas",
            duracion: "8 semestres",
            coordinador: "Mg. Sofía Villacís"
        },
        {
            id: "contabilidad",
            nombre: "Contabilidad y Auditoría",
            facultad: "Ciencias Administrativas y Económicas",
            duracion: "8 semestres",
            coordinador: "CPA. Roberto Zambrano"
        },
        {
            id: "informatica",
            nombre: "Informática",
            facultad: "Ciencias de la Computación",
            duracion: "8 semestres",
            coordinador: "Ing. Daniel López"
        },
        {
            id: "turismo",
            nombre: "Turismo",
            facultad: "Ciencias Administrativas y Económicas",
            duracion: "8 semestres",
            coordinador: "Mg. Patricia Alvarado"
        }
    ],

    // Tipos de usuario ESPAM
    tiposUsuario: {
        tecnico: {
            nombre: "Técnico Encargado ESPAM",
            descripcion: "Personal responsable de la gestión y mantenimiento de laboratorios",
            permisos: ["gestion_laboratorio", "ver_reservas", "gestion_equipos", "gestion_sustancias", "ver_reportes", "gestion_usuarios"],
            color: "#005846" // Color principal
        },
        docente: {
            nombre: "Docente ESPAM",
            descripcion: "Profesor responsable de prácticas de laboratorio",
            permisos: ["reservar_laboratorio", "ver_reservas_propias", "intercambiar_horarios", "generar_hoja_guia", "calificar_laboratorio"],
            color: "#39b54a" // Verde institucional
        },
        estudiante: {
            nombre: "Estudiante ESPAM",
            descripcion: "Estudiante que realiza prácticas de laboratorio",
            permisos: ["ver_practicas", "ver_hojas_guia", "calificar_laboratorio", "ver_materiales"],
            color: "#08b89d" // Turquesa institucional
        },
        admin: {
            nombre: "Administrador ESPAM",
            descripcion: "Administrador del sistema UDIV",
            permisos: ["gestion_todo", "configuracion_sistema", "ver_auditoria", "gestion_backups"],
            color: "#cbdb2a" // Amarillo institucional
        }
    },

    // Estados de reserva (con colores institucionales)
    estadosReserva: {
        pendiente: { 
            nombre: "Pendiente", 
            color: "#cbdb2a", // Amarillo institucional
            descripcion: "Esperando confirmación del técnico" 
        },
        confirmada: { 
            nombre: "Confirmada", 
            color: "#39b54a", // Verde institucional
            descripcion: "Reserva aprobada por el técnico" 
        },
        cancelada: { 
            nombre: "Cancelada", 
            color: "#dc3545", // Rojo (mantenido)
            descripcion: "Reserva cancelada por el usuario o técnico" 
        },
        en_curso: { 
            nombre: "En Curso", 
            color: "#08b89d", // Turquesa institucional
            descripcion: "Práctica actualmente en desarrollo" 
        },
        completada: { 
            nombre: "Completada", 
            color: "#005846", // Color principal
            descripcion: "Práctica finalizada correctamente" 
        },
        rechazada: {
            nombre: "Rechazada",
            color: "#6C757D", // Gris
            descripcion: "Reserva rechazada por el técnico"
        }
    },

    // Horarios disponibles para reservas (según normas ESPAM)
    horariosDisponibles: [
        "08:00-10:00",
        "10:00-12:00",
        "12:00-14:00",
        "14:00-16:00",
        "16:00-18:00"
    ],

    // Configuración de notificaciones
    notificaciones: {
        recordatorioPractica: 24, // horas antes
        maxReservasPorDia: 2,
        tiempoMaxReserva: 4, // horas
        diasAnticipacionReserva: 7,
        emailInstitucional: "@espam.edu.ec",
        sms: {
            habilitado: false,
            proveedor: "TWILIO"
        }
    },

    // Configuración de seguridad ESPAM
    seguridad: {
        longitudMinimaPassword: 8,
        requiereMayusculas: true,
        requiereNumeros: true,
        requiereCaracteresEspeciales: true,
        expiracionSesion: 30, // minutos de inactividad
        intentosMaximosLogin: 5,
        bloqueoTemporal: 15, // minutos
        requiere2FA: false,
        politicas: {
            cambioObligatorio: 90, // días
            historicoContrasenas: 5,
            complejidad: "alta"
        }
    },

    // Feriados nacionales (Ecuador 2024)
    feriados: [
        "2024-01-01", // Año Nuevo
        "2024-01-06", // Reyes Magos
        "2024-02-12", // Carnaval
        "2024-02-13", // Carnaval
        "2024-03-28", // Jueves Santo
        "2024-03-29", // Viernes Santo
        "2024-05-01", // Día del Trabajo
        "2024-05-24", // Batalla de Pichincha
        "2024-08-10", // Primer Grito de Independencia
        "2024-10-09", // Independencia de Guayaquil
        "2024-11-02", // Día de los Difuntos
        "2024-11-03", // Independencia de Cuenca
        "2024-12-25"  // Navidad
    ],

    // Configuración de reportes (formato institucional)
    reportes: {
        formatosExportacion: ["pdf", "excel", "csv"],
        periodosDisponibles: ["dia", "semana", "mes", "trimestre", "semestre", "anual"],
        encabezado: {
            incluirLogo: true,
            colorFondo: "#005846",
            colorTexto: "#FFFFFF",
            fuenteTitulo: "Libertad Mono",
            fuenteContenido: "Work Sans"
        },
        piePagina: {
            incluirPagina: true,
            texto: "Universidad ESPAM MFL - Sistema UDIV",
            mostrarFecha: true
        }
    },

    // URLs de la API (para desarrollo/producción)
    api: {
        desarrollo: "http://localhost:3000/api",
        produccion: "https://api.udiv.espam.edu.ec",
        version: "v1",
        timeout: 30000, // 30 segundos
        headers: {
            "Content-Type": "application/json",
            "X-ESPAM-API-Key": "",
            "X-Institucion": "ESPAM-MFL"
        }
    },

    // Configuración de almacenamiento
    almacenamiento: {
        localStorage: {
            prefijo: "espam_udiv_",
            version: "1.0",
            backupAutomatico: true
        },
        sessionStorage: {
            prefijo: "espam_session_",
            datosSensibles: ["token", "usuario"]
        }
    },

    // Versión del sistema
    version: {
        numero: "1.0.0",
        nombreCodigo: "Proyecto UDIV",
        fechaLanzamiento: "2024-01-15",
        entorno: "desarrollo", // desarrollo | testing | produccion
        soporte: "soporte@espam.edu.ec"
    },

    // Configuración de logging
    logging: {
        nivel: "info", // error | warn | info | debug
        consola: true,
        archivo: false,
        maxSizeMB: 10
    }
};

// FUNCIONES DE UTILIDAD ESPAM MFL
const ConfigHelper = {
    // Obtener información de identidad visual
    getIdentidadVisual: function() {
        return UDIV_CONFIG.identidadVisual;
    },

    // Aplicar estilos institucionales a un elemento
    aplicarEstilosESPAM: function(elemento, tipo = "contenedor") {
        const estilos = {
            contenedor: {
                fontFamily: UDIV_CONFIG.identidadVisual.tipografias.alternativa.familia,
                color: UDIV_CONFIG.identidadVisual.colores.grisOscuro
            },
            titulo: {
                fontFamily: UDIV_CONFIG.identidadVisual.tipografias.principal.familia,
                fontWeight: "700",
                color: UDIV_CONFIG.identidadVisual.colores.primario
            },
            botonPrimario: {
                fontFamily: UDIV_CONFIG.identidadVisual.tipografias.alternativa.familia,
                backgroundColor: UDIV_CONFIG.identidadVisual.colores.primario,
                color: UDIV_CONFIG.identidadVisual.colores.blanco,
                border: "none",
                fontWeight: "600"
            },
            botonSecundario: {
                fontFamily: UDIV_CONFIG.identidadVisual.tipografias.alternativa.familia,
                backgroundColor: UDIV_CONFIG.identidadVisual.colores.secundario3,
                color: UDIV_CONFIG.identidadVisual.colores.blanco,
                border: "none",
                fontWeight: "600"
            }
        };

        if (elemento && estilos[tipo]) {
            Object.assign(elemento.style, estilos[tipo]);
        }
    },

    // Obtener información de un laboratorio por ID
    getLaboratorio: function(id) {
        return UDIV_CONFIG.laboratorios.find(lab => lab.id === id);
    },

    // Obtener todos los laboratorios disponibles
    getLaboratorios: function() {
        return UDIV_CONFIG.laboratorios;
    },

    // Verificar si una fecha es feriado
    esFeriado: function(fecha) {
        const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString().split('T')[0];
        return UDIV_CONFIG.feriados.includes(fechaStr);
    },

    // Obtener permisos de un tipo de usuario
    getPermisos: function(tipoUsuario) {
        return UDIV_CONFIG.tiposUsuario[tipoUsuario]?.permisos || [];
    },

    // Verificar si un usuario tiene un permiso específico
    tienePermiso: function(tipoUsuario, permiso) {
        const permisos = this.getPermisos(tipoUsuario);
        return permisos.includes(permiso);
    },

    // Validar fortaleza de contraseña según configuración ESPAM
    validarPassword: function(password) {
        const config = UDIV_CONFIG.seguridad;
        const errores = [];

        if (password.length < config.longitudMinimaPassword) {
            errores.push(`La contraseña debe tener al menos ${config.longitudMinimaPassword} caracteres`);
        }

        if (config.requiereMayusculas && !/[A-Z]/.test(password)) {
            errores.push("La contraseña debe contener al menos una letra mayúscula");
        }

        if (config.requiereNumeros && !/\d/.test(password)) {
            errores.push("La contraseña debe contener al menos un número");
        }

        if (config.requiereCaracteresEspeciales && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errores.push("La contraseña debe contener al menos un carácter especial");
        }

        return {
            valida: errores.length === 0,
            errores: errores
        };
    },

    // Obtener horario de un laboratorio para un día específico
    getHorarioLaboratorio: function(labId, dia) {
        const laboratorio = this.getLaboratorio(labId);
        if (!laboratorio || !laboratorio.horario[dia]) {
            return null;
        }
        return laboratorio.horario[dia];
    },

    // Verificar si un horario está dentro del horario del laboratorio
    esHorarioValido: function(labId, dia, horaInicio, horaFin) {
        const horarioLab = this.getHorarioLaboratorio(labId, dia);
        if (!horarioLab) return false;

        const [horaApertura, minutoApertura] = horarioLab.apertura.split(':').map(Number);
        const [horaCierre, minutoCierre] = horarioLab.cierre.split(':').map(Number);
        const [horaInicioReserva, minutoInicioReserva] = horaInicio.split(':').map(Number);
        const [horaFinReserva, minutoFinReserva] = horaFin.split(':').map(Number);

        const tiempoApertura = horaApertura * 60 + minutoApertura;
        const tiempoCierre = horaCierre * 60 + minutoCierre;
        const tiempoInicioReserva = horaInicioReserva * 60 + minutoInicioReserva;
        const tiempoFinReserva = horaFinReserva * 60 + minutoFinReserva;

        return tiempoInicioReserva >= tiempoApertura && 
               tiempoFinReserva <= tiempoCierre && 
               tiempoInicioReserva < tiempoFinReserva;
    },

    // Obtener el color de un estado
    getColorEstado: function(estado) {
        return UDIV_CONFIG.estadosReserva[estado]?.color || UDIV_CONFIG.identidadVisual.colores.grisMedio;
    },

    // Obtener el nombre de un estado
    getNombreEstado: function(estado) {
        return UDIV_CONFIG.estadosReserva[estado]?.nombre || estado;
    },

    // Obtener carrera por ID
    getCarrera: function(id) {
        return UDIV_CONFIG.carreras.find(carrera => carrera.id === id);
    },

    // Obtener tipo de usuario por ID
    getTipoUsuario: function(id) {
        return UDIV_CONFIG.tiposUsuario[id];
    },

    // Generar email institucional
    generarEmailInstitucional: function(username) {
        return `${username}${UDIV_CONFIG.notificaciones.emailInstitucional}`;
    },

    // Obtener configuración de reportes con identidad ESPAM
    getConfigReporte: function() {
        return {
            ...UDIV_CONFIG.reportes,
            institucion: UDIV_CONFIG.institucion.nombreOficial,
            colores: UDIV_CONFIG.identidadVisual.colores
        };
    },

    // Verificar si es horario hábil (lunes a viernes, 8am-6pm)
    esHorarioHabil: function(fecha) {
        const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
        const diaSemana = fechaObj.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
        const hora = fechaObj.getHours();
        
        // Lunes a viernes
        if (diaSemana >= 1 && diaSemana <= 5) {
            // Horario hábil: 8am - 6pm
            return hora >= 8 && hora < 18;
        }
        
        return false;
    }
};

// INICIALIZACIÓN DE ESTILOS INSTITUCIONALES
function inicializarEstilosESPAM() {
    // Crear y agregar estilos CSS dinámicos
    const estilos = document.createElement('style');
    estilos.id = 'espam-estilos-institucionales';
    
    estilos.textContent = `
        /* ESTILOS INSTITUCIONALES ESPAM MFL */
        
        :root {
            /* Variables de color */
            --espam-color-primario: ${UDIV_CONFIG.identidadVisual.colores.primario};
            --espam-color-secundario-1: ${UDIV_CONFIG.identidadVisual.colores.secundario1};
            --espam-color-secundario-2: ${UDIV_CONFIG.identidadVisual.colores.secundario2};
            --espam-color-secundario-3: ${UDIV_CONFIG.identidadVisual.colores.secundario3};
            --espam-color-fondo-claro: ${UDIV_CONFIG.identidadVisual.colores.fondoClaro};
            
            /* Variables de tipografía */
            --espam-fuente-principal: ${UDIV_CONFIG.identidadVisual.tipografias.principal.familia};
            --espam-fuente-alternativa: ${UDIV_CONFIG.identidadVisual.tipografias.alternativa.familia};
        }
        
        /* Aplicar tipografía alternativa por defecto */
        body, input, textarea, select, button {
            font-family: var(--espam-fuente-alternativa);
        }
        
        /* Títulos con tipografía principal */
        h1, h2, h3, h4, h5, h6, .titulo-espam {
            font-family: var(--espam-fuente-principal);
            font-weight: 700;
            color: var(--espam-color-primario);
        }
        
        /* Botones institucionales */
        .btn-espam-primary {
            background-color: var(--espam-color-primario) !important;
            border-color: var(--espam-color-primario) !important;
            color: white !important;
            font-family: var(--espam-fuente-alternativa);
            font-weight: 600;
        }
        
        .btn-espam-secondary {
            background-color: var(--espam-color-secundario-3) !important;
            border-color: var(--espam-color-secundario-3) !important;
            color: white !important;
            font-family: var(--espam-fuente-alternativa);
            font-weight: 600;
        }
        
        /* Estados con colores institucionales */
        .estado-confirmada {
            color: var(--espam-color-secundario-1) !important;
            background-color: ${UDIV_CONFIG.identidadVisual.colores.secundario1}15 !important;
        }
        
        .estado-pendiente {
            color: var(--espam-color-secundario-2) !important;
            background-color: ${UDIV_CONFIG.identidadVisual.colores.secundario2}15 !important;
        }
        
        .estado-encurso {
            color: var(--espam-color-secundario-3) !important;
            background-color: ${UDIV_CONFIG.identidadVisual.colores.secundario3}15 !important;
        }
        
        /* Tarjetas con identidad ESPAM */
        .card-espam {
            border-top: 4px solid var(--espam-color-primario);
            border-radius: 8px;
            font-family: var(--espam-fuente-alternativa);
        }
        
        /* Enlaces institucionales */
        a.espam-link {
            color: var(--espam-color-primario);
            text-decoration: none;
            transition: color 0.3s;
        }
        
        a.espam-link:hover {
            color: var(--espam-color-secundario-3);
            text-decoration: underline;
        }
    `;
    
    document.head.appendChild(estilos);
    
    // Aplicar clase body para identificación
    document.body.classList.add('sistema-espam-mfl');
}

// Exportar configuración para uso global
if (typeof window !== 'undefined') {
    window.UDIV_CONFIG = UDIV_CONFIG;
    window.ConfigHelper = ConfigHelper;
    
    // Inicializar estilos cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarEstilosESPAM);
    } else {
        inicializarEstilosESPAM();
    }
}

// Exportar para módulos (si se usa ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UDIV_CONFIG,
        ConfigHelper,
        inicializarEstilosESPAM
    };
}