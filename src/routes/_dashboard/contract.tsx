import { createFileRoute } from '@tanstack/react-router'

import ContractList from '@/features/contract/conponnets/ContractList'

export const Route = createFileRoute('/_dashboard/contract')({
	component: ContractList,
})
