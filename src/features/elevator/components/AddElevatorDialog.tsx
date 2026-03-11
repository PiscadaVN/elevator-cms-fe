import { useCallback, useState } from 'react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Elevator, ElevatorStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageContext'
import { useCreateElevator, useUsers } from '@/hooks/api'
import type { ElevatorCreate } from '@/types/api'

import { mapLocalStatusToApi } from '../helper/utils'

interface AddElevatorDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function AddElevatorDialog({ isOpen, onClose }: AddElevatorDialogProps) {
	const { t } = useLanguage()

	const { data: operators } = useUsers()
	const createMutation = useCreateElevator()

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

	const handleAddElevator = useCallback(async () => {
		if (!formData.name) return

		try {
			const randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
			const floorRangeParts = (formData.floorRange || '1-10').split('-')
			const minFloor = Number(floorRangeParts[0])
			const maxFloor = Number(floorRangeParts[1])

			const currentTime = Math.floor(Date.now() / 1000)

			const newElevatorData: ElevatorCreate = {
				elevator_code: `E${randomId}`,
				name: formData.name,
				address: formData.building || 'Tower A',
				min_floor: minFloor || 1,
				max_floor: maxFloor || 10,
				status: mapLocalStatusToApi(formData.status as ElevatorStatus),
				installation_at: formData.startDate ? Math.floor(new Date(formData.startDate).getTime() / 1000) : currentTime,
				maintenance_cycle_months: formData.maintenanceCycle
					? Number.parseInt(formData.maintenanceCycle.replace('m', ''))
					: 1,
			}

			await createMutation.mutateAsync(newElevatorData)
			onClose()
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateElevator'))
		}
	}, [
		formData.name,
		formData.floorRange,
		formData.building,
		formData.status,
		formData.startDate,
		formData.maintenanceCycle,
		createMutation,
		onClose,
		resetForm,
		t,
	])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addElevator')}</DialogTitle>
					<DialogDescription>{t('addElevatorDesc')}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevatorName')}</Label>
						<Input
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder={t('elevatorNamePlaceholder')}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('building')}</Label>
							<Input
								value={formData.building}
								onChange={(e) => setFormData({ ...formData, building: e.target.value })}
								placeholder={t('buildingPlaceholder')}
							/>
						</div>

						<div className="space-y-2">
							<Label>{t('floorRange')}</Label>
							<Input
								value={formData.floorRange}
								onChange={(e) =>
									setFormData({
										...formData,
										floorRange: e.target.value,
									})
								}
								placeholder={t('floorRangePlaceholder')}
							/>
						</div>
					</div>

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
							<Label>{t('assignOperator')}</Label>
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
					<Button onClick={handleAddElevator} disabled={createMutation.isPending}>
						{createMutation.isPending ? 'Creating...' : t('confirmAdd')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
