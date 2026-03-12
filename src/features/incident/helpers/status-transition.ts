import type { IncidentStatus } from '@/types/api'

export const IncidentStatusEnum = {
	NEW: 'new',
	IN_PROGRESS: 'in_progress',
	IN_REVIEW: 'in_review',
	CLOSE: 'close',
	REOPEN: 'reopen',
} as const

export function getNextIncidentStatuses(status: IncidentStatus): IncidentStatus[] {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return [IncidentStatusEnum.NEW, IncidentStatusEnum.IN_PROGRESS]
		case IncidentStatusEnum.IN_PROGRESS:
			return [IncidentStatusEnum.IN_PROGRESS, IncidentStatusEnum.IN_REVIEW]
		case IncidentStatusEnum.IN_REVIEW:
			return [IncidentStatusEnum.IN_REVIEW, IncidentStatusEnum.CLOSE, IncidentStatusEnum.REOPEN]
		case IncidentStatusEnum.CLOSE:
			return [IncidentStatusEnum.CLOSE]
		case IncidentStatusEnum.REOPEN:
			return [IncidentStatusEnum.REOPEN, IncidentStatusEnum.IN_PROGRESS]
	}
}

export function canTransitionIncidentStatus(currentStatus: IncidentStatus, nextStatus: IncidentStatus): boolean {
	if (currentStatus === nextStatus) {
		return true
	}

	return getNextIncidentStatuses(currentStatus).includes(nextStatus)
}

export const getStatusLabel = (status: IncidentStatus, t: (key: string) => string) => {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return t('new')
		case IncidentStatusEnum.IN_PROGRESS:
			return t('inProgress')
		case IncidentStatusEnum.IN_REVIEW:
			return t('incidentInReview')
		case IncidentStatusEnum.CLOSE:
			return t('incidentClosed')
		case IncidentStatusEnum.REOPEN:
			return t('incidentReopened')
	}
}

export const IncidentPriorityEnum = {
	HIGH: 1,
	MEDIUM: 2,
	LOW: 3,
} as const

export const getPriorityLabel = (priority: number, t: (key: string) => string) => {
	switch (priority) {
		case IncidentPriorityEnum.LOW:
			return t('low')
		case IncidentPriorityEnum.MEDIUM:
			return t('medium')
		case IncidentPriorityEnum.HIGH:
			return t('high')
	}
}

export const getIncidentPriorityBadgeVariant = (priority: number) => {
	switch (priority) {
		case IncidentPriorityEnum.LOW:
			return 'secondary'
		case IncidentPriorityEnum.MEDIUM:
			return 'warning'
		case IncidentPriorityEnum.HIGH:
			return 'destructive'
		default:
			return 'default'
	}
}
