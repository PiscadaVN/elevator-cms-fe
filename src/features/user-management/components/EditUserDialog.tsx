import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import type { User, UserRole } from '@/types'
import { UserRoles } from '@/lib/role-utils'

interface EditUserDialogProps {
	user: User | null
	onClose: () => void
	formData: Partial<User>
	setFormData: (data: Partial<User>) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditUserDialog({ user, onClose, formData, setFormData, onSubmit, isPending }: EditUserDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {user?.name}
					</DialogTitle>
					<DialogDescription>{t('userManagementDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('fullName')}</Label>
						<Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('email')}</Label>
							<Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
						</div>
						<div className="space-y-2">
							<Label>{t('phone')}</Label>
							<Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
						</div>
					</div>
					<div className="space-y-2">
						<Label>{t('role')}</Label>
						<Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={UserRoles.SUPER_ADMIN}>{t('superadmin')}</SelectItem>
								<SelectItem value={UserRoles.ADMIN}>{t('admin')}</SelectItem>
								<SelectItem value={UserRoles.OPERATOR}>{t('operator')}</SelectItem>
								<SelectItem value={UserRoles.VIEWER}>{t('viewer')}</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? 'Saving...' : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
