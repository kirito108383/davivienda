# Davivienda Móvil - Banking Application

Aplicación de banca móvil completa con funcionalidades de cuenta, transferencias, pagos y administración.

## 🚀 Despliegue Rápido

### Opción 1: Vercel + Neon (Recomendado)

1. **Crear cuenta en Neon** (Base de datos gratuita):
   - Ve a [neon.tech](https://neon.tech)
   - Regístrate y crea un nuevo proyecto
   - Copia la `DATABASE_URL` desde el dashboard

2. **Desplegar en Vercel**:
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel

   # Login en Vercel
   vercel login

   # Desplegar
   vercel --prod

   # Configurar variables de entorno en Vercel:
   # DATABASE_URL = postgresql://... (de Neon)
   # NODE_ENV = production
   ```

### Opción 2: Railway (Todo integrado)

1. **Crear cuenta en Railway** (gratuito):
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Desplegar**:
   ```bash
   # Conectar repositorio a Railway
   # Railway detectará automáticamente PostgreSQL y Node.js
   # La app se desplegará automáticamente
   ```

### Opción 3: Render

1. **Crear cuenta en Render**:
   - Ve a [render.com](https://render.com)
   - Crea un Web Service conectado a este repo

2. **Configurar**:
   - Runtime: Node.js
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Agregar variable: `DATABASE_URL` (de PostgreSQL en Render)

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Drizzle ORM. Para inicializar:

```bash
# Instalar dependencias
npm install

# Configurar DATABASE_URL en .env
echo "DATABASE_URL=tu_url_de_postgresql" > .env

# Ejecutar migraciones
npx drizzle-kit push
```

## 🔧 Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
NODE_ENV=production
```

## 🌐 URLs de Producción

Después del despliegue, tendrás URLs como:
- Vercel: `https://tu-proyecto.vercel.app`
- Railway: `https://tu-proyecto.up.railway.app`
- Render: `https://tu-proyecto.onrender.com`

## 📱 Características

- ✅ Autenticación completa
- ✅ Gestión de cuentas y tarjetas
- ✅ Transferencias con QR
- ✅ Pagos de servicios
- ✅ Panel administrativo
- ✅ Actualización en tiempo real (WebSocket)
- ✅ PWA (instalable como app)
- ✅ Diseño móvil-first

## 🔐 Credenciales por Defecto

**Usuario Admin:**
- Usuario: `admin`
- Contraseña: `admin123`

**Usuario Regular:**
- Cédula: `1234567890`
- Contraseña: `user123`

## 🚨 Importante

1. **Cambia las contraseñas por defecto** después del primer login
2. **Configura Stripe** para pagos reales (opcional)
3. **Actualiza la URL de soporte** en la configuración

## 📞 Soporte

Para soporte técnico, contacta al administrador del sistema.