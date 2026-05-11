# Davivienda Móvil - Banking Application

Aplicación de banca móvil completa con funcionalidades de cuenta, transferencias, pagos y administración.

## 🎉 ¡YA CONFIGURADO PARA DESPLIEGUE!

Tu aplicación ya tiene:
- ✅ Base de datos Neon configurada y funcionando
- ✅ Datos de prueba inicializados
- ✅ Build de producción listo
- ✅ WebSocket para actualizaciones en tiempo real

## 🚀 Despliegue Inmediato

### Opción 1: Vercel (Recomendado - 1 comando)

```bash
# Ejecutar despliegue automático
./deploy-vercel.sh
```

Esto hará todo automáticamente:
- Verificará Vercel CLI
- Iniciará sesión si es necesario
- Desplegará la aplicación
- Configurará la base de datos Neon

### Opción 2: Despliegue Manual

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel --prod
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

## 🔐 Credenciales de Acceso

**IMPORTANTE**: Cambia estas contraseñas inmediatamente después del primer login.

### Administrador del Sistema
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Acceso**: Panel administrativo completo

### Usuario de Prueba
- **Usuario**: `1234567890`
- **Contraseña**: `user123`
- **Saldo inicial**: $1,500,000 COP

## 🚨 Importante

1. **Cambia las contraseñas por defecto** después del primer login
2. **Configura Stripe** para pagos reales (opcional)
3. **Actualiza la URL de soporte** en la configuración

## 📞 Soporte

Para soporte técnico, contacta al administrador del sistema.