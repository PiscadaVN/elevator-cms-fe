import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { User, UserCreate, UserUpdate } from '@/types/api'

export const userApi = {
	getCurrentUser: async (): Promise<User> => {
		return apiGet<User>('users/me')
	},

	getUsers: async (): Promise<User[]> => {
		return apiGet<User[]>('users')
	},

	createUser: async (data: UserCreate): Promise<User> => {
		return apiPost<User>('users', data)
	},

	getUser: async (userId: string): Promise<User> => {
		return apiGet<User>(`users/${userId}`)
	},

	updateUser: async (userId: string, data: UserUpdate): Promise<User> => {
		return apiPut<User>(`users/${userId}`, data)
	},

	deleteUser: async (userId: string): Promise<void> => {
		return apiDelete<void>(`users/${userId}`)
	},
}
