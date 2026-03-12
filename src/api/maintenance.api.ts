import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { MaintenanceFormData, MaintenanceSchedule } from '@/types/api'

export const maintenanceApi = {
	getMaintenanceSchedules: async (): Promise<MaintenanceSchedule[]> => {
		return apiGet<MaintenanceSchedule[]>('maintenance-schedules')
	},

	createMaintenanceSchedule: async (data: MaintenanceFormData): Promise<MaintenanceSchedule> => {
		return apiPost<MaintenanceSchedule>('maintenance-schedules', data)
	},

	getMaintenanceSchedule: async (scheduleId: string): Promise<MaintenanceSchedule> => {
		return apiGet<MaintenanceSchedule>(`maintenance-schedules/${scheduleId}`)
	},

	updateMaintenanceSchedule: async (scheduleId: string, data: MaintenanceFormData): Promise<MaintenanceSchedule> => {
		return apiPut<MaintenanceSchedule>(`maintenance-schedules/${scheduleId}`, data)
	},

	deleteMaintenanceSchedule: async (scheduleId: string): Promise<void> => {
		return apiDelete<void>(`maintenance-schedules/${scheduleId}`)
	},
}
