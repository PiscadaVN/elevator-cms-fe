import { createFileRoute, redirect } from '@tanstack/react-router'

import { UserManagement } from '@/features/user-management/components/UserManagement'
import { isAdmin } from '@/lib/role-utils'

export const Route = createFileRoute('/_dashboard/user')({
	beforeLoad: ({ context }) => {
		if (!isAdmin(context.user?.role)) {
			throw redirect({ to: '/' })
		}
	},
	component: UserManagement,
})
