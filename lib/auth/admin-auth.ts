import { getCurrentUser, isAdmin } from './supabase-auth-server';

export interface AdminAuthResult {
    user?: any;
    error?: string;
    status?: number;
}

export async function requireAdmin(): Promise<AdminAuthResult> {
    const user = await getCurrentUser();
    if (!user) {
        return { error: 'Unauthorized', status: 401 };
    }

    const adminCheck = await isAdmin();
    if (!adminCheck) {
        return { error: 'Forbidden - Admin access required', status: 403 };
    }

    return { user };
}
