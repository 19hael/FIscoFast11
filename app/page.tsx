'use client'

import React, { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import AuthForm from '@/components/AuthForm'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import Declaraciones from '@/components/Declaraciones'
import Perfil from '@/components/Perfil'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'declaraciones' | 'perfil'>('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando FiscoFast...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const handleNavigate = (page: 'dashboard' | 'declaraciones' | 'perfil') => {
    setCurrentPage(page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToDeclaraciones={() => setCurrentPage('declaraciones')} />
      case 'declaraciones':
        return <Declaraciones />
      case 'perfil':
        return <Perfil />
      default:
        return <Dashboard onNavigateToDeclaraciones={() => setCurrentPage('declaraciones')} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}