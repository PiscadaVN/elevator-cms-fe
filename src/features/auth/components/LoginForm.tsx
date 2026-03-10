import type { FormEvent } from 'react'
import { useState } from 'react'
import { Building2, Smartphone } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { useLanguage } from '@/i18n/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { login } = useAuth()

	const [identifier, setIdentifier] = useState('admin@piscada.vn')
	const [password, setPassword] = useState('admin')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError('')
		if (!identifier || !password) {
			setError(t('loginError'))
			return
		}

		setIsLoading(true)
		try {
			const success = await login(identifier, password)
			if (success) {
				navigate({ to: '/' })
			} else {
				setError(t('loginError'))
			}
		} catch (_err) {
			setError(t('loginError'))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-[80vh] px-4">
			<Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-primary/10 rounded-full">
							<Building2 className="w-8 h-8 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight">{t('appName')}</CardTitle>
					<CardDescription>{t('loginDesc')}</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-center font-medium">
								{error}
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="identifier">{t('identifierLabel')}</Label>
							<div className="relative">
								<Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="identifier"
									placeholder="admin@piscada.vn"
									value={identifier}
									onChange={(e) => setIdentifier(e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">{t('passwordLabel')}</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
							/>
						</div>

						<Button type="submit" className="w-full h-11 text-lg font-semibold mt-4" disabled={isLoading}>
							{isLoading ? t('loading') || 'Loading...' : t('signInBtn')}
						</Button>
					</CardContent>
				</form>
				<CardFooter className="flex flex-col">
					<p className="text-xs text-center text-muted-foreground mt-2">{t('copyright')}</p>
				</CardFooter>
			</Card>
		</div>
	)
}
