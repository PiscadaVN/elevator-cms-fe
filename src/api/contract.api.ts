import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { Contract, ContractCreate, ContractUpdate } from '@/types/api'

export const contractApi = {
	getContracts: async (): Promise<Contract[]> => {
		return apiGet<Contract[]>('contracts')
	},

	createContract: async (data: ContractCreate): Promise<Contract> => {
		return apiPost<Contract>('contracts', data)
	},

	getContract: async (contractId: string): Promise<Contract> => {
		return apiGet<Contract>(`contracts/${contractId}`)
	},

	updateContract: async (contractId: string, data: ContractUpdate): Promise<Contract> => {
		return apiPut<Contract>(`contracts/${contractId}`, data)
	},

	deleteContract: async (contractId: string): Promise<void> => {
		return apiDelete<void>(`contracts/${contractId}`)
	},

	getContractsByElevator: async (elevatorId: string): Promise<Contract[]> => {
		return apiGet<Contract[]>(`contracts/elevator/${elevatorId}`)
	},

	getContractsByCustomer: async (customerId: string): Promise<Contract[]> => {
		return apiGet<Contract[]>(`contracts/customer/${customerId}`)
	},
}
