import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, ContractStatus } from '@/types'

interface ViewContractDialogProps {
	contract: Contract | null
	onClose: () => void
	getUserName: (id: string) => string
	getElevatorName: (id: string) => string
	formatCurrency: (amount: number) => string
	formatDate: (dateStr: string) => string
	serviceCycleLabel: (cycle: string) => string
	onElevatorClick: () => void
}

export function ViewContractDialog({
	contract,
	onClose,
	getUserName,
	getElevatorName,
	formatCurrency,
	formatDate,
	serviceCycleLabel,
	onElevatorClick,
}: ViewContractDialogProps) {
	const { t } = useLanguage()

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
		<Dialog open={!!contract} onOpenChange={(open) => !open && onClose()}>
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
										onClick={onElevatorClick}
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
