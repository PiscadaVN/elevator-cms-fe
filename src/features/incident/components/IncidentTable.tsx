import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getNextIncidentStatuses } from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentPriority, IncidentStatus, UserRole } from '@/types'
import { AlertCircle, CheckCircle2, Clock, Edit, Trash2, XCircle } from 'lucide-react'

interface IncidentTableProps {
	incidents: Incident[]
	isLoading: boolean
	currentUserRole?: UserRole | null
	onEdit: (incident: Incident) => void
	onDelete: (id: string) => void
	onUpdateStatus: (id: string, status: IncidentStatus) => void
}

export function IncidentTable({
	incidents,
	isLoading,
	currentUserRole,
	onEdit,
	onDelete,
	onUpdateStatus,
}: IncidentTableProps) {
	const { t } = useLanguage()

	const getPriorityBadge = (priority: IncidentPriority) => {
		switch (priority) {
			case 'high':
				return <Badge variant="destructive">{t('high')}</Badge>
			case 'medium':
				return <Badge variant="warning">{t('medium')}</Badge>
			case 'low':
				return <Badge variant="outline">{t('low')}</Badge>
		}
	}

	const getStatusIcon = (status: IncidentStatus) => {
		switch (status) {
			case 'new':
				return <AlertCircle className="w-4 h-4 text-blue-500" />
			case 'in_progress':
				return <Clock className="w-4 h-4 text-yellow-500" />
			case 'pending_approval':
				return <Clock className="w-4 h-4 text-orange-500" />
			case 'completed':
				return <CheckCircle2 className="w-4 h-4 text-green-500" />
			case 'rejected':
				return <XCircle className="w-4 h-4 text-red-500" />
		}
	}

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
		<Card>
			<CardHeader>
				<CardTitle>{t('incidents')}</CardTitle>
				<CardDescription>{t('incidentListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingIncidents')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('elevator')}</TableHead>
								<TableHead>{t('description')}</TableHead>
								<TableHead>{t('priority')}</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead>{t('createdAt')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{incidents.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
										{t('noIncidentsReported')}
									</TableCell>
								</TableRow>
							) : (
								incidents.map((incident) => {
									const allowedNextStatuses = getNextIncidentStatuses(incident.status, currentUserRole)
									const selectableStatuses = [incident.status, ...allowedNextStatuses].filter(
										(status, index, arr) => arr.indexOf(status) === index,
									)

									return (
										<TableRow key={incident.id}>
											<TableCell className="font-bold">{incident.elevatorId}</TableCell>
											<TableCell className="max-w-xs truncate">{incident.description}</TableCell>
											<TableCell>{getPriorityBadge(incident.priority)}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{getStatusIcon(incident.status)}
													<span className="capitalize text-sm">{getStatusLabel(incident.status)}</span>
												</div>
											</TableCell>
											<TableCell className="text-xs text-muted-foreground">
												{new Date(incident.createdAt).toLocaleString()}
											</TableCell>
											<TableCell className="text-right space-x-2">
												<div className="flex items-center justify-end gap-2">
													<Select
														value={incident.status}
														onValueChange={(v) => onUpdateStatus(incident.id, v as IncidentStatus)}
													>
														<SelectTrigger className="w-36" disabled={allowedNextStatuses.length === 0}>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{selectableStatuses.map((status) => (
																<SelectItem key={`${incident.id}-${status}`} value={status}>
																	{getStatusLabel(status)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>

													<Button variant="ghost" size="icon" onClick={() => onEdit(incident)}>
														<Edit className="w-4 h-4 text-blue-600" />
													</Button>

													<Button variant="ghost" size="icon" onClick={() => onDelete(incident.id)}>
														<Trash2 className="w-4 h-4 text-red-600" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
