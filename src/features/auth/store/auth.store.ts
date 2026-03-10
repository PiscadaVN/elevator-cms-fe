import { create } from 'zustand'

import type { User } from '@/types'
import { getAuthToken } from '@/lib/api-client'

interface AuthState {
	user: User | null
	isLoading: boolean
	isInitialized: boolean
	setUser: (user: User | null) => void
	setIsLoading: (isLoading: boolean) => void
	setAuthState: (user: User | null, isLoading: boolean) => void
	setInitialized: () => void
}

const hasToken = !!getAuthToken()

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: hasToken,
	isInitialized: !hasToken,

	setUser: (user) => set({ user }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setAuthState: (user, isLoading) => set({ user, isLoading }),
	setInitialized: () => set({ isInitialized: true }),
}))
