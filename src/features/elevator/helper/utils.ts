import type { ElevatorStatus } from '@/types'
import type { ElevatorStatus as ApiElevatorStatus } from '@/types/api'

export const mapApiStatusToLocal = (status: ApiElevatorStatus): ElevatorStatus => {
	const statusMap: Record<ApiElevatorStatus, ElevatorStatus> = {
		ACTIVE: 'available',
		MAINTENANCE: 'maintenance',
		OUT_OF_ORDER: 'out_of_order',
	}
	return statusMap[status]
}

export const mapLocalStatusToApi = (status: ElevatorStatus): ApiElevatorStatus => {
	const statusMap: Record<ElevatorStatus, ApiElevatorStatus> = {
		available: 'ACTIVE',
		maintenance: 'MAINTENANCE',
		out_of_order: 'OUT_OF_ORDER',
	}
	return statusMap[status]
}
