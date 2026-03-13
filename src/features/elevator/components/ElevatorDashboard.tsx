import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { useDeleteElevator, useElevators } from '@/hooks/api/useElevator'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator } from '@/types/api'

import { AddElevatorDialog } from './AddElevatorDialog'
import { EditElevatorDialog } from './EditElevatorDialog'
import { ElevatorTable } from './ElevatorTable'

export function ElevatorDashboard() {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const { data: elevators = [], isLoading: loadingElevators } = useElevators()
	const deleteMutation = useDeleteElevator()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingElevator, setEditingElevator] = useState<Elevator | null>(null)
	const [deletingElevatorId, setDeletingElevatorId] = useState<string | null>(null)

	// const stats = useMemo(() => {
	// 	return {
	// 		total: elevators.length,
	// 		available: elevators.filter((e) => e.status === 'available').length,
	// 		maintenance: elevators.filter((e) => e.status === 'maintenance').length,
	// 		incidents: elevators.filter((e) => e.status === 'out_of_order').length,
	// 	}
	// }, [elevators])

	const handleDeleteElevator = (id: string) => {
		setDeletingElevatorId(id)
	}

	const handleConfirmDeleteElevator = async () => {
		if (!deletingElevatorId) return

		try {
			await deleteMutation.mutateAsync(deletingElevatorId)
			setDeletingElevatorId(null)
		} catch (_error) {
			alert(t('failedToDeleteElevator'))
		}
	}

	const openEditDialog = (elevator: Elevator) => {
		setEditingElevator(elevator)
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('appName')}</h1>
					<p className="text-muted-foreground mt-2">{t('elevatorOverviewDesc')}</p>
				</div>
			</header>

			{/*<ElevatorStats stats={stats} activeFilter={statusFilter} onFilterChange={setStatusFilter} />*/}

			<div className="flex justify-end mb-4">
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="w-4 h-4 mr-2" /> {t('addElevator')}
				</Button>
			</div>

			<ElevatorTable
				elevators={elevators}
				isLoading={loadingElevators}
				onEdit={openEditDialog}
				onView={(id) => navigate({ to: `/elevator/${id}` })}
				onDelete={handleDeleteElevator}
				isDeleting={deleteMutation.isPending}
			/>

			{isAddDialogOpen && <AddElevatorDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />}

			{editingElevator && (
				<EditElevatorDialog
					isOpen={!!editingElevator}
					onClose={() => setEditingElevator(null)}
					elevator={editingElevator}
				/>
			)}

			<CommonConfirmDialog
				open={!!deletingElevatorId}
				onOpenChange={(open) => {
					if (!open) setDeletingElevatorId(null)
				}}
				title={t('delete')}
				content={t('confirmDeleteElevator')}
				cancelText={t('cancel')}
				submitText={deleteMutation.isPending ? t('deleting') : t('delete')}
				onSubmit={handleConfirmDeleteElevator}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
