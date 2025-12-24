export type UserStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'INVITED';

export type UserRole =
    | 'SAAS_ADMIN' // SaaS platform admin
    | 'COMPANY_ADMIN' // Company owner/admin - full access to company settings
    | 'COMPANY_EXPORT_ANALYST'; // Export operations and analysis - limited permissions

export interface User {
    id: string;
    email: string;
    name: string;
    companyId: string;
    companyName: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    invitedBy?: string; // User ID of who invited them
}

export interface Company {
    id: string;
    name: string;
    country: string;
    adminUserId: string;
    createdAt: string;
    address?: string;
    industry?: string;
}

export interface UserInvitation {
    id: string;
    email: string;
    role: UserRole;
    companyId: string;
    invitedBy: string;
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
    createdAt: string;
    expiresAt: string;
}
