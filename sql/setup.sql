-- ============================================================
-- UDIV ESPAM MFL - Setup completo de base de datos Supabase
-- Ejecutar este script en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================
-- 1. TABLA: carreras
-- ============================================
CREATE TABLE IF NOT EXISTS carreras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  facultad TEXT,
  duracion TEXT,
  coordinador TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. TABLA: laboratorios
-- ============================================
CREATE TABLE IF NOT EXISTS laboratorios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  capacidad INT DEFAULT 0,
  horario JSONB,
  tecnico TEXT,
  contacto TEXT,
  ubicacion TEXT,
  equipos_principales TEXT[],
  color_asignado TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. TABLA: usuarios (perfiles vinculados a auth)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('tecnico', 'docente', 'estudiante', 'admin')),
  codigo TEXT UNIQUE,
  carrera_id UUID REFERENCES carreras(id),
  carrera_nombre TEXT,
  semestre TEXT,
  facultad TEXT,
  laboratorio_id UUID REFERENCES laboratorios(id),
  laboratorio_nombre TEXT,
  contacto TEXT,
  cedula TEXT,
  telefono TEXT,
  sexo TEXT,
  fecha_nacimiento DATE,
  discapacidad TEXT DEFAULT 'Ninguna',
  email_personal TEXT,
  institucion TEXT DEFAULT 'Universidad ESPAM MFL',
  estado TEXT DEFAULT 'activo',
  ultimo_acceso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. TABLA: equipos
-- ============================================
CREATE TABLE IF NOT EXISTS equipos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  laboratorio_id UUID REFERENCES laboratorios(id) ON DELETE CASCADE,
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'en_uso', 'mantenimiento')),
  cantidad INT DEFAULT 1,
  especificaciones TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. TABLA: sustancias
-- ============================================
CREATE TABLE IF NOT EXISTS sustancias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  laboratorio_id UUID REFERENCES laboratorios(id) ON DELETE CASCADE,
  cantidad NUMERIC DEFAULT 0,
  unidad TEXT,
  estado TEXT DEFAULT 'normal' CHECK (estado IN ('normal', 'critico', 'agotado')),
  peligrosidad TEXT DEFAULT 'bajo' CHECK (peligrosidad IN ('bajo', 'medio', 'alto')),
  ubicacion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. TABLA: reservas
-- ============================================
CREATE TABLE IF NOT EXISTS reservas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laboratorio_id UUID REFERENCES laboratorios(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  docente TEXT,
  carrera TEXT,
  tema TEXT,
  descripcion TEXT,
  estado TEXT DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'en_curso', 'completada', 'rechazada')),
  estudiantes_count INT DEFAULT 0,
  participantes TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. TABLAS PUENTE: reserva <-> equipos/sustancias
-- ============================================
CREATE TABLE IF NOT EXISTS reserva_equipos (
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  PRIMARY KEY (reserva_id, equipo_id)
);

CREATE TABLE IF NOT EXISTS reserva_sustancias (
  reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
  sustancia_id UUID REFERENCES sustancias(id) ON DELETE CASCADE,
  cantidad_solicitada NUMERIC DEFAULT 0,
  PRIMARY KEY (reserva_id, sustancia_id)
);

-- ============================================
-- 8. TABLA: practicas
-- ============================================
CREATE TABLE IF NOT EXISTS practicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  carrera_id UUID REFERENCES carreras(id),
  semestre TEXT,
  laboratorio_id UUID REFERENCES laboratorios(id),
  docente_id UUID REFERENCES usuarios(id),
  estado TEXT DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'en_curso', 'completada', 'evaluada')),
  fecha_inicio DATE,
  fecha_fin DATE,
  hoja_guia JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 9. TABLA PUENTE: practica <-> estudiantes
-- ============================================
CREATE TABLE IF NOT EXISTS practica_estudiantes (
  practica_id UUID REFERENCES practicas(id) ON DELETE CASCADE,
  estudiante_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  PRIMARY KEY (practica_id, estudiante_id)
);

