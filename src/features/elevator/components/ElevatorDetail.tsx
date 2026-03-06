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
import { INITIAL_ELEVATORS } from '@/features/elevator/components/ElevatorDashboard'
import type { Elevator, User } from '@/types'

interface ElevatorDetailProps {
	elevatorId: string
}

export function ElevatorDetail({ elevatorId }: ElevatorDetailProps) {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const elevators = useMemo<Elevator[]>(() => {
		try {
			const stored = localStorage.getItem('elevator_data')
			return stored ? JSON.parse(stored) : INITIAL_ELEVATORS
		} catch {
			return INITIAL_ELEVATORS
		}
	}, [])

	const mockUsers = useMemo<User[]>(() => {
		try {
			return JSON.parse(localStorage.getItem('elevator_users_db') || '[]')
		} catch {
			return []
		}
	}, [])

	const elevatorDetail = elevators.find((e) => e.id === elevatorId)

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
						{t('elevator')}: {elevatorDetail?.id}
					</DialogTitle>
					<DialogDescription>{t('elevatorOverview')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<Label className="text-muted-foreground text-xs">ID</Label>
							<p className="font-bold">{elevatorDetail?.id}</p>
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
										{mockUsers.find((u) => u.id === elevatorDetail.assignedUserId)?.name ||
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
				<DialogFooter>
					<Button onClick={() => navigate({ to: '/elevator' })}>{t('close')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
