import type { ElevatorStatus } from '@/types'

export const getElevatorStatus = (status: ElevatorStatus, t: (key: string) => string) => {
	switch (status) {
		case 'out_of_order':
			return t('outOfOrder')
		default:
			return t('active')
	}
}

export const getElevatorStatusVariant = (status: ElevatorStatus) => {
	switch (status) {
		case 'out_of_order':
			return 'destructive'
		default:
			return 'success'
	}
}
