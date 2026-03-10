import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { File, FileCreate, FileUpdate } from '@/types/api'

export const fileApi = {
	getFiles: async (): Promise<File[]> => {
		return apiGet<File[]>('files')
	},

	createFile: async (data: FileCreate): Promise<File> => {
		return apiPost<File>('files', data)
	},

	getFile: async (fileId: string): Promise<File> => {
		return apiGet<File>(`files/${fileId}`)
	},

	updateFile: async (fileId: string, data: FileUpdate): Promise<File> => {
		return apiPut<File>(`files/${fileId}`, data)
	},

	deleteFile: async (fileId: string): Promise<void> => {
		return apiDelete<void>(`files/${fileId}`)
	},

	getFilesByEntity: async (entityType: string, entityId: string): Promise<File[]> => {
		return apiGet<File[]>(`files/entity/${entityType}/${entityId}`)
	},
}
