import { Edit, Eye, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	getIncidentPriorityBadgeVariant,
	getNextIncidentStatuses,
	getPriorityLabel,
	getStatusLabel,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import type { Incident, IncidentStatus } from '@/types/api'

interface IncidentTableProps {
	incidents: Incident[]
	isLoading: boolean
	onView: (id: string) => void
	onEdit: (incident: Incident) => void
	onDelete: (id: string) => void
	onUpdateStatus: (id: string, status: IncidentStatus) => void
}

export function IncidentTable({ incidents, isLoading, onView, onEdit, onDelete, onUpdateStatus }: IncidentTableProps) {
	const { t } = useLanguage()

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

								<TableHead className="text-center">{t('priority')}</TableHead>

								<TableHead>{t('createdAt')}</TableHead>

								<TableHead>{t('status')}</TableHead>

								<TableHead className="text-center">{t('lastUpdated')}</TableHead>

								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{incidents.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
										{t('noIncidentsFound')}
									</TableCell>
								</TableRow>
							) : (
								incidents.map((incident) => {
									const nextStatuses = getNextIncidentStatuses(incident.status)

									return (
										<TableRow key={incident.id}>
											<TableCell className="font-bold">{incident.elevator.code}</TableCell>

											<TableCell className="max-w-xs truncate">{incident.description}</TableCell>

											<TableCell className="text-center">
												<Badge variant={getIncidentPriorityBadgeVariant(incident.priority)}>
													{getPriorityLabel(incident.priority, t)}
												</Badge>
											</TableCell>

											<TableCell className="text-xs text-muted-foreground">
												{formatDisplayDate(incident.createdAt)}
											</TableCell>

											<TableCell>
												<Select
													value={incident.status}
													onValueChange={(value) => onUpdateStatus(incident.id, value as IncidentStatus)}
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
											</TableCell>

											<TableCell className="text-center">{formatDisplayDate(incident.updatedAt)}</TableCell>

											<TableCell className="text-right space-x-2">
												<div className="flex items-center justify-end gap-2">
													<Button variant="ghost" size="icon" onClick={() => onView(incident.id)}>
														<Eye className="w-4 h-4 text-primary" />
													</Button>

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
