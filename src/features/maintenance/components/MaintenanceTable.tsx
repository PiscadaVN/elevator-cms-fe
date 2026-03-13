import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	canTransitionMaintenanceStatus,
	getMaintenanceStatusLabel,
	getNextMaintenanceStatuses,
} from '@/features/maintenance/helpers/status'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import type { MaintenanceSchedule, MaintenanceStatus } from '@/types/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateMaintenanceSchedule } from '@/hooks/api'

interface MaintenanceTableProps {
	schedules: MaintenanceSchedule[]
	isLoading: boolean
	onEdit: (schedule: MaintenanceSchedule) => void
	onDelete: (id: string) => void
}

export function MaintenanceTable({ schedules, isLoading, onEdit, onDelete }: MaintenanceTableProps) {
	const { t } = useLanguage()

	const updateMutation = useUpdateMaintenanceSchedule()

	const handleUpdateStatus = async (id: string, status: MaintenanceStatus) => {
		try {
			const schedule = schedules.find((item) => item.id === id)
			if (!schedule) {
				return
			}

			if (!canTransitionMaintenanceStatus(schedule.status as MaintenanceStatus, status)) {
				alert(t('invalidMaintenanceStatusTransition'))
				return
			}

			await updateMutation.mutateAsync({
				scheduleId: id,
				data: { ...schedule, status },
			})
		} catch (_error) {
			alert(t('failedToUpdateStatus'))
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('maintenance')}</CardTitle>
				<CardDescription>{t('maintenanceListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingMaintenanceSchedules')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('elevator')}</TableHead>

								<TableHead>{t('scheduledAt')}</TableHead>

								<TableHead>{t('lastUpdated')}</TableHead>

								<TableHead>{t('assignedOperator')}</TableHead>

								<TableHead>{t('status')}</TableHead>

								<TableHead>{t('note')}</TableHead>

								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{schedules.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
										{t('noMaintenanceSchedulesFound')}
									</TableCell>
								</TableRow>
							) : (
								schedules.map((schedule) => {
									const nextStatuses = getNextMaintenanceStatuses(schedule.status)

									return (
										<TableRow key={schedule.id}>
											<TableCell className="font-bold">{schedule.elevator?.code ?? t('notAvailable')}</TableCell>

											<TableCell>{formatDisplayDate(schedule.scheduledStartAt)}</TableCell>

											<TableCell>{formatDisplayDate(schedule.updatedAt)}</TableCell>

											<TableCell>{schedule.assignedOperator?.fullName ?? t('unassigned')}</TableCell>

											<TableCell>
												<Select
													value={schedule.status}
													onValueChange={(value) => handleUpdateStatus(schedule.id, value as MaintenanceStatus)}
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
											</TableCell>

											<TableCell className="max-w-xs truncate">{schedule.notes || t('notAvailable')}</TableCell>

											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													<Button variant="ghost" size="icon" onClick={() => onEdit(schedule)}>
														<Edit className="w-4 h-4 text-blue-600" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => onDelete(schedule.id)}>
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
