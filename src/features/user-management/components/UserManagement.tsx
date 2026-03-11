import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import type { User } from '@/types'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '@/hooks/api/useUser'
import type { UserCreate, UserUpdate } from '@/types/api'
import { UserTable } from './UserTable'
import { AddUserDialog } from './AddUserDialog'
import { EditUserDialog } from './EditUserDialog'
import { UserRoles } from '@/lib/role-utils'

export function UserManagement() {
	const { t } = useLanguage()

	const { data: apiUsers = [], isLoading } = useUsers()
	const createMutation = useCreateUser()
	const updateMutation = useUpdateUser()
	const deleteMutation = useDeleteUser()

	const users = useMemo<User[]>(() => {
		return apiUsers.map(
			(apiUser): User => ({
				id: apiUser.id,
				name: apiUser.full_name,
				email: apiUser.email,
				phone: apiUser.phone || '',
				role: apiUser.role,
				password: '',
				status: apiUser.is_active ? 'active' : 'disabled',
			}),
		)
	}, [apiUsers])

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<User | null>(null)

	const [formData, setFormData] = useState<Partial<User>>({
		name: '',
		email: '',
		phone: '',
		role: UserRoles.VIEWER,
		password: 'password',
		status: 'active',
	})

	const handleAddUser = async () => {
		if (!formData.name || !formData.email || !formData.phone || !formData.password) return

		if (users.some((u) => u.email === formData.email || u.phone === formData.phone)) {
			alert(t('emailOrPhoneExists'))
			return
		}

		try {
			const newUserData: UserCreate = {
				full_name: formData.name,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
				role: formData.role || 'viewer',
			}

			await createMutation.mutateAsync(newUserData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateUser'))
		}
	}

	const handleUpdateUser = async () => {
		if (!editingUser) return

		try {
			const updateData: UserUpdate = {
				full_name: formData.name,
				email: formData.email,
				phone: formData.phone,
				role: formData.role || 'viewer',
			}

			await updateMutation.mutateAsync({ userId: editingUser.id, data: updateData })
			setEditingUser(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateUser'))
		}
	}

	const handleToggleStatus = async (id: string) => {
		try {
			await deleteMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToToggleUserStatus'))
		}
	}

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			phone: '',
			role: UserRoles.VIEWER,
			password: 'password',
			status: 'active',
		})
	}

	const openEditDialog = (user: User) => {
		setEditingUser(user)
		setFormData({
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			password: user.password,
			status: user.status,
		})
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
						<Users className="w-10 h-10 text-primary" />
						{t('userManagementTitle')}
					</h1>
					<p className="text-muted-foreground mt-2">{t('userManagementDesc')}</p>
				</div>
				<AddUserDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					onSubmit={handleAddUser}
					isPending={createMutation.isPending}
				/>
			</header>

			<UserTable
				users={users}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onToggleStatus={handleToggleStatus}
			/>

			<EditUserDialog
				user={editingUser}
				onClose={() => {
					setEditingUser(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				onSubmit={handleUpdateUser}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
