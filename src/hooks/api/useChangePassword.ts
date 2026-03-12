import { authApi } from '@/api/auth.api'
import type { PasswordChangeRequest } from '@/types/api'
import { useMutation } from '@tanstack/react-query'

export function useChangePassword() {
	return useMutation({
		mutationFn: (data: PasswordChangeRequest) => authApi.changePassword(data),
	})
}
