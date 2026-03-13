import { useNavigate } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	getIncidentPriorityBadgeVariant,
	getPriorityLabel,
	getStatusLabel,
} from '@/features/incident/helpers/status-transition'
import { useIncident } from '@/hooks/api/useIncident'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'

interface IncidentDetailProps {
	incidentId: string
}

export function IncidentDetail({ incidentId }: IncidentDetailProps) {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: incident, isLoading } = useIncident(incidentId)

	return (
		<Dialog open={true} onOpenChange={(open) => !open && navigate({ to: '/incident' })}>
			<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('incidents')}</DialogTitle>
					<DialogDescription>{t('incidentDetailDesc')}</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="grid gap-4 py-8">
						<div className="flex flex-col items-center justify-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
							<p className="text-sm text-muted-foreground">{t('loadingIncidents')}</p>
						</div>
					</div>
				) : !incident ? (
					<div className="grid gap-4 py-8">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">{t('incidentNotFound')}</p>
						</div>
					</div>
				) : (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('elevator')}</Label>
								<div>
									<Button
										variant="link"
										className="h-auto p-0 font-semibold"
										onClick={() => navigate({ to: `/elevator/${incident.elevatorId}` })}
									>
										{incident.elevator.code}
									</Button>
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('building')}</Label>
								<p>{incident.elevator.address || t('notAvailable')}</p>
							</div>
						</div>

						<div className="space-y-1">
							<Label className="text-muted-foreground text-xs">{t('description')}</Label>
							<p className="text-sm leading-6">{incident.description || '-'}</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('priority')}</Label>
								<div>
									<Badge variant={getIncidentPriorityBadgeVariant(incident.priority)}>
										{getPriorityLabel(incident.priority, t)}
									</Badge>
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('status')}</Label>
								<div>
									<Badge variant="outline">{getStatusLabel(incident.status, t)}</Badge>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('createdAt')}</Label>
								<p>{formatDisplayDate(incident.createdAt)}</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('lastUpdated')}</Label>
								<p>{formatDisplayDate(incident.updatedAt)}</p>
							</div>
						</div>
					</div>
				)}

				<DialogFooter>
					<Button onClick={() => navigate({ to: '/incident' })}>{t('close')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
