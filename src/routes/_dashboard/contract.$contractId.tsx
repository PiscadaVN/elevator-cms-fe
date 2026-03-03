import { createFileRoute } from '@tanstack/react-router'

import { ViewContractDialog } from '@/features/contract/conponnets/ViewContractDialog'

export const Route = createFileRoute('/_dashboard/contract/$contractId')({
	component: RouteComponent,
})

function RouteComponent() {
	const { contractId } = Route.useParams()

	return <ViewContractDialog contractId={contractId} />
}
