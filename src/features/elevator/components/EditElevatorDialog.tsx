import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import type { Elevator, ElevatorStatus } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCallback, useState } from 'react'
import { useUpdateElevator, useUsers } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import type { ElevatorUpdate } from '@/types/api'

import { mapLocalStatusToApi } from '../helper/utils'

interface EditElevatorDialogProps {
	isOpen: boolean
	onClose: () => void
	elevator: Elevator
}

export function EditElevatorDialog({ isOpen, onClose, elevator }: EditElevatorDialogProps) {
	const { t } = useLanguage()

	const { data: operators } = useUsers()
	const updateMutation = useUpdateElevator()

	const [formData, setFormData] = useState<Partial<Elevator>>({
		name: '',
		building: '',
		floorRange: '',
		status: 'available',
		maintenanceDate: new Date().toISOString().split('T')[0],
		assignedUserId: null,
		maintenanceCycle: '1m',
		startDate: new Date().toISOString().split('T')[0],
	})

	const resetForm = useCallback(() => {
		setFormData({
			name: '',
			building: '',
			floorRange: '',
			status: 'available',
			maintenanceDate: new Date().toISOString().split('T')[0],
			assignedUserId: null,
			maintenanceCycle: '1m',
			startDate: new Date().toISOString().split('T')[0],
		})
	}, [])

	const handleUpdateElevator = async () => {
		try {
			const updateData: ElevatorUpdate = {
				status: formData.status ? mapLocalStatusToApi(formData.status as ElevatorStatus) : undefined,
				maintenance_cycle_months: formData.maintenanceCycle
					? Number.parseInt(formData.maintenanceCycle.replace('m', ''))
					: undefined,
			}

			await updateMutation.mutateAsync({ elevatorId: elevator.id, data: updateData })
			onClose()
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateElevator'))
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {elevator.name}
					</DialogTitle>
					<DialogDescription>{t('elevatorOverviewDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('startDate')}</Label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) =>
									setFormData({
										...formData,
										startDate: e.target.value,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t('maintenanceCycle')}</Label>
							<Select
								value={formData.maintenanceCycle}
								onValueChange={(v) =>
									setFormData({
										...formData,
										maintenanceCycle: v as Elevator['maintenanceCycle'],
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1m">{t('months_1')}</SelectItem>
									<SelectItem value="2m">{t('months_2')}</SelectItem>
									<SelectItem value="3m">{t('months_3')}</SelectItem>
									<SelectItem value="6m">{t('months_6')}</SelectItem>
									<SelectItem value="12m">{t('months_12')}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('status')}</Label>
							<Select
								value={formData.status}
								onValueChange={(v) =>
									setFormData({
										...formData,
										status: v as ElevatorStatus,
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="available">{t('available')}</SelectItem>
									<SelectItem value="maintenance">{t('maintenance')}</SelectItem>
									<SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>{t('assignedTo')}</Label>
							<Select
								value={formData.assignedUserId || 'none'}
								onValueChange={(v) =>
									setFormData({
										...formData,
										assignedUserId: v === 'none' ? null : v,
									})
								}
							>
								<SelectTrigger>
									<SelectValue placeholder={t('unassigned')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">{t('unassigned')}</SelectItem>
									{operators?.map((op) => (
										<SelectItem key={op.id} value={op.id}>
											{op.full_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleUpdateElevator} disabled={updateMutation.isPending}>
						{updateMutation.isPending ? 'Saving...' : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
