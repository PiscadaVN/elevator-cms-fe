import { Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, ContractStatus, Elevator, User } from '@/types'

interface ContractFormProps {
	formData: Partial<Contract>
	setFormData: (data: Partial<Contract>) => void
	selectedElevatorId: string
	setSelectedElevatorId: (id: string) => void
	allUsers: User[]
	allElevators: Elevator[]
	isAdmin: boolean
	isEditing: boolean
	getElevatorName: (id: string) => string
}

export function ContractForm({
	formData,
	setFormData,
	selectedElevatorId,
	setSelectedElevatorId,
	allUsers,
	allElevators,
	isAdmin,
	isEditing,
	getElevatorName,
}: ContractFormProps) {
	const { t } = useLanguage()

	const addElevatorToForm = () => {
		if (!selectedElevatorId || formData.elevatorIds?.includes(selectedElevatorId)) return
		setFormData({ ...formData, elevatorIds: [...(formData.elevatorIds || []), selectedElevatorId] })
		setSelectedElevatorId('')
	}

	const removeElevatorFromForm = (elevatorId: string) => {
		setFormData({
			...formData,
			elevatorIds: (formData.elevatorIds || []).filter((id) => id !== elevatorId),
		})
	}

	return (
		<div className="grid gap-4 py-4">
			{/* Customer */}
			{isAdmin && (
				<div className="space-y-2">
					<Label>{t('customer')}</Label>
					<Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
						<SelectTrigger>
							<SelectValue placeholder={t('selectCustomer')} />
						</SelectTrigger>
						<SelectContent>
							{allUsers
								.map((u) => (
									<SelectItem key={u.id} value={u.id}>
										{u.name} ({u.email})
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Elevators */}
			<div className="space-y-2">
				<Label>{t('linkedElevators')}</Label>
				<div className="flex gap-2">
					<Select value={selectedElevatorId} onValueChange={setSelectedElevatorId}>
						<SelectTrigger className="flex-1">
							<SelectValue placeholder={t('selectElevator')} />
						</SelectTrigger>
						<SelectContent>
							{allElevators.map((e) => (
								<SelectItem key={e.id} value={e.id}>
									{e.name} - {e.building}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button type="button" variant="outline" size="icon" onClick={addElevatorToForm}>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
				{(formData.elevatorIds || []).length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{formData.elevatorIds!.map((eid) => (
							<Badge
								key={eid}
								variant="secondary"
								className="gap-1 cursor-pointer"
								onClick={() => removeElevatorFromForm(eid)}
							>
								{getElevatorName(eid)} ✕
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Dates */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>{t('signDate')}</Label>
					<Input
						type="date"
						value={formData.signDate}
						onChange={(e) => setFormData({ ...formData, signDate: e.target.value })}
					/>
				</div>
				<div className="space-y-2">
					<Label>{t('expiryDate')}</Label>
					<Input
						type="date"
						value={formData.expiryDate}
						onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
					/>
				</div>
			</div>

			{/* Amount */}
			<div className="space-y-2">
				<Label>{t('amount')}</Label>
				<Input
					type="number"
					value={formData.amount || ''}
					onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
					placeholder="0"
				/>
			</div>

			{/* Service Cycle */}
			<div className="space-y-2">
				<Label>{t('serviceCycle')}</Label>
				<Select
					value={formData.serviceCycle}
					onValueChange={(v) => setFormData({ ...formData, serviceCycle: v as Contract['serviceCycle'] })}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1m">1 {t('everyMonths')}</SelectItem>
						<SelectItem value="2m">2 {t('everyMonths')}</SelectItem>
						<SelectItem value="3m">3 {t('everyMonths')}</SelectItem>
						<SelectItem value="6m">6 {t('everyMonths')}</SelectItem>
						<SelectItem value="12m">12 {t('everyMonths')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Status (edit only) */}
			{isEditing && (
				<div className="space-y-2">
					<Label>{t('contractStatus')}</Label>
					<Select
						value={formData.status}
						onValueChange={(v) => setFormData({ ...formData, status: v as ContractStatus })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="active">{t('contractActive')}</SelectItem>
							<SelectItem value="expired">{t('contractExpired')}</SelectItem>
							<SelectItem value="cancelled">{t('contractCancelled')}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Note */}
			<div className="space-y-2">
				<Label>{t('note')}</Label>
				<Input
					value={formData.note || ''}
					onChange={(e) => setFormData({ ...formData, note: e.target.value })}
					placeholder="..."
				/>
			</div>
		</div>
	)
}
