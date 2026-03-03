import { useNavigate } from '@tanstack/react-router'
import { Edit, Eye, FileText, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { INITIAL_ELEVATORS } from '@/features/elevator/components/ElevatorDashboard'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, ContractStatus, Elevator, User } from '@/types'
import { AddContractDialog } from './AddContractDialog'
import { EditContractDialog } from './EditContractDialog'

function ContractList() {
	const navigate = useNavigate()

	const { t } = useLanguage()
	const { user: currentUser } = useAuth()

	const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin'

	const allUsers: User[] = useMemo(() => {
		try {
			return JSON.parse(localStorage.getItem('elevator_users_db') || '[]')
		} catch {
			return []
		}
	}, [])

	const allElevators: Elevator[] = useMemo(() => {
		try {
			const stored = localStorage.getItem('elevator_data')
			return stored ? JSON.parse(stored) : INITIAL_ELEVATORS
		} catch {
			return INITIAL_ELEVATORS
		}
	}, [])

	const [contracts, setContracts] = useState<Contract[]>(() => {
		try {
			const stored = localStorage.getItem('elevator_contracts_db')
			return stored ? JSON.parse(stored) : []
		} catch {
			return []
		}
	})

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Contract | null>(null)

	const [formData, setFormData] = useState<Partial<Contract>>({
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

	const saveToDb = (newContracts: Contract[]) => {
		setContracts(newContracts)
		localStorage.setItem('elevator_contracts_db', JSON.stringify(newContracts))
	}

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

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
	}

	const formatDate = (dateStr: string) => {
		if (!dateStr) return ''
		return new Date(dateStr).toLocaleDateString('vi-VN')
	}

	const serviceCycleLabel = (cycle: string) => {
		const map: Record<string, string> = {
			'1m': `1 ${t('everyMonths')}`,
			'2m': `2 ${t('everyMonths')}`,
			'3m': `3 ${t('everyMonths')}`,
			'6m': `6 ${t('everyMonths')}`,
			'12m': `12 ${t('everyMonths')}`,
		}
		return map[cycle] || cycle
	}

	const statusBadge = (status: ContractStatus) => {
		const variants: Record<ContractStatus, 'success' | 'warning' | 'destructive'> = {
			active: 'success',
			expired: 'warning',
			cancelled: 'destructive',
		}
		const labels: Record<ContractStatus, string> = {
			active: t('contractActive'),
			expired: t('contractExpired'),
			cancelled: t('contractCancelled'),
		}
		return <Badge variant={variants[status]}>{labels[status]}</Badge>
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

	const handleAddContract = () => {
		if (!formData.customerId || !formData.signDate || !formData.expiryDate || !formData.elevatorIds?.length) return

		const newContract: Contract = {
			id: `CT${String(contracts.length + 1).padStart(3, '0')}`,
			customerId: formData.customerId!,
			elevatorIds: formData.elevatorIds!,
			signDate: formData.signDate!,
			expiryDate: formData.expiryDate!,
			amount: formData.amount || 0,
			serviceCycle: (formData.serviceCycle as Contract['serviceCycle']) || '1m',
			status: 'active',
			note: formData.note || '',
		}

		saveToDb([...contracts, newContract])
		setIsAddDialogOpen(false)
		resetForm()
	}

	const handleUpdateContract = () => {
		if (!editingContract) return
		const updated = contracts.map((c) => (c.id === editingContract.id ? ({ ...c, ...formData } as Contract) : c))
		saveToDb(updated)
		setEditingContract(null)
		resetForm()
	}

	const handleDeleteContract = (id: string) => {
		if (!confirm(t('confirmDelete'))) return
		saveToDb(contracts.filter((c) => c.id !== id))
	}

	const openEditDialog = (contract: Contract) => {
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

	const navigateToElevator = () => {
		navigate({ to: '/' })
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
						formData={formData}
						setFormData={setFormData}
						selectedElevatorId={selectedElevatorId}
						setSelectedElevatorId={setSelectedElevatorId}
						allUsers={allUsers}
						allElevators={allElevators}
						isAdmin={isAdmin}
						getElevatorName={getElevatorName}
						onSubmit={handleAddContract}
					/>
				)}
			</header>

			<Card>
				<CardHeader>
					<CardTitle>{isAdmin ? t('allContracts') : t('myContracts')}</CardTitle>
					<CardDescription>{t('contractListDesc')}</CardDescription>
				</CardHeader>
				<CardContent>
					{visibleContracts.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground">{t('noContractsFound')}</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t('contractId')}</TableHead>
									<TableHead>{t('customer')}</TableHead>
									<TableHead>{t('linkedElevators')}</TableHead>
									<TableHead>{t('signDate')}</TableHead>
									<TableHead>{t('expiryDate')}</TableHead>
									<TableHead>{t('amount')}</TableHead>
									<TableHead>{t('serviceCycle')}</TableHead>
									<TableHead>{t('status')}</TableHead>
									<TableHead className="text-right">{t('actions')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{visibleContracts.map((contract) => (
									<TableRow key={contract.id}>
										<TableCell className="font-mono font-bold">{contract.id}</TableCell>
										<TableCell>
											<div className="font-medium">{getUserName(contract.customerId)}</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{contract.elevatorIds.map((eid) => (
													<Badge
														key={eid}
														variant="outline"
														className="cursor-pointer hover:bg-primary/10 transition-colors"
														onClick={navigateToElevator}
													>
														{getElevatorName(eid)}
													</Badge>
												))}
											</div>
										</TableCell>
										<TableCell>{formatDate(contract.signDate)}</TableCell>
										<TableCell>{formatDate(contract.expiryDate)}</TableCell>
										<TableCell className="font-semibold">{formatCurrency(contract.amount)}</TableCell>
										<TableCell>{serviceCycleLabel(contract.serviceCycle)}</TableCell>
										<TableCell>{statusBadge(contract.status)}</TableCell>
										<TableCell className="text-right space-x-1">
											<Button variant="ghost" size="icon" onClick={() => navigate({ to: `/contract/${contract.id}` })}>
												<Eye className="w-4 h-4 text-primary" />
											</Button>
											{isAdmin && (
												<>
													<Button variant="ghost" size="icon" onClick={() => openEditDialog(contract)}>
														<Edit className="w-4 h-4 text-blue-600" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => handleDeleteContract(contract.id)}>
														<Trash2 className="w-4 h-4 text-red-600" />
													</Button>
												</>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			<EditContractDialog
				contract={editingContract}
				onClose={() => {
					setEditingContract(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				selectedElevatorId={selectedElevatorId}
				setSelectedElevatorId={setSelectedElevatorId}
				allUsers={allUsers}
				allElevators={allElevators}
				isAdmin={isAdmin}
				getElevatorName={getElevatorName}
				onSubmit={handleUpdateContract}
			/>
		</div>
	)
}

export default ContractList
