'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  CreditCard,
  Save,
  Edit,
  Shield
} from 'lucide-react'

export default function Perfil() {
  const { user, profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_completo: profile?.nombre_completo || '',
    tipo_negocio: profile?.tipo_negocio || '',
    identificacion_fiscal: profile?.identificacion_fiscal || '',
    telefono: profile?.telefono || '',
    direccion: profile?.direccion || '',
    fecha_nacimiento: profile?.fecha_nacimiento || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await updateProfile(formData)
      if (success) {
        setIsEditing(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificado'
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-gray-600">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body text-center">
              <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.nombre_completo || 'Usuario'}
              </h2>
              <p className="text-gray-600 mt-1">
                {profile?.tipo_negocio || 'Contribuyente'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Miembro desde {new Date(user?.created_at || '').toLocaleDateString('es-CR', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Cuenta Verificada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Último acceso:</span>
                  <span className="text-sm font-medium">
                    {user?.last_login 
                      ? new Date(user.last_login).toLocaleDateString('es-CR')
                      : 'Primer acceso'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="nombre_completo"
                          value={formData.nombre_completo}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Ingrese su nombre completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Negocio
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          name="tipo_negocio"
                          value={formData.tipo_negocio}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                        >
                          <option value="">Seleccione tipo de negocio</option>
                          <option value="Persona Física">Persona Física</option>
                          <option value="Sociedad Anónima">Sociedad Anónima</option>
                          <option value="Sociedad de Responsabilidad Limitada">SRL</option>
                          <option value="Empresa Individual">Empresa Individual</option>
                          <option value="Cooperativa">Cooperativa</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identificación Fiscal
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="identificacion_fiscal"
                          value={formData.identificacion_fiscal}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Ej: 3-101-123456"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Ej: +506 8888-8888"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Dirección completa"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          name="fecha_nacimiento"
                          value={formData.fecha_nacimiento}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Nombre Completo</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {profile?.nombre_completo || 'No especificado'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Correo Electrónico</span>
                      </div>
                      <p className="text-gray-900 ml-8">{user?.email}</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Tipo de Negocio</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {profile?.tipo_negocio || 'No especificado'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Identificación Fiscal</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {profile?.identificacion_fiscal || 'No especificado'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Teléfono</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {profile?.telefono || 'No especificado'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Fecha de Nacimiento</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {formatDate(profile?.fecha_nacimiento || '')}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Dirección</span>
                      </div>
                      <p className="text-gray-900 ml-8">
                        {profile?.direccion || 'No especificado'}
                      </p>
                    </div>
                  </div>

                  {(!profile?.nombre_completo || !profile?.tipo_negocio) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Perfil Incompleto
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Complete su información personal para una mejor experiencia en FiscoFast.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}