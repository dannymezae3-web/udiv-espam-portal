// supabase-client.js - Cliente Supabase y servicios de datos - UNIVERSIDAD ESPAM MFL

// ============================================
// CONFIGURACIÓN SUPABASE
// ============================================
const SUPABASE_URL = 'https://qlxrpqfisjizqlffqbuh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseHJwcWZpc2ppenFsZmZxYnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzMyMzcsImV4cCI6MjA4NTgwOTIzN30.ADGKG601SWlwexfOeArZ44t0iqAF6DZCNpJziMLOUAo';

// Inicializar cliente Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================
const AuthService = {
    // Registrar nuevo usuario
    async registrar(email, password, datosUsuario) {
        try {
            // 1. Crear usuario en auth
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: password
            });

            if (authError) throw authError;

            // 2. Crear perfil en tabla usuarios
            if (authData.user) {
                const { error: profileError } = await supabaseClient
                    .from('usuarios')
                    .insert({
                        id: authData.user.id,
                        nombre: datosUsuario.nombre,
                        email: email,
                        tipo: datosUsuario.tipo,
                        codigo: datosUsuario.codigo || null,
                        carrera_nombre: datosUsuario.carrera || null,
                        semestre: datosUsuario.semestre || null,
                        laboratorio_nombre: datosUsuario.laboratorio || null,
                        contacto: datosUsuario.telefono || null,
                        cedula: datosUsuario.cedula || null,
                        telefono: datosUsuario.telefono || null,
                        sexo: datosUsuario.sexo || null,
                        fecha_nacimiento: datosUsuario.fecha_nacimiento || null,
                        discapacidad: datosUsuario.discapacidad || 'Ninguna',
                        email_personal: datosUsuario.email_personal || null,
                        institucion: 'Universidad ESPAM MFL'
                    });

                if (profileError) {
                    console.error('Error creando perfil ESPAM:', profileError);
                    throw profileError;
                }
            }

            return { success: true, data: authData };
        } catch (error) {
            console.error('Error en registro ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Iniciar sesión
    async login(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Obtener perfil del usuario
            const perfil = await UsuariosService.obtenerPerfil(data.user.id);

            // Actualizar último acceso
            await supabaseClient
                .from('usuarios')
                .update({ ultimo_acceso: new Date().toISOString() })
                .eq('id', data.user.id);

            return { success: true, data: data, perfil: perfil };
        } catch (error) {
            console.error('Error en login ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Cerrar sesión
    async logout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            // Limpiar storage legacy
            localStorage.removeItem('espam_userSession');
            sessionStorage.removeItem('espam_userSession');
            localStorage.removeItem('userSession');
            sessionStorage.removeItem('userSession');

            return { success: true };
        } catch (error) {
            console.error('Error en logout ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener sesión actual
    async getSesion() {
        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error) throw error;

            if (session) {
                const perfil = await UsuariosService.obtenerPerfil(session.user.id);
                return { session, perfil };
            }

            return { session: null, perfil: null };
        } catch (error) {
            console.error('Error obteniendo sesión ESPAM:', error);
            return { session: null, perfil: null };
        }
    },

    // Obtener usuario actual
    async getUsuarioActual() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return null;

            const perfil = await UsuariosService.obtenerPerfil(user.id);
            return perfil;
        } catch (error) {
            console.error('Error obteniendo usuario actual ESPAM:', error);
            return null;
        }
    },

    // Escuchar cambios de sesión
    onAuthChange(callback) {
        return supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },

    // Recuperar contraseña
    async recuperarPassword(email) {
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/login.html'
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error en recuperación ESPAM:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================
// SERVICIO DE USUARIOS
// ============================================
const UsuariosService = {
    // Obtener perfil por ID
    async obtenerPerfil(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('usuarios')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error obteniendo perfil ESPAM:', error);
            return null;
        }
    },

    // Actualizar perfil
    async actualizarPerfil(userId, datos) {
        try {
            const { data, error } = await supabaseClient
                .from('usuarios')
                .update(datos)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error actualizando perfil ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Listar todos los usuarios (admin/tecnico)
    async listarUsuarios(filtros = {}) {
        try {
            let query = supabaseClientClient.from('usuarios').select('*');

            if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
            if (filtros.carrera) query = query.eq('carrera_nombre', filtros.carrera);
            if (filtros.estado) query = query.eq('estado', filtros.estado);

            query = query.order('nombre');

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error listando usuarios ESPAM:', error);
            return [];
        }
    }
};

// ============================================
// SERVICIO DE LABORATORIOS
// ============================================
const LaboratoriosService = {
    // Obtener todos los laboratorios
    async obtenerTodos() {
        try {
            const { data, error } = await supabaseClient
                .from('laboratorios')
                .select('*')
                .order('nombre');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo laboratorios ESPAM:', error);
            return [];
        }
    },

    // Obtener laboratorio por código
    async obtenerPorCodigo(codigo) {
        try {
            const { data, error } = await supabaseClient
                .from('laboratorios')
                .select('*')
                .eq('codigo', codigo)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error obteniendo laboratorio ESPAM:', error);
            return null;
        }
    },

    // Obtener laboratorio por ID
    async obtenerPorId(id) {
        try {
            const { data, error } = await supabaseClient
                .from('laboratorios')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error obteniendo laboratorio ESPAM:', error);
            return null;
        }
    },

    // Actualizar laboratorio
    async actualizar(id, datos) {
        try {
            const { data, error } = await supabaseClient
                .from('laboratorios')
                .update(datos)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error actualizando laboratorio ESPAM:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================
// SERVICIO DE RESERVAS
// ============================================
const ReservasService = {
    // Crear reserva
    async crear(datosReserva) {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) throw new Error('No hay sesión activa');

            const { data, error } = await supabaseClient
                .from('reservas')
                .insert({
                    laboratorio_id: datosReserva.laboratorio_id,
                    usuario_id: user.id,
                    fecha: datosReserva.fecha,
                    hora_inicio: datosReserva.hora_inicio,
                    hora_fin: datosReserva.hora_fin,
                    docente: datosReserva.docente || null,
                    carrera: datosReserva.carrera || null,
                    tema: datosReserva.tema || null,
                    descripcion: datosReserva.descripcion || null,
                    estado: 'pendiente',
                    estudiantes_count: datosReserva.estudiantes_count || 0,
                    participantes: datosReserva.participantes || []
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creando reserva ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener reservas del usuario actual
    async obtenerMisReservas() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabaseClient
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nombre, codigo, color_asignado, ubicacion)
                `)
                .eq('usuario_id', user.id)
                .order('fecha', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo reservas ESPAM:', error);
            return [];
        }
    },

    // Obtener todas las reservas (admin/tecnico)
    async obtenerTodas(filtros = {}) {
        try {
            let query = supabaseClient
                .from('reservas')
                .select(`
                    *,
                    laboratorios (nombre, codigo, color_asignado),
                    usuarios (nombre, tipo, carrera_nombre)
                `);

            if (filtros.laboratorio_id) query = query.eq('laboratorio_id', filtros.laboratorio_id);
            if (filtros.estado) query = query.eq('estado', filtros.estado);
            if (filtros.fecha) query = query.eq('fecha', filtros.fecha);
            if (filtros.fechaDesde) query = query.gte('fecha', filtros.fechaDesde);
            if (filtros.fechaHasta) query = query.lte('fecha', filtros.fechaHasta);

            query = query.order('fecha', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo reservas ESPAM:', error);
            return [];
        }
    },

    // Obtener reservas por laboratorio y fecha (para verificar disponibilidad)
    async obtenerPorLabYFecha(laboratorioId, fecha) {
        try {
            const { data, error } = await supabaseClient
                .from('reservas')
                .select('*')
                .eq('laboratorio_id', laboratorioId)
                .eq('fecha', fecha)
                .not('estado', 'in', '("cancelada","rechazada")');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error verificando disponibilidad ESPAM:', error);
            return [];
        }
    },

    // Actualizar estado de reserva
    async actualizarEstado(reservaId, nuevoEstado) {
        try {
            const { data, error } = await supabaseClient
                .from('reservas')
                .update({ estado: nuevoEstado })
                .eq('id', reservaId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error actualizando reserva ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Cancelar reserva
    async cancelar(reservaId) {
        return this.actualizarEstado(reservaId, 'cancelada');
    }
};

// ============================================
// SERVICIO DE EQUIPOS
// ============================================
const EquiposService = {
    // Obtener equipos de un laboratorio
    async obtenerPorLaboratorio(laboratorioId) {
        try {
            const { data, error } = await supabaseClient
                .from('equipos')
                .select('*')
                .eq('laboratorio_id', laboratorioId)
                .order('nombre');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo equipos ESPAM:', error);
            return [];
        }
    },

    // Obtener todos los equipos
    async obtenerTodos() {
        try {
            const { data, error } = await supabaseClient
                .from('equipos')
                .select(`
                    *,
                    laboratorios (nombre, codigo)
                `)
                .order('nombre');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo equipos ESPAM:', error);
            return [];
        }
    },

    // Actualizar estado de equipo
    async actualizarEstado(equipoId, nuevoEstado) {
        try {
            const { data, error } = await supabaseClient
                .from('equipos')
                .update({ estado: nuevoEstado })
                .eq('id', equipoId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error actualizando equipo ESPAM:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================
// SERVICIO DE SUSTANCIAS
// ============================================
const SustanciasService = {
    // Obtener sustancias de un laboratorio
    async obtenerPorLaboratorio(laboratorioId) {
        try {
            const { data, error } = await supabaseClient
                .from('sustancias')
                .select('*')
                .eq('laboratorio_id', laboratorioId)
                .order('nombre');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo sustancias ESPAM:', error);
            return [];
        }
    },

    // Obtener sustancias críticas
    async obtenerCriticas() {
        try {
            const { data, error } = await supabaseClient
                .from('sustancias')
                .select(`
                    *,
                    laboratorios (nombre, codigo)
                `)
                .in('estado', ['critico', 'agotado'])
                .order('estado');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo sustancias críticas ESPAM:', error);
            return [];
        }
    }
};

// ============================================
// SERVICIO DE PRÁCTICAS
// ============================================
const PracticasService = {
    // Crear práctica
    async crear(datosPractica) {
        try {
            const { data, error } = await supabaseClient
                .from('practicas')
                .insert(datosPractica)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error creando práctica ESPAM:', error);
            return { success: false, error: error.message };
        }
    },

    // Obtener prácticas del docente actual
    async obtenerMisPracticas() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabaseClient
                .from('practicas')
                .select(`
                    *,
                    laboratorios (nombre, codigo)
                `)
                .eq('docente_id', user.id)
                .order('fecha_inicio', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo prácticas ESPAM:', error);
            return [];
        }
    },

    // Obtener prácticas del estudiante
    async obtenerPracticasEstudiante() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabaseClient
                .from('practica_estudiantes')
                .select(`
                    practicas (
                        *,
                        laboratorios (nombre, codigo),
                        usuarios!practicas_docente_id_fkey (nombre)
                    )
                `)
                .eq('estudiante_id', user.id);

            if (error) throw error;
            return (data || []).map(pe => pe.practicas);
        } catch (error) {
            console.error('Error obteniendo prácticas de estudiante ESPAM:', error);
            return [];
        }
    }
};

// ============================================
// SERVICIO DE CARRERAS
// ============================================
const CarrerasService = {
    async obtenerTodas() {
        try {
            const { data, error } = await supabaseClient
                .from('carreras')
                .select('*')
                .order('nombre');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error obteniendo carreras ESPAM:', error);
            return [];
        }
    }
};

// ============================================
// SERVICIO DE REPORTES (consultas agregadas)
// ============================================
const ReportesService = {
    // Estadísticas generales
    async obtenerEstadisticas(filtros = {}) {
        try {
            let queryReservas = supabaseClient.from('reservas').select('*', { count: 'exact', head: true });
            if (filtros.fechaDesde) queryReservas = queryReservas.gte('fecha', filtros.fechaDesde);
            if (filtros.fechaHasta) queryReservas = queryReservas.lte('fecha', filtros.fechaHasta);

            const [
                { count: totalReservas },
                { count: pendientes },
                { count: confirmadas },
                { count: completadas },
                { count: totalUsuarios }
            ] = await Promise.all([
                queryReservas,
                supabaseClient.from('reservas').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
                supabaseClient.from('reservas').select('*', { count: 'exact', head: true }).eq('estado', 'confirmada'),
                supabaseClient.from('reservas').select('*', { count: 'exact', head: true }).eq('estado', 'completada'),
                supabaseClient.from('usuarios').select('*', { count: 'exact', head: true })
            ]);

            return {
                totalReservas: totalReservas || 0,
                pendientes: pendientes || 0,
                confirmadas: confirmadas || 0,
                completadas: completadas || 0,
                totalUsuarios: totalUsuarios || 0,
                totalLaboratorios: 4,
                institucion: 'ESPAM MFL'
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas ESPAM:', error);
            return {
                totalReservas: 0, pendientes: 0, confirmadas: 0,
                completadas: 0, totalUsuarios: 0, totalLaboratorios: 4
            };
        }
    },

    // Reservas por laboratorio (para gráficos)
    async reservasPorLaboratorio(filtros = {}) {
        try {
            let query = supabaseClient
                .from('reservas')
                .select(`
                    laboratorio_id,
                    laboratorios (nombre, color_asignado)
                `);

            if (filtros.fechaDesde) query = query.gte('fecha', filtros.fechaDesde);
            if (filtros.fechaHasta) query = query.lte('fecha', filtros.fechaHasta);

            const { data, error } = await query;
            if (error) throw error;

            // Agrupar por laboratorio
            const agrupado = {};
            (data || []).forEach(r => {
                const nombre = r.laboratorios?.nombre || 'Desconocido';
                const color = r.laboratorios?.color_asignado || '#005846';
                if (!agrupado[nombre]) agrupado[nombre] = { count: 0, color };
                agrupado[nombre].count++;
            });

            return agrupado;
        } catch (error) {
            console.error('Error en reporte por laboratorio ESPAM:', error);
            return {};
        }
    },

    // Reservas por carrera
    async reservasPorCarrera(filtros = {}) {
        try {
            let query = supabaseClientClient.from('reservas').select('carrera');

            if (filtros.fechaDesde) query = query.gte('fecha', filtros.fechaDesde);
            if (filtros.fechaHasta) query = query.lte('fecha', filtros.fechaHasta);

            const { data, error } = await query;
            if (error) throw error;

            const agrupado = {};
            (data || []).forEach(r => {
                const carrera = r.carrera || 'Sin carrera';
                if (!agrupado[carrera]) agrupado[carrera] = 0;
                agrupado[carrera]++;
            });

            return agrupado;
        } catch (error) {
            console.error('Error en reporte por carrera ESPAM:', error);
            return {};
        }
    }
};

// ============================================
// HELPER: Compatibilidad con localStorage legacy
// ============================================
const SessionHelper = {
    // Guardar datos de sesión en formato legacy (para compatibilidad con código existente)
    async guardarSesionLegacy(perfil) {
        if (!perfil) return;

        const sessionData = {
            loggedIn: true,
            username: perfil.email ? perfil.email.split('@')[0] : '',
            email: perfil.email,
            nombre: perfil.nombre,
            tipo: perfil.tipo,
            carrera: perfil.carrera_nombre || '',
            laboratorio: perfil.laboratorio_nombre || null,
            codigo: perfil.codigo || '',
            institucion: 'Universidad ESPAM MFL',
            userId: perfil.id,
            timestamp: new Date().getTime()
        };

        localStorage.setItem('espam_userSession', JSON.stringify(sessionData));
        localStorage.setItem('userSession', JSON.stringify(sessionData));
    },

    // Limpiar sesión legacy
    limpiarSesionLegacy() {
        localStorage.removeItem('espam_userSession');
        sessionStorage.removeItem('espam_userSession');
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
    },

    // Obtener sesión desde legacy (fallback)
    obtenerSesionLegacy() {
        return JSON.parse(
            localStorage.getItem('espam_userSession') ||
            sessionStorage.getItem('espam_userSession') ||
            localStorage.getItem('userSession') ||
            sessionStorage.getItem('userSession') ||
            '{}'
        );
    }
};

// ============================================
// EXPORTAR GLOBALMENTE
// ============================================
window.supabaseClient = supabaseClient;
window.AuthService = AuthService;
window.UsuariosService = UsuariosService;
window.LaboratoriosService = LaboratoriosService;
window.ReservasService = ReservasService;
window.EquiposService = EquiposService;
window.SustanciasService = SustanciasService;
window.PracticasService = PracticasService;
window.CarrerasService = CarrerasService;
window.ReportesService = ReportesService;
window.SessionHelper = SessionHelper;

console.log('UDIV ESPAM MFL - Cliente Supabase inicializado correctamente');
