import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
	getMaintenanceStatusLabel,
	getNextMaintenanceStatuses,
	MaintenanceStatusEnum,
} from '@/features/maintenance/helpers/status'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, MaintenanceFormData, MaintenanceSchedule, MaintenanceStatus } from '@/types/api'
import { toDateInputValue } from '@/lib/date-utils'

interface EditMaintenanceDialogProps {
	schedule: MaintenanceSchedule | null
	onClose: () => void
	formData: MaintenanceFormData
	setFormData: (data: MaintenanceFormData) => void
	elevators: Elevator[]
	onSubmit: () => void
	isPending?: boolean
}

export function EditMaintenanceDialog({
	schedule,
	onClose,
	formData,
	setFormData,
	elevators,
	onSubmit,
	isPending,
}: EditMaintenanceDialogProps) {
	const { t } = useLanguage()

	const nextStatuses = getNextMaintenanceStatuses(schedule?.status ?? MaintenanceStatusEnum.SCHEDULED)

	return (
		<Dialog open={!!schedule} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')} {t('maintenance').toLowerCase()}
					</DialogTitle>
					<DialogDescription>{t('updateMaintenanceDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevator')}</Label>
						<Select
							value={formData.elevatorId}
							onValueChange={(value) => setFormData({ ...formData, elevatorId: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((elevator) => (
									<SelectItem key={elevator.id} value={elevator.id}>
										{elevator.code} - {elevator.address ?? t('notAvailable')}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('scheduledAt')}</Label>
						<Input
							type="date"
							value={toDateInputValue(formData.scheduledStartAt)}
							onChange={(e) =>
								setFormData({
									...formData,
									scheduledStartAt: e.target.value ? new Date(e.target.value).getTime() / 1000 : undefined,
								})
							}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t('status')}</Label>
						<Select
							value={formData.status}
							onValueChange={(value) => setFormData({ ...formData, status: value as MaintenanceStatus })}
							disabled={nextStatuses.length === 1}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{nextStatuses.map((status) => (
									<SelectItem key={status} value={status}>
										{getMaintenanceStatusLabel(status, t)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('note')}</Label>
						<Input
							value={formData.notes}
							onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
							placeholder={t('maintenanceNotesPlaceholder')}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? t('saving') : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
