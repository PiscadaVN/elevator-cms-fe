import { createFileRoute, Outlet } from '@tanstack/react-router'

import ContractList from '@/features/contract/conponnets/ContractList'

export const Route = createFileRoute('/_dashboard/contract')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<ContractList />

			<Outlet />
		</>
	)
}
