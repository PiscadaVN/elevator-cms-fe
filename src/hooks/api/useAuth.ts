import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import type { LoginRequest, PasswordChangeRequest, TokenResponse } from '@/types/api'

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation<TokenResponse, Error, LoginRequest>({
		mutationFn: authApi.login,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentUser'] })
		},
	})
}

export const useLogout = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error>({
		mutationFn: authApi.logout,
		onSuccess: () => {
			queryClient.clear()
		},
	})
}

export const useChangePassword = () => {
	return useMutation<void, Error, PasswordChangeRequest>({
		mutationFn: authApi.changePassword,
	})
}

export const useRefreshToken = () => {
	return useMutation<TokenResponse, Error>({
		mutationFn: authApi.refreshToken,
	})
}
