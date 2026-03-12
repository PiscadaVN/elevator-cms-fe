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
	getNextIncidentStatuses,
	getPriorityLabel,
	getStatusLabel,
	IncidentPriorityEnum,
	IncidentStatusEnum,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentFormData, IncidentStatus } from '@/types/api'

interface EditIncidentDialogProps {
	incident: Incident | null
	onClose: () => void
	formData: IncidentFormData
	setFormData: (data: IncidentFormData) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditIncidentDialog({
	incident,
	onClose,
	formData,
	setFormData,
	onSubmit,
	isPending,
}: EditIncidentDialogProps) {
	const { t } = useLanguage()

	const nextStatuses = getNextIncidentStatuses(incident?.status ?? IncidentStatusEnum.NEW)

	return (
		<Dialog open={!!incident} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')} {t('incidents').toLowerCase()}
					</DialogTitle>
					<DialogDescription>{t('updateIncidentDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('description')}</Label>
						<Input
							value={formData.description ?? ''}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('priority')}</Label>
						<Select
							value={formData.priority.toString()}
							onValueChange={(v) => setFormData({ ...formData, priority: Number(v) })}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(IncidentPriorityEnum).map((priority) => (
									<SelectItem key={priority} value={priority.toString()}>
										{getPriorityLabel(priority, t)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t('status')}</Label>
						<Select
							value={formData.status}
							onValueChange={(v) => setFormData({ ...formData, status: v as IncidentStatus })}
							disabled={nextStatuses.length === 1}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{nextStatuses.map((status) => (
									<SelectItem key={status} value={status}>
										{getStatusLabel(status, t)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? 'Saving...' : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