-- ============================================
-- 10. HABILITAR ROW LEVEL SECURITY
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE practicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE carreras ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserva_sustancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE practica_estudiantes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. FUNCION HELPER: obtener tipo de usuario
-- ============================================
CREATE OR REPLACE FUNCTION get_user_tipo()
RETURNS TEXT AS $$
  SELECT tipo FROM usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 12. POLITICAS RLS
-- ============================================

-- CARRERAS: todos pueden leer
CREATE POLICY "carreras_lectura_publica" ON carreras
  FOR SELECT USING (true);

CREATE POLICY "carreras_gestion_admin" ON carreras
  FOR ALL USING (get_user_tipo() = 'admin');

-- LABORATORIOS: todos leen, admin/tecnico gestionan
CREATE POLICY "labs_lectura_publica" ON laboratorios
  FOR SELECT USING (true);

CREATE POLICY "labs_gestion" ON laboratorios
  FOR ALL USING (get_user_tipo() IN ('admin', 'tecnico'));

-- USUARIOS: ver propio perfil + admin/tecnico ven todos
CREATE POLICY "usuarios_ver_propio" ON usuarios
  FOR SELECT USING (
    id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
  );

CREATE POLICY "usuarios_insertar_propio" ON usuarios
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "usuarios_editar_propio" ON usuarios
  FOR UPDATE USING (
    id = auth.uid()
    OR get_user_tipo() = 'admin'
  );

CREATE POLICY "usuarios_admin_delete" ON usuarios
  FOR DELETE USING (get_user_tipo() = 'admin');

-- RESERVAS
CREATE POLICY "reservas_lectura" ON reservas
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
  );

CREATE POLICY "reservas_crear" ON reservas
  FOR INSERT WITH CHECK (
    usuario_id = auth.uid()
    AND get_user_tipo() IN ('docente', 'admin', 'tecnico')
  );

CREATE POLICY "reservas_modificar" ON reservas
  FOR UPDATE USING (
    usuario_id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
  );

CREATE POLICY "reservas_eliminar" ON reservas
  FOR DELETE USING (
    usuario_id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
  );

-- EQUIPOS
CREATE POLICY "equipos_lectura" ON equipos
  FOR SELECT USING (true);

CREATE POLICY "equipos_gestion" ON equipos
  FOR ALL USING (get_user_tipo() IN ('admin', 'tecnico'));

-- SUSTANCIAS
CREATE POLICY "sustancias_lectura" ON sustancias
  FOR SELECT USING (true);

CREATE POLICY "sustancias_gestion" ON sustancias
  FOR ALL USING (get_user_tipo() IN ('admin', 'tecnico'));

-- PRACTICAS
CREATE POLICY "practicas_lectura" ON practicas
  FOR SELECT USING (
    docente_id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
    OR EXISTS (
      SELECT 1 FROM practica_estudiantes
      WHERE practica_id = practicas.id
      AND estudiante_id = auth.uid()
    )
  );

CREATE POLICY "practicas_crear" ON practicas
  FOR INSERT WITH CHECK (
    get_user_tipo() IN ('docente', 'admin')
  );

CREATE POLICY "practicas_modificar" ON practicas
  FOR UPDATE USING (
    docente_id = auth.uid()
    OR get_user_tipo() IN ('admin', 'tecnico')
  );

-- TABLAS PUENTE
CREATE POLICY "re_lectura" ON reserva_equipos FOR SELECT USING (true);
CREATE POLICY "re_gestion" ON reserva_equipos FOR ALL USING (get_user_tipo() IN ('admin', 'tecnico', 'docente'));

CREATE POLICY "rs_lectura" ON reserva_sustancias FOR SELECT USING (true);
CREATE POLICY "rs_gestion" ON reserva_sustancias FOR ALL USING (get_user_tipo() IN ('admin', 'tecnico', 'docente'));

