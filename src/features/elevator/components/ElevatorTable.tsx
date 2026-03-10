import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n/LanguageContext'
import { isAdmin, isViewer } from '@/lib/role-utils'
import type { Elevator, UserRole } from '@/types'
import type { User as ApiUser } from '@/types/api'
import { CheckCircle2, Edit, Eye, Trash2 } from 'lucide-react'

const getMaintenanceBadge = (status: string, t: (key: string) => string) => {
	switch (status) {
		case 'overdue':
			return (
				<Badge variant="destructive" className="ml-2">
					{t('overdue')}
				</Badge>
			)
		case 'due_soon':
			return (
				<Badge variant="warning" className="ml-2">
					{t('dueSoon')}
				</Badge>
			)
		default:
			return (
				<Badge variant="outline" className="ml-2 text-green-600 border-green-200">
					{t('normal')}
				</Badge>
			)
	}
}

interface ElevatorTableProps {
	elevators: Elevator[]
	operators?: ApiUser[]
	userRole?: UserRole
	userId?: string
	isLoading: boolean
	onCompleteMaintenance: (id: string) => void
	onEdit: (elevator: Elevator) => void
	onView: (id: string) => void
	onDelete: (id: string) => void
	isDeleting: boolean
}

export function ElevatorTable({
	elevators,
	operators,
	userRole,
	userId,
	isLoading,
	onCompleteMaintenance,
	onEdit,
	onView,
	onDelete,
	isDeleting,
}: ElevatorTableProps) {
	const { t } = useLanguage()

	return (
		<Card>
			<CardHeader className="flex gap-1.5">
				<CardTitle>{t('elevatorOverview')}</CardTitle>
				<CardDescription>{t('elevatorOverviewDesc')}</CardDescription>
			</CardHeader>

			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingElevators')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left">{t('elevatorName')}</TableHead>
								<TableHead className="text-left">{t('building')}</TableHead>
								<TableHead className="text-center">{t('floors')}</TableHead>
								<TableHead className="text-right">{t('maintenanceDate')}</TableHead>
								<TableHead className="text-center">{t('assignedTo')}</TableHead>
								<TableHead className="text-center">{t('status')}</TableHead>
								<TableHead className="text-right">{t('lastUpdated')}</TableHead>
								{!isViewer(userRole) && <TableHead className="text-right">{t('actions')}</TableHead>}
							</TableRow>
						</TableHeader>

						<TableBody>
							{elevators.map((elevator) => (
								<TableRow key={elevator.id}>
									<TableCell className="font-bold text-left">{elevator.name}</TableCell>
									<TableCell className="text-left">{elevator.building}</TableCell>
									<TableCell className="text-center">{elevator.floorRange}</TableCell>
									<TableCell className="text-right">
										<div className="flex flex-col items-end">
											<span className="text-xs">{elevator.maintenanceDate}</span>
											{elevator.maintenanceCycle && (
												<span className="text-[10px] text-muted-foreground uppercase italic">
													Cycle: {t(`months_${elevator.maintenanceCycle.replace('m', '')}`)}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell className="text-center">
										{elevator.assignedUserId ? (
											<Badge variant="outline" className="text-[10px] bg-slate-50">
												{operators?.find((u) => u.id === elevator.assignedUserId)?.full_name || elevator.assignedUserId}
											</Badge>
										) : (
											<span className="text-xs text-muted-foreground italic">{t('unassigned')}</span>
										)}
									</TableCell>
									<TableCell className="text-center">{getMaintenanceBadge(elevator.status, t)}</TableCell>
									<TableCell className="text-muted-foreground text-right">{elevator.lastUpdated}</TableCell>

									{!isViewer(userRole) && (
										<TableCell className="text-right space-x-2">
											{(isAdmin(userRole) || userId === elevator.assignedUserId) && (
												<Button
													variant="ghost"
													size="icon"
													onClick={() => onCompleteMaintenance(elevator.id)}
													title={t('updateCompletion')}
												>
													<CheckCircle2 className="w-4 h-4 text-green-600" />
												</Button>
											)}

											<Button variant="ghost" size="icon" onClick={() => onEdit(elevator)}>
												<Edit className="w-4 h-4 text-blue-600" />
											</Button>

											<Button variant="ghost" size="icon" onClick={() => onView(elevator.id)}>
												<Eye className="w-4 h-4 text-primary" />
											</Button>

											{isAdmin(userRole) && (
												<Button variant="ghost" size="icon" onClick={() => onDelete(elevator.id)} disabled={isDeleting}>
													<Trash2 className="w-4 h-4 text-red-600" />
												</Button>
											)}
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
