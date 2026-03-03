import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ElevatorDashboard } from '@/features/elevator/components/ElevatorDashboard'

export const Route = createFileRoute('/_dashboard/elevator')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<>
			<ElevatorDashboard />

			<Outlet />
		</>
	)
}
