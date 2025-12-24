import { User, Company } from '../types/user';

// Mock user database
export const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'rajesh@globaltrade.in',
        name: 'Rajesh Kumar',
        companyId: 'company-1',
        companyName: 'Global Trade Inc.',
        role: 'COMPANY_ADMIN',
        status: 'APPROVED',
        createdAt: '2024-12-20'
    },
    {
        id: '2',
        email: 'priya@exportpro.com',
        name: 'Priya Sharma',
        companyId: 'company-2',
        companyName: 'ExportPro Solutions',
        role: 'COMPANY_ADMIN',
        status: 'PENDING',
        createdAt: '2024-12-21'
    },
    {
        id: '3',
        email: 'amit@shipcargo.in',
        name: 'Amit Patel',
        companyId: 'company-3',
        companyName: 'ShipCargo Logistics',
        role: 'COMPANY_EXPORT_ANALYST',
        status: 'PENDING',
        createdAt: '2024-12-22'
    }
];

// Mock company database
export const MOCK_COMPANIES: Company[] = [
    {
        id: 'company-1',
        name: 'Global Trade Inc.',
        country: 'India',
        adminUserId: '1',
        createdAt: '2024-12-20',
        industry: 'Textiles'
    },
    {
        id: 'company-2',
        name: 'ExportPro Solutions',
        country: 'India',
        adminUserId: '2',
        createdAt: '2024-12-21',
        industry: 'Electronics'
    },
    {
        id: 'company-3',
        name: 'ShipCargo Logistics',
        country: 'India',
        adminUserId: '3',
        createdAt: '2024-12-22',
        industry: 'Logistics'
    }
];

/**
 * Simulates user authentication
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email);

    // In a real app, we'd verify password here
    return user || null;
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | undefined {
    return MOCK_USERS.find(u => u.id === userId);
}

/**
 * Get company by ID
 */
export function getCompanyById(companyId: string): Company | undefined {
    return MOCK_COMPANIES.find(c => c.id === companyId);
}

/**
 * Get all users for a company
 */
export function getCompanyUsers(companyId: string): User[] {
    return MOCK_USERS.filter(u => u.companyId === companyId);
}

/**
 * Update user status (for admin approval)
 */
export function updateUserStatus(userId: string, status: User['status']): User | null {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
        user.status = status;
        return user;
    }
    return null;
}

/**
 * Create a new user invitation
 */
export function createUserInvitation(email: string, role: User['role'], companyId: string, invitedBy: string): User {
    const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0], // Temporary name
        companyId,
        companyName: getCompanyById(companyId)?.name || '',
        role,
        status: 'INVITED',
        createdAt: new Date().toISOString().split('T')[0],
        invitedBy
    };

    MOCK_USERS.push(newUser);
    return newUser;
}
