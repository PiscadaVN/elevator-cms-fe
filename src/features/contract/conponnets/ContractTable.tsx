import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n/LanguageContext'
import type { ContractStatus } from '@/types'
import { Edit, Eye, Trash2 } from 'lucide-react'

interface LocalContract {
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

interface ContractTableProps {
	contracts: LocalContract[]
	isAdmin: boolean
	getUserName: (userId: string) => string
	getElevatorName: (elevatorId: string) => string
	onView: (contractId: string) => void
	onEdit: (contract: LocalContract) => void
	onDelete: (contractId: string) => void
	onElevatorClick: () => void
	isDeleting?: boolean
}

export function ContractTable({
	contracts,
	isAdmin,
	getUserName,
	getElevatorName,
	onView,
	onEdit,
	onDelete,
	onElevatorClick,
	isDeleting = false,
}: ContractTableProps) {
	const { t } = useLanguage()

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
		<Card>
			<CardHeader>
				<CardTitle>{isAdmin ? t('allContracts') : t('myContracts')}</CardTitle>
				<CardDescription>{t('contractListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{contracts.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">{t('noContractsFound')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
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
							{contracts.map((contract) => (
								<TableRow key={contract.id}>
									<TableCell>
										<div className="font-medium">{getUserName(contract.customerId)}</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{contract.elevatorIds.map((eid: string) => (
												<Badge
													key={eid}
													variant="outline"
													className="cursor-pointer hover:bg-primary/10 transition-colors"
													onClick={onElevatorClick}
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
										<Button variant="ghost" size="icon" onClick={() => onView(contract.id)}>
											<Eye className="w-4 h-4 text-primary" />
										</Button>
										{isAdmin && (
											<>
												<Button variant="ghost" size="icon" onClick={() => onEdit(contract)}>
													<Edit className="w-4 h-4 text-blue-600" />
												</Button>
												<Button variant="ghost" size="icon" onClick={() => onDelete(contract.id)} disabled={isDeleting}>
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
	)
}