CREATE POLICY "pe_lectura" ON practica_estudiantes FOR SELECT USING (true);
CREATE POLICY "pe_gestion" ON practica_estudiantes FOR ALL USING (get_user_tipo() IN ('admin', 'docente'));

-- ============================================
-- 13. DATOS SEMILLA: Carreras
-- ============================================
INSERT INTO carreras (nombre, facultad, duracion, coordinador) VALUES
  ('Ingeniería de la Producción', 'Ciencias Administrativas y Económicas', '10 semestres', 'Ing. Carlos Mendoza'),
  ('Ingeniería en Alimentos', 'Ciencias Agropecuarias', '10 semestres', 'Ing. María Torres'),
  ('Biotecnología', 'Ciencias de la Vida', '10 semestres', 'Dra. Laura Castro'),
  ('Ingeniería Ambiental', 'Ciencias de la Vida', '10 semestres', 'Ing. Pablo Rojas'),
  ('Ingeniería Agroindustrial', 'Ciencias Agropecuarias', '10 semestres', 'Ing. Ricardo Salazar'),
  ('Administración de Empresas', 'Ciencias Administrativas y Económicas', '8 semestres', 'Mg. Sofía Villacís'),
  ('Contabilidad y Auditoría', 'Ciencias Administrativas y Económicas', '8 semestres', 'CPA. Roberto Zambrano'),
  ('Informática', 'Ciencias de la Computación', '8 semestres', 'Ing. Daniel López'),
  ('Turismo', 'Ciencias Administrativas y Económicas', '8 semestres', 'Mg. Patricia Alvarado');

-- ============================================
-- 14. DATOS SEMILLA: Laboratorios
-- ============================================
INSERT INTO laboratorios (codigo, nombre, descripcion, capacidad, ubicacion, color_asignado, tecnico, contacto, equipos_principales, horario) VALUES
  ('bromatologia', 'Laboratorio de Bromatología ESPAM', 'Análisis de alimentos, control de calidad y seguridad alimentaria', 25, 'Edificio B, Sala 201', '#005846', 'Ing. Wellington Espinoza', '05-301-5000 ext. 123',
   ARRAY['Microscopios', 'Balanzas analíticas', 'Estufas', 'Centrífugas', 'pH-metros'],
   '{"lunes":{"apertura":"08:00","cierre":"18:00"},"martes":{"apertura":"08:00","cierre":"18:00"},"miercoles":{"apertura":"08:00","cierre":"18:00"},"jueves":{"apertura":"08:00","cierre":"18:00"},"viernes":{"apertura":"08:00","cierre":"18:00"},"sabado":{"apertura":"09:00","cierre":"13:00"}}'::jsonb),

  ('biologia', 'Laboratorio de Biología ESPAM', 'Investigación biológica, microbiología y biotecnología', 20, 'Edificio C, Sala 105', '#39b54a', 'Lic. Ana Rodríguez', '05-301-5000 ext. 124',
   ARRAY['Microscopios electrónicos', 'Autoclaves', 'Incubadoras', 'Campanas de flujo laminar'],
   '{"lunes":{"apertura":"08:00","cierre":"17:00"},"martes":{"apertura":"08:00","cierre":"17:00"},"miercoles":{"apertura":"08:00","cierre":"17:00"},"jueves":{"apertura":"08:00","cierre":"17:00"},"viernes":{"apertura":"08:00","cierre":"17:00"}}'::jsonb),

  ('produccion', 'Laboratorio de Producción ESPAM', 'Procesos de producción industrial y manufactura', 30, 'Edificio D, Sala 301', '#08b89d', 'Ing. Roberto Martínez', '05-301-5000 ext. 125',
   ARRAY['Máquinas CNC', 'Impresoras 3D', 'Equipo de soldadura', 'Tornos', 'Fresadoras'],
   '{"lunes":{"apertura":"07:00","cierre":"19:00"},"martes":{"apertura":"07:00","cierre":"19:00"},"miercoles":{"apertura":"07:00","cierre":"19:00"},"jueves":{"apertura":"07:00","cierre":"19:00"},"viernes":{"apertura":"07:00","cierre":"19:00"},"sabado":{"apertura":"08:00","cierre":"14:00"}}'::jsonb),

  ('quimica', 'Laboratorio de Química ESPAM', 'Análisis químicos y experimentación', 15, 'Edificio A, Sala 102', '#cbdb2a', 'Q.F. Laura González', '05-301-5000 ext. 126',
   ARRAY['Espectrofotómetro', 'HPLC', 'Campanas de extracción', 'Balanzas analíticas'],
   '{"lunes":{"apertura":"08:00","cierre":"17:00"},"martes":{"apertura":"08:00","cierre":"17:00"},"miercoles":{"apertura":"08:00","cierre":"17:00"},"jueves":{"apertura":"08:00","cierre":"17:00"},"viernes":{"apertura":"08:00","cierre":"17:00"}}'::jsonb);

