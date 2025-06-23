'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Usuario, PerfilUsuario } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: Usuario | null
  profile: PerfilUsuario | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, nombreCompleto: string) => Promise<boolean>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<PerfilUsuario>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [profile, setProfile] = useState<PerfilUsuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('fiscofast_token')
      if (token) {
        const { data: session } = await supabase
          .from('sesiones_usuario')
          .select('user_id, expires_at')
          .eq('token', token)
          .single()

        if (session && new Date(session.expires_at) > new Date()) {
          await loadUserData(session.user_id)
        } else {
          localStorage.removeItem('fiscofast_token')
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async (userId: string) => {
    try {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      const { data: profileData } = await supabase
        .from('perfiles_usuario')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (userData) {
        setUser(userData)
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simple password check (in real app, use proper hashing)
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single()

      if (!userData || userData.password_hash !== password) {
        toast.error('Credenciales incorrectas')
        return false
      }

      // Create session
      const token = uuidv4()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours

      await supabase
        .from('sesiones_usuario')
        .insert({
          user_id: userData.id,
          token,
          expires_at: expiresAt.toISOString()
        })

      // Update last login
      await supabase
        .from('usuarios')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id)

      localStorage.setItem('fiscofast_token', token)
      await loadUserData(userData.id)
      
      toast.success('Sesión iniciada correctamente')
      return true
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Error al iniciar sesión')
      return false
    }
  }

  const signUp = async (email: string, password: string, nombreCompleto: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        toast.error('El usuario ya existe')
        return false
      }

      // Create user
      const userId = uuidv4()
      const { error: userError } = await supabase
        .from('usuarios')
        .insert({
          id: userId,
          email,
          password_hash: password, // In real app, hash this properly
          created_at: new Date().toISOString()
        })

      if (userError) throw userError

      // Create profile
      const { error: profileError } = await supabase
        .from('perfiles_usuario')
        .insert({
          user_id: userId,
          nombre_completo: nombreCompleto,
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Assign default role
      const { data: roleData } = await supabase
        .from('roles_usuario')
        .select('id')
        .eq('nombre_rol', 'contribuyente')
        .single()

      if (roleData) {
        await supabase
          .from('usuario_roles')
          .insert({
            user_id: userId,
            role_id: roleData.id
          })
      }

      toast.success('Usuario registrado correctamente')
      return true
    } catch (error) {
      console.error('Error signing up:', error)
      toast.error('Error al registrar usuario')
      return false
    }
  }

  const signOut = async () => {
    try {
      const token = localStorage.getItem('fiscofast_token')
      if (token) {
        await supabase
          .from('sesiones_usuario')
          .delete()
          .eq('token', token)
      }
      
      localStorage.removeItem('fiscofast_token')
      setUser(null)
      setProfile(null)
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const updateProfile = async (profileUpdate: Partial<PerfilUsuario>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('perfiles_usuario')
        .update({
          ...profileUpdate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...profileUpdate } : null)
      toast.success('Perfil actualizado correctamente')
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar perfil')
      return false
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}