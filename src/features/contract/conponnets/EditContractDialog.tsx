import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, Elevator, User } from '@/types'
import { ContractForm } from './ContractForm'

interface EditContractDialogProps {
	contract: Contract | null
	onClose: () => void
	formData: Partial<Contract>
	setFormData: (data: Partial<Contract>) => void
	selectedElevatorId: string
	setSelectedElevatorId: (id: string) => void
	allUsers: User[]
	allElevators: Elevator[]
	isAdmin: boolean
	getElevatorName: (id: string) => string
	onSubmit: () => void
}

export function EditContractDialog({
	contract,
	onClose,
	formData,
	setFormData,
	selectedElevatorId,
	setSelectedElevatorId,
	allUsers,
	allElevators,
	isAdmin,
	getElevatorName,
	onSubmit,
}: EditContractDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={!!contract} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {contract?.id}
					</DialogTitle>
					<DialogDescription>{t('contractManagementDesc')}</DialogDescription>
				</DialogHeader>
				<ContractForm
					formData={formData}
					setFormData={setFormData}
					selectedElevatorId={selectedElevatorId}
					setSelectedElevatorId={setSelectedElevatorId}
					allUsers={allUsers}
					allElevators={allElevators}
					isAdmin={isAdmin}
					isEditing={true}
					getElevatorName={getElevatorName}
				/>
				<DialogFooter>
					<Button onClick={onSubmit}>{t('save')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
