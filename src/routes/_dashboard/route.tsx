import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import {
	AlertCircle,
	ChevronDown,
	LayoutDashboard,
	Lock,
	LogOut,
	Newspaper,
	User as UserIcon,
	Users,
	Wrench,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChangePasswordDialog } from '@/features/auth/components/ChangePasswordDialog'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCurrentUser } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { getAuthToken } from '@/lib/api-client'

export const Route = createFileRoute('/_dashboard')({
	beforeLoad: () => {
		const token = getAuthToken()
		if (!token) {
			throw redirect({ to: '/login' })
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const location = useLocation()
	const currentTab = location.pathname

	useCurrentUser()

	const { user, logout } = useAuth()
	const { t } = useLanguage()

	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

	if (!user) return null

	const handleNavigate = (path: string) => {
		navigate({ to: path })
	}

	const handleChangePassword = () => {
		setIsChangePasswordOpen(true)
		setIsUserMenuOpen(false)
	}

	const handleLogout = async () => {
		setIsUserMenuOpen(false)
		await logout()
	}

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
				<button className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => handleNavigate('/')}>
					<img src="/logo.svg" alt="Elevator CMS" className="h-8 w-auto" />
				</button>
				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button
						variant={currentTab === '/incident' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/incident')}
						className="rounded-full"
					>
						<AlertCircle className="w-4 h-4 mr-2" /> {t('incidents')}
					</Button>
					<Button
						variant={currentTab === '/maintenance' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/maintenance')}
						className="rounded-full"
					>
						<Wrench className="w-4 h-4 mr-2" /> {t('maintenance')}
					</Button>
					<Button
						variant={currentTab === '/elevator' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/elevator')}
						className="rounded-full"
					>
						<LayoutDashboard className="w-4 h-4 mr-2" /> {t('elevator')}
					</Button>
					<Button
						variant={currentTab === '/user' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/user')}
						className="rounded-full"
					>
						<Users className="w-4 h-4 mr-2" /> {t('users')}
					</Button>
					<Button
						variant={currentTab === '/contract' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/contract')}
						className="rounded-full"
					>
						<Newspaper className="w-4 h-4 mr-2" /> {t('contracts')}
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
						<PopoverTrigger asChild>
							<Button variant="ghost" size="sm" className="rounded-full h-8 px-2">
								<div className="flex items-center gap-2">
									<div className="p-1 bg-primary/5 rounded-full">
										<UserIcon className="w-4 h-4 text-primary" />
									</div>
									<div className="text-xs sm:text-sm leading-none">
										<span className="font-medium">{user.fullName}</span>
										<Badge variant="outline" className="ml-1 uppercase text-[10px] py-1">
											{user.role}
										</Badge>
									</div>
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48" align="end">
							<div className="flex flex-col gap-2">
								<Button variant="ghost" size="sm" className="justify-start" onClick={handleChangePassword}>
									<Lock className="w-4 h-4 mr-2" />
									{t('changePassword')}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="justify-start text-destructive hover:text-destructive"
									onClick={handleLogout}
								>
									<LogOut className="w-4 h-4 mr-2" />
									{t('logout')}
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</nav>

			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>

			<ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
		</div>
	)
}
