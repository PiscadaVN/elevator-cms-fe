import { useCallback } from 'react'

import { useLogin as useApiLogin, useLogout as useApiLogout } from '@/hooks/api'
import { router } from '@/router'
import { useAuthStore } from '../store/auth.store'

export function useAuth() {
	const { user, isLoading, isInitialized } = useAuthStore()
	const loginMutation = useApiLogin()
	const logoutMutation = useApiLogout()

	const login = useCallback(
		async (identifier: string, password?: string) => {
			try {
				await loginMutation.mutateAsync({
					username: identifier,
					password: password || '',
				})
				return true
			} catch (_error) {
				return false
			}
		},
		[loginMutation],
	)

	const logout = useCallback(async () => {
		try {
			await logoutMutation.mutateAsync()
		} finally {
			router.invalidate()
			router.navigate({ to: '/login' })
			useAuthStore.setState({ user: null, isInitialized: false })
		}
	}, [logoutMutation])

	return {
		user,
		login,
		logout,
		isLoading,
		isInitialized,
	}
}
