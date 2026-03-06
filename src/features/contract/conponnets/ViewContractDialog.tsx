import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { INITIAL_ELEVATORS } from '@/features/elevator/components/ElevatorDashboard'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, ContractStatus, Elevator, User } from '@/types'

interface ViewContractDialogProps {
	contractId: string
}

export function ViewContractDialog({ contractId }: ViewContractDialogProps) {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const contracts = useMemo<Contract[]>(() => {
		try {
			const stored = localStorage.getItem('elevator_contracts_db')
			return stored ? JSON.parse(stored) : []
		} catch {
			return []
		}
	}, [])

	const allUsers = useMemo<User[]>(() => {
		try {
			return JSON.parse(localStorage.getItem('elevator_users_db') || '[]')
		} catch {
			return []
		}
	}, [])

	const allElevators = useMemo<Elevator[]>(() => {
		try {
			const stored = localStorage.getItem('elevator_data')
			return stored ? JSON.parse(stored) : INITIAL_ELEVATORS
		} catch {
			return INITIAL_ELEVATORS
		}
	}, [])

	const contract = contracts.find((c) => c.id === contractId)

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

	return (
		<Dialog open={!!contractId} onOpenChange={(open) => !open && navigate({ to: '/contract' })}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{t('contracts')}: {contract?.id}
					</DialogTitle>
					<DialogDescription>{t('contractManagementDesc')}</DialogDescription>
				</DialogHeader>
				{contract && (
					<div className="space-y-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">{t('customer')}</p>
								<p className="font-semibold">{getUserName(contract.customerId)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">{t('contractStatus')}</p>
								{statusBadge(contract.status)}
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">{t('signDate')}</p>
								<p className="font-semibold">{formatDate(contract.signDate)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">{t('expiryDate')}</p>
								<p className="font-semibold">{formatDate(contract.expiryDate)}</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">{t('amount')}</p>
								<p className="font-semibold text-lg">{formatCurrency(contract.amount)}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">{t('serviceCycle')}</p>
								<p className="font-semibold">{serviceCycleLabel(contract.serviceCycle)}</p>
							</div>
						</div>
						<div>
							<p className="text-sm text-muted-foreground mb-2">{t('linkedElevators')}</p>
							<div className="flex flex-wrap gap-2">
								{contract.elevatorIds.map((eid) => (
									<Badge
										key={eid}
										variant="outline"
										className="cursor-pointer hover:bg-primary/10 transition-colors text-sm px-3 py-1"
										onClick={() => navigate({ to: `/elevator/${eid}` })}
									>
										{getElevatorName(eid)} →
									</Badge>
								))}
							</div>
						</div>
						{contract.note && (
							<div>
								<p className="text-sm text-muted-foreground">{t('note')}</p>
								<p>{contract.note}</p>
							</div>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
