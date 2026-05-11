import { db } from './db';
import { users, accounts, transactions, services, appSettings } from './schema';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Iniciando seeding de base de datos...');

  try {
    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      username: 'admin',
      password: adminPassword,
      name: 'Administrador',
      email: 'admin@davivienda.com',
      document: '1234567890',
      phone: '+573208646620',
      isAdmin: 1,
    }).onConflictDoNothing();

    // Crear usuario de prueba
    const userPassword = await bcrypt.hash('user123', 10);
    await db.insert(users).values({
      username: '1234567890',
      password: userPassword,
      name: 'Usuario de Prueba',
      email: 'usuario@ejemplo.com',
      document: '1234567890',
      phone: '+573001234567',
      isAdmin: 0,
    }).onConflictDoNothing();

    // Crear cuenta para el usuario de prueba
    await db.insert(accounts).values({
      userId: 2, // ID del usuario de prueba
      accountNumber: '1234567890123456',
      accountType: 'Ahorros',
      balance: 1500000.00,
      status: 'active',
      currency: 'COP',
    }).onConflictDoNothing();

    // Crear servicios de pago
    await db.insert(services).values([
      { name: 'Electricidad', category: 'electricity', description: 'Pago de servicios eléctricos' },
      { name: 'Agua', category: 'water', description: 'Pago de servicios de acueducto' },
      { name: 'Teléfono', category: 'phone', description: 'Pago de servicios telefónicos' },
      { name: 'Internet', category: 'internet', description: 'Pago de servicios de internet' },
    ]).onConflictDoNothing();

    // Crear configuraciones de aplicación
    await db.insert(appSettings).values([
      { key: 'support_phone', value: '+573208646620', description: 'Número de teléfono de soporte' },
      { key: 'mobile_app_enabled', value: 'true', description: 'Habilitar instalación PWA' },
      { key: 'checkout_brand_name', value: 'Davivienda', description: 'Nombre de marca para checkout' },
      { key: 'checkout_brand_tagline', value: 'Banca en Línea Segura', description: 'Tagline para checkout' },
      { key: 'checkout_owner_name', value: 'Davivienda', description: 'Nombre del propietario' },
    ]).onConflictDoNothing();

    // Crear algunas transacciones de ejemplo
    await db.insert(transactions).values([
      {
        accountId: 1,
        amount: 500000.00,
        description: 'Depósito inicial',
        type: 'deposit',
        date: new Date('2024-01-15'),
      },
      {
        accountId: 1,
        amount: -250000.00,
        description: 'Pago de servicios',
        type: 'payment',
        date: new Date('2024-01-20'),
      },
      {
        accountId: 1,
        amount: -150000.00,
        description: 'Transferencia a cuenta propia',
        type: 'transfer',
        date: new Date('2024-01-25'),
      },
    ]).onConflictDoNothing();

    console.log('✅ Base de datos inicializada correctamente');
    console.log('');
    console.log('🔐 Credenciales de acceso:');
    console.log('Admin: admin / admin123');
    console.log('Usuario: 1234567890 / user123');
    console.log('');
    console.log('🚀 ¡La aplicación está lista para usar!');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedDatabase();