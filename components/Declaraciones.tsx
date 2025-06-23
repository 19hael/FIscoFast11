'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, DeclaracionFiscal } from '@/lib/supabase'
import { 
  Plus, 
  FileText, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Declaraciones() {
  const { user } = useAuth()
  const [declaraciones, setDeclaraciones] = useState<DeclaracionFiscal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDeclaracion, setSelectedDeclaracion] = useState<DeclaracionFiscal | null>(null)
  const [formData, setFormData] = useState({
    periodo: '',
    ingresos: '',
    gastos: ''
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

      if (error) throw error
      setDeclaraciones(data || [])
    } catch (error) {
      console.error('Error loading declarations:', error)
      toast.error('Error al cargar las declaraciones')
    } finally {
      setLoading(false)
    }
  }

  const calculateTax = (ingresos: number, gastos: number) => {
    const ganancia = ingresos - gastos
    return ganancia > 0 ? ganancia * 0.13 : 0 // 13% tax rate on profit
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const ingresos = parseFloat(formData.ingresos)
    const gastos = parseFloat(formData.gastos)
    const impuestoCalculado = calculateTax(ingresos, gastos)

    try {
      const { error } = await supabase
        .from('declaraciones_fiscales')
        .insert({
          user_id: user.id,
          periodo: formData.periodo,
          ingresos,
          gastos,
          impuesto_calculado: impuestoCalculado,
          fecha_creacion: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Declaración creada exitosamente')
      setShowForm(false)
      setFormData({ periodo: '', ingresos: '', gastos: '' })
      loadDeclaraciones()
    } catch (error) {
      console.error('Error creating declaration:', error)
      toast.error('Error al crear la declaración')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta declaración?')) return

    try {
      const { error } = await supabase
        .from('declaraciones_fiscales')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Declaración eliminada exitosamente')
      loadDeclaraciones()
    } catch (error) {
      console.error('Error deleting declaration:', error)
      toast.error('Error al eliminar la declaración')
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredDeclaraciones = declaraciones.filter(d =>
    d.periodo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Declaraciones Fiscales</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus declaraciones de impuestos de forma sencilla
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Declaración
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por período..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Declarations List */}
      {filteredDeclaraciones.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm ? 'No se encontraron declaraciones' : 'No hay declaraciones'}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchTerm 
              ? 'Intenta con un término de búsqueda diferente'
              : 'Comienza creando tu primera declaración fiscal.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Declaración
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDeclaraciones.map((declaracion) => (
            <div key={declaracion.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Período: {declaracion.periodo}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Creado el {formatDate(declaracion.fecha_creacion)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Ingresos</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(Number(declaracion.ingresos))}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-xs text-gray-500">Gastos</p>
                          <p className="font-semibold text-red-600">
                            {formatCurrency(Number(declaracion.gastos))}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-xs text-gray-500">Impuesto</p>
                          <p className="font-semibold text-yellow-600">
                            {formatCurrency(Number(declaracion.impuesto_calculado))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                    <button
                      onClick={() => setSelectedDeclaracion(declaracion)}
                      className="btn-secondary flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                    <button
                      onClick={() => handleDelete(declaracion.id)}
                      className="btn-danger flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Declaration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Declaración Fiscal</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período Fiscal
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.periodo}
                    onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                    placeholder="Ej: Enero 2024, Q1 2024"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingresos Totales (₡)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.ingresos}
                    onChange={(e) => setFormData({ ...formData, ingresos: e.target.value })}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gastos Deducibles (₡)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.gastos}
                    onChange={(e) => setFormData({ ...formData, gastos: e.target.value })}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>

                {formData.ingresos && formData.gastos && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Cálculo Preliminar</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>Ganancia: {formatCurrency(parseFloat(formData.ingresos) - parseFloat(formData.gastos))}</p>
                      <p className="font-semibold">
                        Impuesto estimado (13%): {formatCurrency(calculateTax(parseFloat(formData.ingresos), parseFloat(formData.gastos)))}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({ periodo: '', ingresos: '', gastos: '' })
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Crear Declaración
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Declaration Detail Modal */}
      {selectedDeclaracion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detalle de Declaración - {selectedDeclaracion.periodo}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Creación</p>
                    <p className="font-medium">{formatDate(selectedDeclaracion.fecha_creacion)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Período</p>
                    <p className="font-medium">{selectedDeclaracion.periodo}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Resumen Financiero</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingresos Totales:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(Number(selectedDeclaracion.ingresos))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gastos Deducibles:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(Number(selectedDeclaracion.gastos))}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Ganancia Neta:</span>
                      <span className="font-semibold">
                        {formatCurrency(Number(selectedDeclaracion.ingresos) - Number(selectedDeclaracion.gastos))}
                      </span>
                    </div>
                    <div className="flex justify-between bg-yellow-50 p-3 rounded-lg">
                      <span className="font-medium text-yellow-800">Impuesto Calculado (13%):</span>
                      <span className="font-bold text-yellow-800">
                        {formatCurrency(Number(selectedDeclaracion.impuesto_calculado))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedDeclaracion(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cerrar
                  </button>
                  <button className="flex-1 btn-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}