-- ============================================
-- 15. DATOS SEMILLA: Equipos
-- ============================================
INSERT INTO equipos (nombre, laboratorio_id, estado, cantidad, especificaciones) VALUES
  ('Microscopio Olympus CX23', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 'disponible', 10, 'Microscopio binocular con iluminación LED'),
  ('Balanza Analítica Mettler', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 'disponible', 5, 'Precisión 0.0001g'),
  ('Estufa de Secado', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 'disponible', 3, 'Rango 50-300°C'),
  ('Centrífuga Eppendorf', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 'disponible', 4, '14000 RPM'),
  ('Autoclave Vertical', (SELECT id FROM laboratorios WHERE codigo = 'biologia'), 'disponible', 2, '121°C, 15 PSI'),
  ('Incubadora Thermo', (SELECT id FROM laboratorios WHERE codigo = 'biologia'), 'disponible', 3, 'Rango 20-60°C'),
  ('Campana de Flujo Laminar', (SELECT id FROM laboratorios WHERE codigo = 'biologia'), 'disponible', 2, 'Clase II Tipo A2'),
  ('Impresora 3D Prusa', (SELECT id FROM laboratorios WHERE codigo = 'produccion'), 'disponible', 4, 'FDM, volumen 250x210x210mm'),
  ('Espectrofotómetro UV-Vis', (SELECT id FROM laboratorios WHERE codigo = 'quimica'), 'disponible', 2, 'Rango 190-1100nm'),
  ('HPLC Agilent 1260', (SELECT id FROM laboratorios WHERE codigo = 'quimica'), 'mantenimiento', 1, 'Cromatografía líquida de alta resolución');

-- ============================================
-- 16. DATOS SEMILLA: Sustancias
-- ============================================
INSERT INTO sustancias (nombre, laboratorio_id, cantidad, unidad, estado, peligrosidad, ubicacion) VALUES
  ('Ácido Sulfúrico H2SO4', (SELECT id FROM laboratorios WHERE codigo = 'quimica'), 5000, 'ml', 'normal', 'alto', 'Armario de ácidos'),
  ('Hidróxido de Sodio NaOH', (SELECT id FROM laboratorios WHERE codigo = 'quimica'), 2000, 'g', 'normal', 'medio', 'Estante B2'),
  ('Etanol 96%', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 10000, 'ml', 'normal', 'medio', 'Armario de solventes'),
  ('Agar Bacteriológico', (SELECT id FROM laboratorios WHERE codigo = 'biologia'), 500, 'g', 'normal', 'bajo', 'Refrigerador 1'),
  ('Reactivo de Fehling A', (SELECT id FROM laboratorios WHERE codigo = 'bromatologia'), 200, 'ml', 'critico', 'medio', 'Estante A1'),
  ('Fenolftaleína', (SELECT id FROM laboratorios WHERE codigo = 'quimica'), 100, 'ml', 'normal', 'bajo', 'Estante C3');

-- ============================================
-- 17. TRIGGER: actualizar updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_reservas_updated_at BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_practicas_updated_at BEFORE UPDATE ON practicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
