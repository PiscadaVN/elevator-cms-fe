import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { ElevatorUser, ElevatorUserCreate, ElevatorUserUpdate } from '@/types/api'

export const elevatorUserApi = {
	getElevatorUsers: async (): Promise<ElevatorUser[]> => {
		return apiGet<ElevatorUser[]>('elevator-users')
	},

	createElevatorUser: async (data: ElevatorUserCreate): Promise<ElevatorUser> => {
		return apiPost<ElevatorUser>('elevator-users', data)
	},

	getElevatorUser: async (elevatorUserId: string): Promise<ElevatorUser> => {
		return apiGet<ElevatorUser>(`elevator-users/${elevatorUserId}`)
	},

	updateElevatorUser: async (elevatorUserId: string, data: ElevatorUserUpdate): Promise<ElevatorUser> => {
		return apiPut<ElevatorUser>(`elevator-users/${elevatorUserId}`, data)
	},

	deleteElevatorUser: async (elevatorUserId: string): Promise<void> => {
		return apiDelete<void>(`elevator-users/${elevatorUserId}`)
	},

	getUsersByElevator: async (elevatorId: string): Promise<ElevatorUser[]> => {
		return apiGet<ElevatorUser[]>(`elevator-users/elevator/${elevatorId}`)
	},

	getElevatorsByUser: async (userId: string): Promise<ElevatorUser[]> => {
		return apiGet<ElevatorUser[]>(`elevator-users/user/${userId}`)
	},
}
