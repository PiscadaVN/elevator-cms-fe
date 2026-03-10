import { useNavigate } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, Elevator, User } from '@/types'
import { AddContractDialog } from './AddContractDialog'
import { EditContractDialog } from './EditContractDialog'
import { ContractTable } from './ContractTable'
import {
	useContracts,
	useCreateContract,
	useDeleteContract,
	useElevators,
	useUpdateContract,
	useUsers,
} from '@/hooks/api'
import {
	mapApiContractToLocal,
	mapLocalToApiCreate,
	mapLocalToApiUpdate,
	type LocalContract,
} from '../helpers/contract-mappers'
import { isAdmin as checkIsAdmin } from '@/lib/role-utils'

function ContractList() {
	const navigate = useNavigate()
	const { t } = useLanguage()
	const { user: currentUser } = useAuth()

	const isAdmin = checkIsAdmin(currentUser?.role)

	const { data: apiContracts, isLoading: loadingContracts } = useContracts()
	const { data: apiUsers, isLoading: loadingUsers } = useUsers()
	const { data: apiElevators, isLoading: loadingElevators } = useElevators()

	const createContractMutation = useCreateContract()
	const updateContractMutation = useUpdateContract()
	const deleteContractMutation = useDeleteContract()

	const contracts = useMemo(() => {
		return apiContracts?.map(mapApiContractToLocal) || []
	}, [apiContracts])

	const allUsers = useMemo(() => {
		return (
			apiUsers?.map((user) => ({
				id: user.id,
				name: user.full_name,
				email: user.email,
				role: user.role,
			})) || []
		)
	}, [apiUsers])

	const allElevators = useMemo(() => {
		return (
			apiElevators?.map((elevator) => ({
				id: elevator.id,
				name: elevator.name || elevator.elevator_code,
				code: elevator.elevator_code,
				status: elevator.status,
			})) || []
		)
	}, [apiElevators])

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<LocalContract | null>(null)

	const [formData, setFormData] = useState<Partial<LocalContract>>({
		customerId: '',
		elevatorIds: [],
		signDate: '',
		expiryDate: '',
		amount: 0,
		serviceCycle: '1m',
		status: 'active',
		note: '',
	})

	const [selectedElevatorId, setSelectedElevatorId] = useState('')

	const visibleContracts = useMemo(() => {
		if (isAdmin) return contracts
		if (!currentUser) return []
		return contracts.filter((c) => c.customerId === currentUser.id)
	}, [contracts, currentUser, isAdmin])

	const getUserName = (userId: string) => {
		return allUsers.find((u) => u.id === userId)?.name || userId
	}

	const getElevatorName = (elevatorId: string) => {
		return allElevators.find((e) => e.id === elevatorId)?.name || elevatorId
	}

	const navigateToElevator = () => {
		navigate({ to: '/' })
	}

	const handleViewContract = (contractId: string) => {
		navigate({ to: `/contract/${contractId}` })
	}

	const resetForm = () => {
		setFormData({
			customerId: '',
			elevatorIds: [],
			signDate: '',
			expiryDate: '',
			amount: 0,
			serviceCycle: '1m',
			status: 'active',
			note: '',
		})
		setSelectedElevatorId('')
	}

	const handleAddContract = async () => {
		if (!formData.customerId || !formData.signDate || !formData.expiryDate || !formData.elevatorIds?.length) return

		try {
			const apiData = mapLocalToApiCreate(formData)
			await createContractMutation.mutateAsync(apiData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateContract'))
		}
	}

	const handleUpdateContract = async () => {
		if (!editingContract) return

		try {
			const apiData = mapLocalToApiUpdate(formData)
			await updateContractMutation.mutateAsync({
				contractId: editingContract.id,
				data: apiData,
			})
			setEditingContract(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateContract'))
		}
	}

	const handleDeleteContract = async (id: string) => {
		if (!confirm(t('confirmDelete'))) return

		try {
			await deleteContractMutation.mutateAsync(id)
		} catch (_error) {
			// Error handling
			alert(t('failedToDeleteContract'))
		}
	}

	const openEditDialog = (contract: LocalContract) => {
		setEditingContract(contract)
		setFormData({
			customerId: contract.customerId,
			elevatorIds: contract.elevatorIds,
			signDate: contract.signDate,
			expiryDate: contract.expiryDate,
			amount: contract.amount,
			serviceCycle: contract.serviceCycle,
			status: contract.status,
			note: contract.note,
		})
	}

	if (loadingContracts || loadingUsers || loadingElevators) {
		return (
			<div className="p-8 flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">{t('loadingContracts')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
						<FileText className="w-10 h-10 text-primary" />
						{t('contractManagementTitle')}
					</h1>
					<p className="text-muted-foreground mt-2">{t('contractManagementDesc')}</p>
				</div>

				{isAdmin && (
					<AddContractDialog
						open={isAddDialogOpen}
						onOpenChange={setIsAddDialogOpen}
						formData={formData as Partial<Contract>}
						setFormData={setFormData as (data: Partial<Contract>) => void}
						selectedElevatorId={selectedElevatorId}
						setSelectedElevatorId={setSelectedElevatorId}
						allUsers={allUsers as User[]}
						allElevators={allElevators as unknown as Elevator[]}
						isAdmin={isAdmin}
						getElevatorName={getElevatorName}
						onSubmit={handleAddContract}
					/>
				)}
			</header>

			<ContractTable
				contracts={visibleContracts}
				isAdmin={isAdmin}
				getUserName={getUserName}
				getElevatorName={getElevatorName}
				onView={handleViewContract}
				onEdit={openEditDialog}
				onDelete={handleDeleteContract}
				onElevatorClick={navigateToElevator}
				isDeleting={deleteContractMutation.isPending}
			/>

			{editingContract && (
				<EditContractDialog
					contract={editingContract as Contract}
					onClose={() => {
						setEditingContract(null)
						resetForm()
					}}
					formData={formData as Partial<Contract>}
					setFormData={setFormData as (data: Partial<Contract>) => void}
					selectedElevatorId={selectedElevatorId}
					setSelectedElevatorId={setSelectedElevatorId}
					allUsers={allUsers as User[]}
					allElevators={allElevators as unknown as Elevator[]}
					isAdmin={isAdmin}
					getElevatorName={getElevatorName}
					onSubmit={handleUpdateContract}
				/>
			)}
		</div>
	)
}

export default ContractList
