import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjktqhdudpuntwmqmlrx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3RxaGR1ZHB1bnR3bXFtbHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE0NzQsImV4cCI6MjA1MDU0NzQ3NH0.example'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Usuario {
  id: string
  email: string
  password_hash: string
  created_at: string
  last_login?: string
}

export interface PerfilUsuario {
  user_id: string
  nombre_completo: string
  tipo_negocio?: string
  identificacion_fiscal?: string
  telefono?: string
  direccion?: string
  fecha_nacimiento?: string
  updated_at: string
}

export interface DeclaracionFiscal {
  id: string
  user_id: string
  periodo: string
  ingresos: number
  gastos: number
  impuesto_calculado: number
  fecha_creacion: string
}