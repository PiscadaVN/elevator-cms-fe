import type { MaintenanceStatus } from '@/types/api'

export const MaintenanceStatusEnum = {
	SCHEDULED: 'scheduled',
	UPCOMING: 'upcoming',
	OVERDUE: 'overdue',
	IN_PROGRESS: 'in_progress',
	UNDER_REVIEW: 'under_review',
	COMPLETED: 'completed',
	FAILED: 'failed',
} as const

export const getMaintenanceStatusLabel = (status: MaintenanceStatus, t: (key: string) => string): string => {
	switch (status) {
		case MaintenanceStatusEnum.SCHEDULED:
			return t('maintenanceScheduled')
		case MaintenanceStatusEnum.UPCOMING:
			return t('maintenanceUpcoming')
		case MaintenanceStatusEnum.OVERDUE:
			return t('maintenanceOverdue')
		case MaintenanceStatusEnum.IN_PROGRESS:
			return t('maintenanceInProgress')
		case MaintenanceStatusEnum.UNDER_REVIEW:
			return t('maintenanceUnderReview')
		case MaintenanceStatusEnum.COMPLETED:
			return t('maintenanceCompleted')
		case MaintenanceStatusEnum.FAILED:
			return t('maintenanceFailed')
	}
}

export const getNextMaintenanceStatuses = (status: MaintenanceStatus): MaintenanceStatus[] => {
	switch (status) {
		case MaintenanceStatusEnum.SCHEDULED:
			return [MaintenanceStatusEnum.SCHEDULED, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.UPCOMING:
			return [MaintenanceStatusEnum.UPCOMING, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.OVERDUE:
			return [MaintenanceStatusEnum.OVERDUE, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.IN_PROGRESS:
			return [MaintenanceStatusEnum.IN_PROGRESS, MaintenanceStatusEnum.UNDER_REVIEW, MaintenanceStatusEnum.OVERDUE]
		case MaintenanceStatusEnum.UNDER_REVIEW:
			return [MaintenanceStatusEnum.UNDER_REVIEW, MaintenanceStatusEnum.COMPLETED, MaintenanceStatusEnum.FAILED]
		case MaintenanceStatusEnum.COMPLETED:
			return [MaintenanceStatusEnum.COMPLETED]
		case MaintenanceStatusEnum.FAILED:
			return [MaintenanceStatusEnum.FAILED, MaintenanceStatusEnum.IN_PROGRESS]
	}
}

export function canTransitionMaintenanceStatus(
	currentStatus: MaintenanceStatus,
	nextStatus: MaintenanceStatus,
): boolean {
	if (currentStatus === nextStatus) {
		return true
	}

	return getNextMaintenanceStatuses(currentStatus).includes(nextStatus)
}
