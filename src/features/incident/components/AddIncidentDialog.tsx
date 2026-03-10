import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, Incident, IncidentPriority } from '@/types'

interface AddIncidentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: Partial<Incident>
	setFormData: (data: Partial<Incident>) => void
	elevators: Pick<Elevator, 'id' | 'building'>[]
	onSubmit: () => void
	isPending?: boolean
}

export function AddIncidentDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	elevators,
	onSubmit,
	isPending,
}: AddIncidentDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" /> {t('reportIncident')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('reportIncident')}</DialogTitle>
					<DialogDescription>{t('createIncidentDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevator')}</Label>
						<Select value={formData.elevatorId} onValueChange={(v) => setFormData({ ...formData, elevatorId: v })}>
							<SelectTrigger>
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((el) => (
									<SelectItem key={el.id} value={el.id}>
										{el.id} - {el.building}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t('description')}</Label>
						<Input
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							placeholder={t('describeProblemPlaceholder')}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('priority')}</Label>
						<Select
							value={formData.priority}
							onValueChange={(v) =>
								setFormData({
									...formData,
									priority: v as IncidentPriority,
								})
							}
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
