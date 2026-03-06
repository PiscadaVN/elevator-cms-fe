import { createFileRoute } from '@tanstack/react-router'

import { ElevatorDetail } from '@/features/elevator/components/ElevatorDetail'

export const Route = createFileRoute('/_dashboard/elevator/$elevatorId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { elevatorId } = Route.useParams()

	return <ElevatorDetail elevatorId={elevatorId} />
}
