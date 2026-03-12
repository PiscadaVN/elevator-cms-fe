import { useState } from 'react'

import { useElevators } from '@/hooks/api/useElevator'
import {
	useCreateMaintenanceSchedule,
	useDeleteMaintenanceSchedule,
	useMaintenanceSchedules,
	useUpdateMaintenanceSchedule,
} from '@/hooks/api/useMaintenance'
import { useLanguage } from '@/i18n/LanguageContext'
import type { MaintenanceFormData, MaintenanceSchedule } from '@/types/api'

import { MaintenanceStatusEnum } from '../helpers/status'
import { AddMaintenanceDialog } from './AddMaintenanceDialog'
import { EditMaintenanceDialog } from './EditMaintenanceDialog'
import { MaintenanceTable } from './MaintenanceTable'

const createDefaultFormData = (): MaintenanceFormData => ({
	elevatorId: '',
	status: MaintenanceStatusEnum.SCHEDULED,
	notes: '',
})

export function MaintenanceList() {
	const { t } = useLanguage()

	const { data: schedules = [], isLoading } = useMaintenanceSchedules()
	const { data: elevators = [] } = useElevators()

	const createMutation = useCreateMaintenanceSchedule()
	const updateMutation = useUpdateMaintenanceSchedule()
	const deleteMutation = useDeleteMaintenanceSchedule()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingSchedule, setEditingSchedule] = useState<MaintenanceSchedule | null>(null)
	const [formData, setFormData] = useState<MaintenanceFormData>(createDefaultFormData())

	const resetForm = () => {
		setFormData(createDefaultFormData())
	}

	const handleAddMaintenance = async () => {
		if (!formData.elevatorId) {
			alert(t('missingRequiredFields'))
			return
		}

		try {
			await createMutation.mutateAsync(formData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateMaintenance'))
		}
	}

	const handleUpdateMaintenance = async () => {
		if (!editingSchedule) return

		try {
			await updateMutation.mutateAsync({ scheduleId: editingSchedule.id, data: formData })
			setEditingSchedule(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateMaintenance'))
		}
	}

	const handleDeleteMaintenance = async (scheduleId: string) => {
		if (!confirm(t('confirmDeleteMaintenance'))) return

		try {
			await deleteMutation.mutateAsync(scheduleId)
		} catch (_error) {
			alert(t('failedToDeleteMaintenance'))
		}
	}

	const openEditDialog = (schedule: MaintenanceSchedule) => {
		setEditingSchedule(schedule)
		setFormData({
			elevatorId: schedule.elevatorId,
			scheduledStartAt: schedule.scheduledStartAt,
			status: schedule.status,
			completedAt: schedule.completedAt,
			notes: schedule.notes || '',
		})
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex justify-between items-center border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('maintenanceManagementTitle')}</h1>
					<p className="text-muted-foreground mt-2">{t('maintenanceManagementDesc')}</p>
				</div>
				<AddMaintenanceDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					elevators={elevators}
					onSubmit={handleAddMaintenance}
					isPending={createMutation.isPending}
				/>
			</header>

			<MaintenanceTable
				schedules={schedules}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onDelete={handleDeleteMaintenance}
			/>

			<EditMaintenanceDialog
				schedule={editingSchedule}
				onClose={() => {
					setEditingSchedule(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				elevators={elevators}
				onSubmit={handleUpdateMaintenance}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
