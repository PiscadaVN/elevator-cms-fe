import { useAuth } from '@/features/auth/hooks/useAuth'
import {
	apiIncidentStatusToLocalStatus,
	canTransitionIncidentStatus,
	incidentStatusToApiStatus,
} from '@/features/incident/helpers/status-transition'
import { useElevators } from '@/hooks/api/useElevator'
import { useCreateIncident, useDeleteIncident, useIncidents, useUpdateIncident } from '@/hooks/api/useIncident'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, Incident, IncidentStatus } from '@/types'
import type { IncidentCreate, IncidentUpdate } from '@/types/api'
import { useMemo, useState } from 'react'
import { AddIncidentDialog } from './AddIncidentDialog'
import { EditIncidentDialog } from './EditIncidentDialog'
import { IncidentTable } from './IncidentTable'

export function IncidentList() {
	const { t } = useLanguage()
	const { user } = useAuth()

	const { data: apiIncidents = [], isLoading } = useIncidents()
	const { data: apiElevators = [] } = useElevators()
	const createMutation = useCreateIncident()
	const updateMutation = useUpdateIncident()
	const deleteMutation = useDeleteIncident()

	const incidents = useMemo<Incident[]>(() => {
		return apiIncidents.map(
			(inc): Incident => ({
				id: inc.id,
				elevatorId: inc.elevator_id,
				description: inc.description || inc.title || '',
				priority: inc.priority === 3 ? 'high' : inc.priority === 2 ? 'medium' : 'low',
				status: apiIncidentStatusToLocalStatus(inc.status),
				createdAt: inc.created_at ? new Date(inc.created_at * 1000).toISOString() : new Date().toISOString(),
				updatedAt: inc.updated_at ? new Date(inc.updated_at * 1000).toISOString() : new Date().toISOString(),
				reporterId: inc.reported_user || 'unknown',
			}),
		)
	}, [apiIncidents])

	const elevators = useMemo<Pick<Elevator, 'id' | 'building'>[]>(() => {
		return apiElevators.map((elev) => ({
			id: elev.id,
			building: elev.address || elev.name || 'N/A',
		}))
	}, [apiElevators])

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingIncident, setEditingIncident] = useState<Incident | null>(null)

	const [formData, setFormData] = useState<Partial<Incident>>({
		elevatorId: '',
		description: '',
		priority: 'medium',
		status: 'new',
	})

	const handleAddIncident = async () => {
		if (!formData.elevatorId || !formData.description) return

		try {
			const priorityNum = formData.priority === 'high' ? 3 : formData.priority === 'medium' ? 2 : 1

			const newIncidentData: IncidentCreate = {
				title: formData.description.substring(0, 50),
				elevator_id: formData.elevatorId,
				description: formData.description,
				priority: priorityNum,
				status: 'NEW',
			}

			await createMutation.mutateAsync(newIncidentData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateIncident'))
		}
	}

	const handleUpdateIncident = async () => {
		if (!editingIncident) return

		try {
			const priorityNum = formData.priority === 'high' ? 3 : formData.priority === 'medium' ? 2 : 1

			if (formData.status && !canTransitionIncidentStatus(editingIncident.status, formData.status, user?.role)) {
				alert(t('invalidIncidentStatusTransition'))
				return
			}

			const updateData: IncidentUpdate = {
				title: formData.description?.substring(0, 50),
				description: formData.description,
				priority: priorityNum,
				status: formData.status ? incidentStatusToApiStatus(formData.status as IncidentStatus) : undefined,
			}

			await updateMutation.mutateAsync({ incidentId: editingIncident.id, data: updateData })
			setEditingIncident(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateIncident'))
		}
	}

	const handleDeleteIncident = async (id: string) => {
		if (!confirm(t('confirmDeleteIncident'))) return

		try {
			await deleteMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToDeleteIncident'))
		}
	}

	const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
		try {
			const incident = incidents.find((item) => item.id === id)
			if (!incident) {
				return
			}

			if (!canTransitionIncidentStatus(incident.status, status, user?.role)) {
				alert(t('invalidIncidentStatusTransition'))
				return
			}

			await updateMutation.mutateAsync({
				incidentId: id,
				data: { status: incidentStatusToApiStatus(status) },
			})
		} catch (_error) {
			alert(t('failedToUpdateStatus'))
		}
	}

	const resetForm = () => {
		setFormData({
			elevatorId: '',
			description: '',
			priority: 'medium',
			status: 'new',
		})
	}

	const openEditDialog = (incident: Incident) => {
		setEditingIncident(incident)
		setFormData({
			elevatorId: incident.elevatorId,
			description: incident.description,
			priority: incident.priority,
			status: incident.status,
		})
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex justify-between items-center border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('incidents')}</h1>
					<p className="text-muted-foreground mt-2">{t('requiresAttention')}</p>
				</div>
				<AddIncidentDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					elevators={elevators}
					onSubmit={handleAddIncident}
					isPending={createMutation.isPending}
				/>
			</header>

			<IncidentTable
				incidents={incidents}
				isLoading={isLoading}
				currentUserRole={user?.role}
				onEdit={openEditDialog}
				onDelete={handleDeleteIncident}
				onUpdateStatus={handleUpdateStatus}
			/>

			<EditIncidentDialog
				incident={editingIncident}
				currentUserRole={user?.role}
				onClose={() => {
					setEditingIncident(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				onSubmit={handleUpdateIncident}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
