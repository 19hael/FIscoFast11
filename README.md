# FiscoFast - Gestión Fiscal Simplificada

Una aplicación web moderna para la gestión fiscal simplificada de empresas y emprendedores en Costa Rica. Desarrollada para demostración en expotécnica.

## 🚀 Características

- **Interfaz intuitiva y responsive** - Funciona perfectamente en dispositivos móviles y de escritorio
- **Gestión de declaraciones fiscales** - Crea, visualiza y gestiona declaraciones de impuestos
- **Cálculo automático de impuestos** - Sistema simplificado con tasa fija del 13%
- **Historial completo** - Visualiza todas tus declaraciones pasadas
- **Gestión de usuarios** - Sistema de autenticación y perfiles de usuario
- **Base de datos Supabase** - Almacenamiento seguro y escalable
- **Diseño moderno** - Interfaz atractiva con Tailwind CSS y iconos Lucide
- **Notificaciones** - Mensajes de éxito, error e información en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast
- **Autenticación**: Sistema personalizado con Supabase

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (para la base de datos)

## 🎯 Funcionalidades Principales

### Dashboard
- Resumen de actividad fiscal
- Estadísticas de ingresos, gastos e impuestos
- Declaraciones recientes
- Acciones rápidas

### Gestión de Declaraciones
- Crear nuevas declaraciones fiscales
- Cálculo automático de impuestos (13% sobre ganancia neta)
- Visualizar historial completo
- Búsqueda y filtrado
- Detalles completos de cada declaración

### Perfil de Usuario
- Información personal y de negocio
- Datos fiscales (identificación, tipo de negocio)
- Edición de perfil
- Estadísticas de cuenta

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Políticas de acceso por usuario
- Sesiones con tokens únicos y expiración
- Validación de datos en frontend y backend

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- Dispositivos móviles (320px+)
- Tablets (768px+)
- Escritorio (1024px+)

## 🎨 Diseño

- **Colores**: Paleta azul profesional con acentos verdes y rojos
- **Tipografía**: Inter (sistema de fuentes moderno)
- **Componentes**: Cards, botones y formularios consistentes
- **Iconografía**: Lucide React para iconos modernos y claros

## 🧪 Datos de Prueba

La aplicación incluye datos de demostración:
- Usuario demo con declaraciones de ejemplo
- Diferentes períodos fiscales (mensual y trimestral)
- Variedad de montos para mostrar cálculos

## 🚀 Despliegue

### Despliegue en Netlify

1. **Preparación**
   - Asegúrate de tener tu proyecto en un repositorio Git (GitHub, GitLab, etc.)
   - Configura tu base de datos Supabase

2. **Configuración en Netlify**
   - Ve a [Netlify](https://netlify.com) y conecta tu repositorio
   - Las configuraciones de build ya están en `netlify.toml`
   - Agrega las variables de entorno en Netlify:
     - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase

3. **Build local (opcional)**
   ```bash
   npm run build
   ```

### Configuración de Variables de Entorno en Netlify

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a "Site settings" > "Environment variables"
4. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Notas Importantes

- **Solo para demostración**: Esta aplicación es para fines educativos y de demostración
- **Cálculos simplificados**: Los impuestos se calculan con una tasa fija del 13%
- **Sin integraciones reales**: No se conecta con APIs gubernamentales reales
- **Seguridad básica**: Implementa autenticación básica, no apta para producción real

## 🤝 Contribución

Este es un proyecto de demostración para expotécnica. Para sugerencias o mejoras:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es para fines educativos y de demostración.

## 📞 Soporte

Para preguntas sobre la implementación o demostración, contacta al equipo de desarrollo.

---

**FiscoFast** - Simplificando la gestión fiscal para Costa Rica 🇨🇷
