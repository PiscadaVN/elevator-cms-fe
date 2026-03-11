import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator } from '@/types'
import { useElevator } from '@/hooks/api/useElevator'
import { useUsers } from '@/hooks/api/useUser'

import { mapApiStatusToLocal } from '../helper/utils'

interface ElevatorDetailProps {
	elevatorId: string
}

export function ElevatorDetail({ elevatorId }: ElevatorDetailProps) {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: apiElevator, isLoading: loadingElevator } = useElevator(elevatorId)
	const { data: apiUsers } = useUsers()

	const elevatorDetail = useMemo(() => {
		if (!apiElevator) return null

		return {
			id: apiElevator.id,
			name: apiElevator.name || apiElevator.elevator_code,
			building: apiElevator.address || 'N/A',
			floorRange: `${apiElevator.min_floor || 1}-${apiElevator.max_floor || 20}`,
			status: mapApiStatusToLocal(apiElevator.status),
			lastUpdated: new Date().toLocaleTimeString(),
			maintenanceDate: apiElevator.installation_at
				? new Date(apiElevator.installation_at * 1000).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0],
			maintenanceCycle: '1m', // You can add this to API if needed
			assignedUserId: null, // You can add this to API if needed
		} as Elevator
	}, [apiElevator])

	const getStatusBadge = (status: Elevator['status']) => {
		switch (status) {
			case 'available':
				return <Badge variant="success">{t('available')}</Badge>
			case 'maintenance':
				return <Badge variant="warning">{t('maintenance')}</Badge>
			case 'out_of_order':
				return <Badge variant="destructive">{t('outOfOrder')}</Badge>
		}
	}

	const getMaintenanceStatus = (date: string) => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const maintenanceDate = new Date(date)
		maintenanceDate.setHours(0, 0, 0, 0)

		const diffTime = maintenanceDate.getTime() - today.getTime()
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		if (diffDays < 0) return 'overdue'
		if (diffDays <= 7) return 'due_soon'
		return 'normal'
	}

	const getMaintenanceBadge = (date: string) => {
		const status = getMaintenanceStatus(date)
		switch (status) {
			case 'overdue':
				return <Badge variant="destructive">{t('overdue')}</Badge>
			case 'due_soon':
				return <Badge variant="warning">{t('dueSoon')}</Badge>
			default:
				return (
					<Badge variant="outline" className="text-green-600 border-green-200">
						{t('normal')}
					</Badge>
				)
		}
	}

	return (
		<Dialog open={true} onOpenChange={() => navigate({ to: '/elevator' })}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('elevator')}: {elevatorDetail?.name}
					</DialogTitle>
					<DialogDescription>{t('elevatorOverview')}</DialogDescription>
				</DialogHeader>

				{loadingElevator ? (
					<div className="grid gap-4 py-8">
						<div className="flex flex-col items-center justify-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
							<p className="text-sm text-muted-foreground">{t('loadingElevators')}</p>
						</div>
					</div>
				) : !elevatorDetail ? (
					<div className="grid gap-4 py-8">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">{t('elevatorNotFound')}</p>
						</div>
					</div>
				) : (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('elevator')}</Label>
								<p className="font-bold">{elevatorDetail?.name}</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('building')}</Label>
								<p>{elevatorDetail?.building}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('floors')}</Label>
								<p>{elevatorDetail?.floorRange}</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('status')}</Label>
								<div>{elevatorDetail ? getStatusBadge(elevatorDetail.status) : '-'}</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('maintenance')}</Label>
								<div className="flex flex-col gap-1">
									<span className="text-sm">{elevatorDetail?.maintenanceDate}</span>
									{elevatorDetail?.maintenanceDate && getMaintenanceBadge(elevatorDetail.maintenanceDate)}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('maintenanceCycle')}</Label>
								<p>
									{elevatorDetail?.maintenanceCycle
										? t(`months_${elevatorDetail.maintenanceCycle.replace('m', '')}`)
										: '-'}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('assignedTo')}</Label>
								<div>
									{elevatorDetail?.assignedUserId ? (
										<Badge variant="outline" className="text-[10px] bg-slate-50">
											{apiUsers?.find((u) => u.id === elevatorDetail.assignedUserId)?.full_name ||
												elevatorDetail.assignedUserId}
										</Badge>
									) : (
										<span className="text-sm text-muted-foreground italic">{t('unassigned')}</span>
									)}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('lastUpdated')}</Label>
								<p className="text-muted-foreground">{elevatorDetail?.lastUpdated}</p>
							</div>
						</div>
					</div>
				)}
				<DialogFooter>
					<Button onClick={() => navigate({ to: '/elevator' })}>{t('close')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
