export const formatDisplayDate = (timestamp: number | undefined | null): string => {
	if (!timestamp) return '-'

	return new Date(timestamp * 1000).toLocaleString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
}

export const toDateInputValue = (timestamp?: number | null): string => {
	if (!timestamp) return ''

	return new Date(timestamp * 1000).toISOString().slice(0, 10)
}
