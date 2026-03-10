import type { UserRole } from '@/types'

/**
 * Local application role enum
 */
export const UserRoles = {
	SUPER_ADMIN: 'superadmin',
	ADMIN: 'admin',
	OPERATOR: 'operator',
	VIEWER: 'viewer',
} as const

/**
 * Check if user has admin privileges (superadmin or admin)
 * @param role - User role
 * @returns true if user is admin or superadmin
 */
export function isAdmin(role?: UserRole | null): boolean {
	return role === UserRoles.SUPER_ADMIN || role === UserRoles.ADMIN
}

/**
 * Check if user has super admin privileges
 * @param role - User role
 * @returns true if user is superadmin
 */
export function isSuperAdmin(role?: UserRole | null): boolean {
	return role === UserRoles.SUPER_ADMIN
}

/**
 * Check if user has viewer role (read-only)
 * @param role - User role
 * @returns true if user is viewer
 */
export function isViewer(role?: UserRole | null): boolean {
	return role === UserRoles.VIEWER
}

/**
 * Check if user can edit (not a viewer)
 * @param role - User role
 * @returns true if user can edit
 */
export function canEdit(role?: UserRole | null): boolean {
	return !isViewer(role)
}

/**
 * Get all available user roles for selection
 * @returns Array of role values
 */
export function getAllUserRoles(): UserRole[] {
	return Object.values(UserRoles) as UserRole[]
}
