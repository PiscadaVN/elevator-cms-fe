import { isAdmin } from '@/lib/role-utils'
import type { IncidentStatus, UserRole } from '@/types'
import type { IncidentStatus as ApiIncidentStatus } from '@/types/api'

export function getNextIncidentStatuses(status: IncidentStatus, role?: UserRole | null): IncidentStatus[] {
	switch (status) {
		case 'new':
			return ['in_progress']
		case 'in_progress':
			return ['pending_approval']
		case 'pending_approval':
			return isAdmin(role) ? ['completed', 'rejected'] : []
		case 'completed':
		case 'rejected':
			return []
	}
}

export function canTransitionIncidentStatus(
	currentStatus: IncidentStatus,
	nextStatus: IncidentStatus,
	role?: UserRole | null,
): boolean {
	if (currentStatus === nextStatus) {
		return true
	}

	return getNextIncidentStatuses(currentStatus, role).includes(nextStatus)
}

export function incidentStatusToApiStatus(status: IncidentStatus): ApiIncidentStatus {
	switch (status) {
		case 'new':
			return 'NEW'
		case 'in_progress':
			return 'IN_PROGRESS'
		case 'pending_approval':
			return 'PENDING_APPROVAL'
		case 'completed':
			return 'COMPLETED'
		case 'rejected':
			return 'REJECTED'
	}
}

export function apiIncidentStatusToLocalStatus(status: ApiIncidentStatus): IncidentStatus {
	switch (status) {
		case 'NEW':
			return 'new'
		case 'IN_PROGRESS':
			return 'in_progress'
		case 'PENDING_APPROVAL':
			return 'pending_approval'
		case 'COMPLETED':
			return 'completed'
		case 'REJECTED':
			return 'rejected'
	}
}
