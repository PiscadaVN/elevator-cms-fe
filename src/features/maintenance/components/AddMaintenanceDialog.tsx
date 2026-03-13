import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, MaintenanceFormData } from '@/types/api'
import { toDateInputValue } from '@/lib/date-utils'

interface AddMaintenanceDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: MaintenanceFormData
	setFormData: (data: MaintenanceFormData) => void
	elevators: Elevator[]
	onSubmit: () => void
	isPending?: boolean
}

export function AddMaintenanceDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	elevators,
	onSubmit,
	isPending,
}: AddMaintenanceDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" /> {t('addMaintenance')}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addMaintenance')}</DialogTitle>
					<DialogDescription>{t('createMaintenanceDesc')}</DialogDescription>
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
						{isPending ? t('creating') : t('confirmAdd')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
