import { createFileRoute, Outlet } from '@tanstack/react-router'

import { IncidentList } from '@/features/incident/components/IncidentList'

export const Route = createFileRoute('/_dashboard/incident')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<IncidentList />

			<Outlet />
		</>
	)
}
