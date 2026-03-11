import { useState } from 'react'
import { useContracts, useCreateContract, useDeleteContract } from '@/hooks/api'
import type { ContractCreate } from '@/types/api'

export function ContractListExample() {
	const [isCreating, setIsCreating] = useState(false)

	const { data: contracts, isLoading, error, refetch } = useContracts()

	const createMutation = useCreateContract()

	const deleteMutation = useDeleteContract()

	const handleCreateContract = async () => {
		const newContract: ContractCreate = {
			elevator_id: 'elevator-001',
			customer_id: 'customer-001',
			signed_at: Math.floor(Date.now() / 1000),
			expired_at: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
			contract_value: 50000,
			description: 'Annual maintenance contract',
			is_active: true,
		}

		try {
			await createMutation.mutateAsync(newContract)
			alert('Contract created successfully!')
			setIsCreating(false)
		} catch (_error) {
			alert('Failed to create contract')
		}
	}

	const handleDeleteContract = async (contractId: string) => {
		if (!confirm('Are you sure you want to delete this contract?')) return

		try {
			await deleteMutation.mutateAsync(contractId)
			alert('Contract deleted successfully!')
		} catch (_error) {
			alert('Failed to delete contract')
		}
	}

	if (isLoading) {
		return (
			<div className="p-4">
				<div className="animate-pulse">Loading contracts...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-4">
				<div className="text-red-600">Error: {error.message}</div>
				<button onClick={() => refetch()} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
					Retry
				</button>
			</div>
		)
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Contracts</h1>
				<button
					onClick={() => setIsCreating(true)}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					disabled={createMutation.isPending}
				>
					{createMutation.isPending ? 'Creating...' : 'New Contract'}
				</button>
			</div>

			{/* Create Contract Dialog */}
			{isCreating && (
				<div className="mb-4 p-4 border rounded bg-gray-50">
					<h3 className="font-semibold mb-2">Create New Contract</h3>
					<p className="text-sm text-gray-600 mb-3">
						This will create a sample contract. In a real app, you would have a form here.
					</p>
					<div className="flex gap-2">
						<button
							onClick={handleCreateContract}
							disabled={createMutation.isPending}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
						>
							{createMutation.isPending ? 'Creating...' : 'Create'}
						</button>
						<button
							onClick={() => setIsCreating(false)}
							disabled={createMutation.isPending}
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			<div className="space-y-3">
				{contracts?.length === 0 ? (
					<div className="text-center py-8 text-gray-500">No contracts found. Create one to get started.</div>
				) : (
					contracts?.map((contract) => (
						<div key={contract.id} className="border rounded p-4 hover:shadow-md transition-shadow">
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h3 className="font-semibold">Contract #{contract.id}</h3>
										<span
											className={`px-2 py-1 text-xs rounded ${
												contract.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
											}`}
										>
											{contract.is_active ? 'Active' : 'Inactive'}
										</span>
									</div>

									<div className="text-sm space-y-1 text-gray-600">
										<p>
											<strong>Elevator ID:</strong> {contract.elevator_id}
										</p>
										<p>
											<strong>Customer ID:</strong> {contract.customer_id}
										</p>
										<p>
											<strong>Value:</strong> ${contract.contract_value?.toLocaleString() || 'N/A'}
										</p>
										{contract.signed_at && (
											<p>
												<strong>Signed:</strong> {new Date(contract.signed_at * 1000).toLocaleDateString()}
											</p>
										)}
										{contract.expired_at && (
											<p>
												<strong>Expires:</strong> {new Date(contract.expired_at * 1000).toLocaleDateString()}
											</p>
										)}
										{contract.description && (
											<p>
												<strong>Description:</strong> {contract.description}
											</p>
										)}
									</div>
								</div>

								<button
									onClick={() => handleDeleteContract(contract.id)}
									disabled={deleteMutation.isPending}
									className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
								>
									{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						</div>
					))
				)}
			</div>

			<div className="mt-4 flex justify-center">
				<button onClick={() => refetch()} className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
					Refresh Data
				</button>
			</div>
		</div>
	)
}
