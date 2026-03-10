import type { Contract as ApiContract, ContractCreate, ContractUpdate } from '@/types/api'
import type { ContractStatus } from '@/types'

export interface LocalContract {
	id: string
	customerId: string
	elevatorIds: string[]
	signDate: string
	expiryDate: string
	amount: number
	serviceCycle: string
	status: ContractStatus
	note: string
}

export const mapApiContractToLocal = (apiContract: ApiContract): LocalContract => {
	return {
		id: apiContract.id,
		customerId: apiContract.customer_id,
		elevatorIds: [apiContract.elevator_id],
		signDate: apiContract.signed_at ? new Date(apiContract.signed_at * 1000).toISOString().split('T')[0] : '',
		expiryDate: apiContract.expired_at ? new Date(apiContract.expired_at * 1000).toISOString().split('T')[0] : '',
		amount:
			typeof apiContract.contract_value === 'number'
				? apiContract.contract_value
				: parseFloat(String(apiContract.contract_value || 0)),
		serviceCycle: '1m',
		status: apiContract.is_active ? 'active' : 'expired',
		note: apiContract.description || '',
	}
}

export const mapLocalToApiCreate = (local: Partial<LocalContract>): ContractCreate => {
	const signedAt = local.signDate ? Math.floor(new Date(local.signDate).getTime() / 1000) : undefined
	const expiredAt = local.expiryDate ? Math.floor(new Date(local.expiryDate).getTime() / 1000) : undefined

	return {
		elevator_id: local.elevatorIds?.[0] || '',
		customer_id: local.customerId || '',
		signed_at: signedAt,
		expired_at: expiredAt,
		contract_value: local.amount,
		description: local.note,
		is_active: local.status === 'active',
	}
}

export const mapLocalToApiUpdate = (local: Partial<LocalContract>): ContractUpdate => {
	const signedAt = local.signDate ? Math.floor(new Date(local.signDate).getTime() / 1000) : undefined
	const expiredAt = local.expiryDate ? Math.floor(new Date(local.expiryDate).getTime() / 1000) : undefined

	return {
		elevator_id: local.elevatorIds?.[0],
		customer_id: local.customerId,
		signed_at: signedAt,
		expired_at: expiredAt,
		contract_value: local.amount,
		description: local.note,
		is_active: local.status === 'active',
	}
}
