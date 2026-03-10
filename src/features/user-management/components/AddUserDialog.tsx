import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User, UserRole } from '@/types'

interface AddUserDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: Partial<User>
	setFormData: (data: Partial<User>) => void
	onSubmit: () => void
	isPending?: boolean
}

export function AddUserDialog({ open, onOpenChange, formData, setFormData, onSubmit, isPending }: AddUserDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className="shadow-lg hover:shadow-primary/20 transition-all">
					<UserPlus className="w-4 h-4 mr-2" /> {t('addUser')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addUser')}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('fullName')}</Label>
						<Input
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="John Doe"
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('email')}</Label>
						<Input
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							placeholder="john@example.com"
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('phone')}</Label>
						<Input
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							placeholder="0xxx"
						/>
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
						{isPending ? 'Creating...' : t('confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
