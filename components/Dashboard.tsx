'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, DeclaracionFiscal } from '@/lib/supabase'
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardProps {
  onNavigateToDeclaraciones: () => void
}

export default function Dashboard({ onNavigateToDeclaraciones }: DashboardProps) {
  const { user, profile } = useAuth()
  const [declaraciones, setDeclaraciones] = useState<DeclaracionFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDeclaraciones: 0,
    totalIngresos: 0,
    totalGastos: 0,
    totalImpuestos: 0
  })

  useEffect(() => {
    if (user) {
      loadDeclaraciones()
    }
  }, [user])

  const loadDeclaraciones = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('declaraciones_fiscales')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_creacion', { ascending: false })
        .limit(5)

      if (error) throw error

      setDeclaraciones(data || [])
      
      // Calculate stats
      const totalDeclaraciones = data?.length || 0
      const totalIngresos = data?.reduce((sum, d) => sum + Number(d.ingresos), 0) || 0
      const totalGastos = data?.reduce((sum, d) => sum + Number(d.gastos), 0) || 0
      const totalImpuestos = data?.reduce((sum, d) => sum + Number(d.impuesto_calculado), 0) || 0

      setStats({
        totalDeclaraciones,
        totalIngresos,
        totalGastos,
        totalImpuestos
      })
    } catch (error) {
      console.error('Error loading declarations:', error)
      toast.error('Error al cargar las declaraciones')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {profile?.nombre_completo || user?.email}!
        </h1>
        <p className="mt-2 text-gray-600">
          Aquí tienes un resumen de tu actividad fiscal reciente.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Declaraciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeclaraciones}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalIngresos)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-red-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Gastos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalGastos)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Impuestos Calculados</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalImpuestos)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Declarations */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Declaraciones Recientes</h2>
                <button
                  onClick={onNavigateToDeclaraciones}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todas
                </button>
              </div>
            </div>
            <div className="card-body">
              {declaraciones.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay declaraciones</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando tu primera declaración fiscal.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={onNavigateToDeclaraciones}
                      className="btn-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Declaración
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {declaraciones.map((declaracion) => (
                    <div key={declaracion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Período: {declaracion.periodo}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(declaracion.fecha_creacion)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(Number(declaracion.impuesto_calculado))}
                          </p>
                          <p className="text-xs text-gray-500">Impuesto calculado</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Ingresos: </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(Number(declaracion.ingresos))}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Gastos: </span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(Number(declaracion.gastos))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="card-body space-y-3">
              <button
                onClick={onNavigateToDeclaraciones}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Declaración
              </button>
              <button
                onClick={onNavigateToDeclaraciones}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver Historial
              </button>
            </div>
          </div>

          {/* Tax Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Información Fiscal</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cálculo Simplificado</p>
                  <p className="text-xs text-gray-500">
                    Los impuestos se calculan con una tasa fija del 13% sobre la ganancia neta.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Demo Educativa</p>
                  <p className="text-xs text-gray-500">
                    Esta aplicación es para fines demostrativos y educativos.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Períodos Fiscales</p>
                  <p className="text-xs text-gray-500">
                    Puedes crear declaraciones para diferentes períodos mensuales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}