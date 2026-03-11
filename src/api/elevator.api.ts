import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { Elevator, ElevatorCreate, ElevatorUpdate } from '@/types/api'

export const elevatorApi = {
	getElevators: async (): Promise<Elevator[]> => {
		return apiGet<Elevator[]>('elevators')
	},

	createElevator: async (data: ElevatorCreate): Promise<Elevator> => {
		return apiPost<Elevator>('elevators', data)
	},

	getElevator: async (elevatorId: string): Promise<Elevator> => {
		return apiGet<Elevator>(`elevators/${elevatorId}`)
	},

	updateElevator: async (elevatorId: string, data: ElevatorUpdate): Promise<Elevator> => {
		return apiPut<Elevator>(`elevators/${elevatorId}`, data)
	},

	deleteElevator: async (elevatorId: string): Promise<void> => {
		return apiDelete<void>(`elevators/${elevatorId}`)
	},
}
