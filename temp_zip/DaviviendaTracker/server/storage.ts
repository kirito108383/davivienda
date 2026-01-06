import { 
  users, User, InsertUser,
  accounts, Account, InsertAccount,
  transactions, Transaction, InsertTransaction,
  beneficiaries, Beneficiary, InsertBeneficiary,
  services, Service, InsertService,
  userSessions, UserSession, InsertUserSession
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  setUserStatus(id: number, status: string): Promise<User | undefined>;

  // Account operations
  getAccountByUserId(userId: number): Promise<Account | undefined>;
  getAccountById(id: number): Promise<Account | undefined>;
  getAccountByNumber(accountNumber: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(id: number, amount: number): Promise<Account | undefined>;
  updateAccountStatus(id: number, status: string, statusMessage?: string): Promise<Account | undefined>;
  updateAccount(id: number, accountData: Partial<InsertAccount>): Promise<Account | undefined>;
  deleteAccount(id: number): Promise<boolean>;
  getAllAccounts(): Promise<Account[]>;

  // Transaction operations
  getTransactionsByAccountId(accountId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;

  // Beneficiary operations
  getBeneficiariesByUserId(userId: number): Promise<Beneficiary[]>;
  createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary>;

  // Service operations
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Session operations
  createSession(session: InsertUserSession): Promise<UserSession>;
  updateSessionLogout(id: number, logoutTime: Date): Promise<UserSession | undefined>;
  getSessionsByUserId(userId: number): Promise<UserSession[]>;
  getAllSessions(): Promise<UserSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  private beneficiaries: Map<number, Beneficiary>;
  private services: Map<number, Service>;
  private sessions: Map<number, UserSession>;
  
  private userId = 1;
  private accountId = 1;
  private transactionId = 1;
  private beneficiaryId = 1;
  private serviceId = 1;

  private sessionId = 1;
    
  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.beneficiaries = new Map();
    this.services = new Map();
    this.sessions = new Map();

    // Crear usuario de prueba con los datos actualizados
    const testUser: User = {
      id: this.userId++,
      username: "1083838423", // Usuario como solicitó el cliente
      password: "1083", // Contraseña como solicitó el cliente
      name: "Coljuegos S.A.S",
      email: "coljuegos@ejemplo.com",
      document: "1083838423",
      phone: "3001234567",
      lastLogin: new Date(),
      isAdmin: 0
    };
    this.users.set(testUser.id, testUser);
    
    // Crear usuario administrador
    const adminUser: User = {
      id: this.userId++,
      username: "admin", // Usuario para administrador
      password: "admin2025", // Contraseña para administrador
      name: "Administrador Davivienda",
      email: "admin@davivienda.com",
      document: "1000000001",
      phone: "3209876543",
      lastLogin: new Date(),
      isAdmin: 1
    };
    this.users.set(adminUser.id, adminUser);
    
    // Crear cuenta para el administrador
    const adminAccount: Account = {
      id: this.accountId++,
      userId: adminUser.id,
      accountNumber: "999-000-000-01",
      accountType: "Administrativa",
      balance: 100000000000, // 100 mil millones de pesos
      status: "ACTIVA",
      statusMessage: null
    };
    this.accounts.set(adminAccount.id, adminAccount);
    
    // Crear cuenta con cuatro mil seiscientos millones de pesos de saldo
    const testAccount: Account = {
      id: this.accountId++,
      userId: testUser.id,
      accountNumber: "1234567890",
      accountType: "Ahorros",
      balance: 4600000000, // Cuatro mil seiscientos millones de pesos
      status: null,
      statusMessage: null
    };
    this.accounts.set(testAccount.id, testAccount);
    
    // Crear segundo usuario: José Nevares
    const joseNevares: User = {
      id: this.userId++,
      username: "0551774416", // Cédula extranjera como usuario
      password: "7416", // Contraseña como solicitó el cliente
      name: "JOSE NEVARES",
      email: "josenevarez0551@gmail.com", // Email actualizado
      document: "0551774416", // Cédula extranjera
      phone: "+1 (912) 237-6412", // Teléfono actualizado
      lastLogin: new Date(),
      isAdmin: 0
    };
    this.users.set(joseNevares.id, joseNevares);
    
    // Crear cuenta para José Nevares con saldo actualizado y bloqueado
    const joseAccount: Account = {
      id: this.accountId++,
      userId: joseNevares.id,
      accountNumber: "977-895-707-25", // Número de cuenta actualizado
      accountType: "Ahorros",
      balance: 4252500000, // 4,252,500,000 pesos
      status: "BLOQUEADA", // Cuenta bloqueada
      statusMessage: "Fondos retenidos hasta levantar bloqueo y retenciones"
    };
    this.accounts.set(joseAccount.id, joseAccount);
    
    // Crear usuario Yolanda Jeronimo Pablo
    const yolandaUser: User = {
      id: this.userId++,
      username: "@yolandapablojeronimo", // Usuario como solicitado
      password: "261688", // Contraseña como solicitada
      name: "Yolanda Jeronimo Pablo",
      email: "yolanda.pablo@ejemplo.com",
      document: "YJP12345",
      phone: "+52 9981234567",
      lastLogin: new Date(),
      isAdmin: 0
    };
    this.users.set(yolandaUser.id, yolandaUser);
    
    // Crear cuenta para Yolanda Jeronimo Pablo
    const yolandaAccount: Account = {
      id: this.accountId++,
      userId: yolandaUser.id,
      accountNumber: "912-456-029-09", // Número de cuenta específico
      accountType: "Ahorros",
      balance: 557026, // 557,026 pesos colombianos
      status: "ACTIVA",
      statusMessage: null
    };
    this.accounts.set(yolandaAccount.id, yolandaAccount);
    
    // Crear transacciones de indemnización para Yolanda
    const indemnizacionTransaction1: Transaction = {
      id: this.transactionId++,
      accountId: yolandaAccount.id,
      amount: 320000, // 320,000 pesos
      description: "INDEMNIZACION",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
      type: "deposit",
      reference: "REF-IND-20250327",
      recipientId: null
    };
    this.transactions.set(indemnizacionTransaction1.id, indemnizacionTransaction1);
    
    const indemnizacionTransaction2: Transaction = {
      id: this.transactionId++,
      accountId: yolandaAccount.id,
      amount: 237026, // 237,026 pesos
      description: "DEVOLUCION-INDEMNIZACION",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      type: "deposit",
      reference: "REF-DEV-20250430",
      recipientId: null
    };
    this.transactions.set(indemnizacionTransaction2.id, indemnizacionTransaction2);
    
    // Crear transacción de consignación para José Nevares desde COLJUEGOS
    const joseTransaction: Transaction = {
      id: this.transactionId++,
      accountId: joseAccount.id,
      amount: 4252500000, // 4,252,500,000 pesos
      description: "Consignación recibida - COLJUEGOS S.A.S",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      type: "deposit",
      reference: `REF-${Math.floor(Math.random() * 1000000)}`,
      recipientId: null
    };
    this.transactions.set(joseTransaction.id, joseTransaction);
    
    // Crear algunas transacciones recientes
    const transactions: Partial<Transaction>[] = [
      {
        accountId: testAccount.id,
        amount: 500000,
        description: "Nómina",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        type: "deposit"
      },
      {
        accountId: testAccount.id,
        amount: 120000,
        description: "Pago Netflix",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        type: "withdrawal"
      },
      {
        accountId: testAccount.id,
        amount: 300000,
        description: "Transferencia a Juan Pérez",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: "transfer"
      }
    ];
    
    transactions.forEach(transaction => {
      const newTransaction: Transaction = {
        ...transaction as Transaction,
        id: this.transactionId++,
        reference: `REF-${Math.floor(Math.random() * 1000000)}`,
        recipientId: transaction.type === "transfer" ? 2 : null
      };
      this.transactions.set(newTransaction.id, newTransaction);
    });
    
    // Crear algunos beneficiarios con bancos comunes para transferencias Davivienda
    const beneficiaries: Partial<Beneficiary>[] = [
      {
        userId: testUser.id,
        name: "Beneficiario Bancolombia",
        bank: "Bancolombia",
        accountNumber: "9876543210",
        accountType: "Ahorros"
      },
      {
        userId: testUser.id,
        name: "Beneficiario BBVA",
        bank: "BBVA Colombia",
        accountNumber: "5678901234",
        accountType: "Corriente"
      },
      {
        userId: testUser.id,
        name: "Beneficiario Occidente",
        bank: "Banco de Occidente",
        accountNumber: "2468013579",
        accountType: "Ahorros"
      },
      {
        userId: testUser.id,
        name: "Beneficiario Banco Popular",
        bank: "Banco Popular",
        accountNumber: "1357924680",
        accountType: "Corriente"
      },
      {
        userId: testUser.id,
        name: "Beneficiario Caja Social",
        bank: "Banco Caja Social",
        accountNumber: "3141592653",
        accountType: "Ahorros"
      }
    ];
    
    beneficiaries.forEach(beneficiary => {
      const newBeneficiary: Beneficiary = {
        ...beneficiary as Beneficiary,
        id: this.beneficiaryId++
      };
      this.beneficiaries.set(newBeneficiary.id, newBeneficiary);
    });

    // Initialize with default services
    this.initializeServices();
  }

  // Initialize default services
  private initializeServices(): void {
    const servicesList: InsertService[] = [
      { name: "ENEL", category: "electricity", description: "Servicio de electricidad" },
      { name: "EPM", category: "electricity", description: "Empresas Públicas de Medellín" },
      { name: "ESSA", category: "electricity", description: "Electrificadora de Santander" },
      { name: "Aguas de Bogotá", category: "water", description: "Servicio de agua en Bogotá" },
      { name: "Emcali", category: "water", description: "Servicios públicos de Cali" },
      { name: "Claro", category: "phone", description: "Servicio de telefonía móvil" },
      { name: "Movistar", category: "phone", description: "Servicio de telefonía e internet" },
      { name: "ETB", category: "internet", description: "Empresa de Telecomunicaciones de Bogotá" },
      { name: "DirecTV", category: "tv", description: "Servicio de televisión" },
    ];

    servicesList.forEach(service => {
      this.createService(service);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      lastLogin: new Date(),
      isAdmin: insertUser.isAdmin || 0 // Asegurar que isAdmin siempre esté definido
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async setUserStatus(id: number, status: string): Promise<User | undefined> {
    // En este modelo de datos no tenemos un campo de estado para usuarios
    // Por lo que este método es un placeholder
    return this.getUser(id);
  }

  // Account operations
  async getAccountByUserId(userId: number): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(
      (account) => account.userId === userId
    );
  }

  async getAccountById(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async getAccountByNumber(accountNumber: string): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(
      (account) => account.accountNumber === accountNumber
    );
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const id = this.accountId++;
    // Ensure balance is a number and status/statusMessage are present
    const newAccount: Account = { 
      ...account, 
      id,
      balance: account.balance ?? 0, // Ensure balance is always present
      status: account.status ?? null, // Ensure status is always present
      statusMessage: account.statusMessage ?? null // Ensure statusMessage is always present
    };
    this.accounts.set(id, newAccount);
    return newAccount;
  }

  async updateAccountBalance(id: number, amount: number): Promise<Account | undefined> {
    const account = await this.getAccountById(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, balance: account.balance + amount };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  async updateAccountStatus(id: number, status: string, statusMessage?: string): Promise<Account | undefined> {
    const account = await this.getAccountById(id);
    if (!account) return undefined;
    
    const updatedAccount = { 
      ...account, 
      status, 
      statusMessage: statusMessage ?? account.statusMessage 
    };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async updateAccount(id: number, accountData: Partial<InsertAccount>): Promise<Account | undefined> {
    const account = await this.getAccountById(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...accountData };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteAccount(id: number): Promise<boolean> {
    const account = await this.getAccountById(id);
    if (!account) return false;
    
    // Delete all related transactions first
    const accountTransactions = await this.getTransactionsByAccountId(id);
    for (const transaction of accountTransactions) {
      this.transactions.delete(transaction.id);
    }
    
    // Delete the account
    this.accounts.delete(id);
    return true;
  }
  
  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  // Transaction operations
  async getTransactionsByAccountId(accountId: number): Promise<Transaction[]> {
    // Para la cuenta de José Nevares (ID 2), mostrar solo la consignación de COLJUEGOS
    if (accountId === 2) {
      return Array.from(this.transactions.values())
        .filter(transaction => 
          transaction.accountId === accountId && 
          transaction.description.includes("COLJUEGOS")
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Para otras cuentas, mostrar todas las transacciones
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction: Transaction = { 
      ...transaction, 
      id,
      date: transaction.date || new Date(), // Ensure date is always present
      reference: transaction.reference ?? null, // Ensure reference is always a string or null
      recipientId: transaction.recipientId ?? null // Ensure recipientId is always a number or null
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Beneficiary operations
  async getBeneficiariesByUserId(userId: number): Promise<Beneficiary[]> {
    return Array.from(this.beneficiaries.values())
      .filter(beneficiary => beneficiary.userId === userId);
  }

  async createBeneficiary(beneficiary: InsertBeneficiary): Promise<Beneficiary> {
    const id = this.beneficiaryId++;
    const newBeneficiary: Beneficiary = { ...beneficiary, id };
    this.beneficiaries.set(id, newBeneficiary);
    return newBeneficiary;
  }

  // Service operations
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.category === category);
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceId++;
    const newService: Service = { 
      ...service, 
      id,
      description: service.description ?? null // Ensure description is always a string or null
    };
    this.services.set(id, newService);
    return newService;
  }
  
  // Session operations
  async createSession(session: InsertUserSession): Promise<UserSession> {
    const id = this.sessionId++;
    const newSession: UserSession = {
      id,
      userId: session.userId,
      loginTime: session.loginTime || new Date(),
      logoutTime: null,
      ipAddress: session.ipAddress || null,
      userAgent: session.userAgent || null,
      sessionDuration: null
    };
    this.sessions.set(id, newSession);
    return newSession;
  }
  
  async updateSessionLogout(id: number, logoutTime: Date): Promise<UserSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    // Calcular duración en segundos
    const loginTime = new Date(session.loginTime);
    const duration = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000);
    
    const updatedSession: UserSession = {
      ...session,
      logoutTime,
      sessionDuration: duration
    };
    
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  async getSessionsByUserId(userId: number): Promise<UserSession[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
  }
  
  async getAllSessions(): Promise<UserSession[]> {
    return Array.from(this.sessions.values())
      .sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
  }
}

// Create and export an instance of the storage
export const storage = new MemStorage();
