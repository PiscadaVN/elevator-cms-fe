import { createFileRoute } from '@tanstack/react-router'

import { IncidentDetail } from '@/features/incident/components/IncidentDetail'

export const Route = createFileRoute('/_dashboard/incident/$incidentId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { incidentId } = Route.useParams()

	return <IncidentDetail incidentId={incidentId} />
}
