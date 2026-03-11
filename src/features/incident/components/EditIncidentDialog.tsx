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
import { getNextIncidentStatuses } from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentPriority, IncidentStatus, UserRole } from '@/types'

interface EditIncidentDialogProps {
	incident: Incident | null
	currentUserRole?: UserRole | null
	onClose: () => void
	formData: Partial<Incident>
	setFormData: (data: Partial<Incident>) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditIncidentDialog({
	incident,
	currentUserRole,
	onClose,
	formData,
	setFormData,
	onSubmit,
	isPending,
}: EditIncidentDialogProps) {
	const { t } = useLanguage()

	const baseStatus = incident?.status ?? 'new'
	const allowedStatuses = [baseStatus, ...getNextIncidentStatuses(baseStatus, currentUserRole)].filter(
		(status, index, arr) => arr.indexOf(status) === index,
	)

	const getStatusLabel = (status: IncidentStatus) => {
		switch (status) {
			case 'new':
				return t('new')
			case 'in_progress':
				return t('inProgress')
			case 'pending_approval':
				return t('pendingApproval')
			case 'completed':
				return t('completed')
			case 'rejected':
				return t('rejected')
		}
	}

	return (
		<Dialog open={!!incident} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {incident?.id}
					</DialogTitle>
					<DialogDescription>{t('updateIncidentDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('description')}</Label>
						<Input
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('priority')}</Label>
						<Select
							value={formData.priority}
							onValueChange={(v) => setFormData({ ...formData, priority: v as IncidentPriority })}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">{t('low')}</SelectItem>
								<SelectItem value="medium">{t('medium')}</SelectItem>
								<SelectItem value="high">{t('high')}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t('status')}</Label>
						<Select
							value={formData.status}
							onValueChange={(v) => setFormData({ ...formData, status: v as IncidentStatus })}
						>
							<SelectTrigger disabled={allowedStatuses.length <= 1}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{allowedStatuses.map((status) => (
									<SelectItem key={status} value={status}>
										{getStatusLabel(status)}
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
