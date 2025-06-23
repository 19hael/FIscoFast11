-- Demo data for FiscoFast application
-- This script creates sample users and declarations for demonstration purposes

-- Insert demo user
INSERT INTO public.usuarios (id, email, password_hash, created_at, last_login) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@fiscofast.com', 'demo123', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert demo user profile
INSERT INTO public.perfiles_usuario (user_id, nombre_completo, tipo_negocio, identificacion_fiscal, telefono, direccion, fecha_nacimiento, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Juan Carlos Rodríguez', 'Persona Física', '1-1234-5678', '+506 8888-8888', 'San José, Costa Rica', '1985-03-15', NOW())
ON CONFLICT (user_id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  tipo_negocio = EXCLUDED.tipo_negocio,
  identificacion_fiscal = EXCLUDED.identificacion_fiscal,
  telefono = EXCLUDED.telefono,
  direccion = EXCLUDED.direccion,
  fecha_nacimiento = EXCLUDED.fecha_nacimiento,
  updated_at = NOW();

-- Assign role to demo user
INSERT INTO public.usuario_roles (user_id, role_id)
SELECT '550e8400-e29b-41d4-a716-446655440000', id
FROM public.roles_usuario
WHERE nombre_rol = 'contribuyente'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert sample declarations
INSERT INTO public.declaraciones_fiscales (id, user_id, periodo, ingresos, gastos, impuesto_calculado, fecha_creacion) VALUES
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 'Enero 2024', 2500000, 800000, 221000, '2024-02-01 10:00:00+00'),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 'Febrero 2024', 3200000, 950000, 292500, '2024-03-01 10:00:00+00'),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 'Marzo 2024', 2800000, 750000, 266500, '2024-04-01 10:00:00+00'),
(uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', 'Q1 2024', 8500000, 2500000, 780000, '2024-04-15 10:00:00+00')
ON CONFLICT DO NOTHING;

-- Insert additional demo user for testing
INSERT INTO public.usuarios (id, email, password_hash, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'maria@ejemplo.com', 'password123', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.perfiles_usuario (user_id, nombre_completo, tipo_negocio, identificacion_fiscal, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'María González Pérez', 'Sociedad Anónima', '3-101-123456', NOW())
ON CONFLICT (user_id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  tipo_negocio = EXCLUDED.tipo_negocio,
  identificacion_fiscal = EXCLUDED.identificacion_fiscal,
  updated_at = NOW();

INSERT INTO public.usuario_roles (user_id, role_id)
SELECT '550e8400-e29b-41d4-a716-446655440001', id
FROM public.roles_usuario
WHERE nombre_rol = 'contribuyente'
ON CONFLICT (user_id, role_id) DO NOTHING;