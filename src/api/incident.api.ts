import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { Incident, IncidentCreate, IncidentUpdate } from '@/types/api'

export const incidentApi = {
	getIncidents: async (): Promise<Incident[]> => {
		return apiGet<Incident[]>('incidents')
	},

	createIncident: async (data: IncidentCreate): Promise<Incident> => {
		return apiPost<Incident>('incidents', data)
	},

	getIncident: async (incidentId: string): Promise<Incident> => {
		return apiGet<Incident>(`incidents/${incidentId}`)
	},

	updateIncident: async (incidentId: string, data: IncidentUpdate): Promise<Incident> => {
		return apiPut<Incident>(`incidents/${incidentId}`, data)
	},

	deleteIncident: async (incidentId: string): Promise<void> => {
		return apiDelete<void>(`incidents/${incidentId}`)
	},

	getIncidentsByElevator: async (elevatorId: string): Promise<Incident[]> => {
		return apiGet<Incident[]>(`incidents/elevator/${elevatorId}`)
	},

	getIncidentsByAssignedUser: async (userId: string): Promise<Incident[]> => {
		return apiGet<Incident[]>(`incidents/assigned/${userId}`)
	},
}
