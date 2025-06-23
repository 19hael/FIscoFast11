# 🚀 Guía de Despliegue en Netlify - FiscoFast

## ✅ Pasos para Subir a Netlify

### 1. Preparar el Repositorio Git

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - FiscoFast app"

# Conectar con tu repositorio remoto (GitHub, GitLab, etc.)
git remote add origin https://github.com/tu-usuario/fiscofast.git
git push -u origin main
```

### 2. Configurar Supabase

1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. En el SQL Editor, ejecuta el código de `database/schema.sql`
4. Opcionalmente ejecuta `database/demo-data.sql` para datos de prueba
5. Ve a Settings > API y copia:
   - **URL del proyecto**
   - **Clave anónima (anon key)**

### 3. Desplegar en Netlify

1. **Ir a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Inicia sesión o crea una cuenta

2. **Conectar Repositorio**
   - Click en "New site from Git"
   - Conecta tu cuenta de GitHub/GitLab
   - Selecciona el repositorio de FiscoFast

3. **Configuración de Build**
   - Netlify detectará automáticamente la configuración desde `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `out`

4. **Variables de Entorno**
   - Ve a Site settings > Environment variables
   - Agrega estas variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = tu_url_de_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_clave_anonima
     ```

5. **Deploy**
   - Click en "Deploy site"
   - Espera a que termine el build (2-5 minutos)

### 4. Verificar el Despliegue

1. **URL de la App**
   - Netlify te dará una URL como: `https://amazing-name-123456.netlify.app`
   - Puedes cambiar el nombre en Site settings

2. **Probar Funcionalidades**
   - Registro de usuarios
   - Login con datos demo: `demo@fiscofast.com` / `demo123`
   - Crear declaraciones fiscales
   - Ver dashboard

## 🔧 Solución de Problemas

### Error de Build
```bash
# Si hay errores de build, verifica:
npm run build
```

### Error de Supabase
- Verifica que las variables de entorno estén correctas
- Asegúrate de que las políticas RLS estén configuradas
- Revisa que el SQL schema se haya ejecutado correctamente

### Error 404 en Rutas
- El archivo `netlify.toml` ya incluye las redirecciones necesarias

## 📱 Resultado Final

Tu aplicación estará disponible en:
- **URL de Netlify**: `https://tu-sitio.netlify.app`
- **Funcional en móviles y escritorio**
- **Datos persistentes en Supabase**
- **Actualizaciones automáticas** cuando hagas push al repositorio

## 🎯 Para la Expotécnica

- **URL fácil de compartir**
- **Acceso desde cualquier dispositivo**
- **Sin necesidad de instalación**
- **Demostración profesional**

¡Tu aplicación FiscoFast estará lista para impresionar en la expotécnica! 🇨🇷