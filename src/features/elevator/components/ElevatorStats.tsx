import { Activity, AlertTriangle, CheckCircle2, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/i18n/LanguageContext'

interface ElevatorStatsProps {
	stats: {
		total: number
		available: number
		maintenance: number
		incidents: number
	}
	activeFilter?: 'all' | 'available' | 'maintenance' | 'out_of_order'
	onFilterChange?: (filter: 'all' | 'available' | 'maintenance' | 'out_of_order') => void
}

export function ElevatorStats({ stats, activeFilter = 'all', onFilterChange }: ElevatorStatsProps) {
	const { t } = useLanguage()

	return (
		<div className="grid gap-6 md:grid-cols-4">
			<Card 
				className={`bg-linear-to-br from-primary/10 to-primary/5 border-primary/20 transition-all cursor-pointer hover:shadow-lg ${
					activeFilter === 'all' ? 'ring-2 ring-primary shadow-lg scale-105' : ''
				}`}
				onClick={() => onFilterChange?.('all')}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{t('totalUnits')}</CardTitle>
					<Activity className="h-4 w-4 text-primary" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.total}</div>
					<p className="text-xs text-muted-foreground">{t('connectedSystems')}</p>
				</CardContent>
			</Card>

			<Card 
				className={`bg-linear-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 transition-all cursor-pointer hover:shadow-lg ${
					activeFilter === 'available' ? 'ring-2 ring-green-600 shadow-lg scale-105' : ''
				}`}
				onClick={() => onFilterChange?.('available')}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-green-700">{t('available')}</CardTitle>
					<CheckCircle2 className="h-4 w-4 text-green-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-700">{stats.available}</div>
					<p className="text-xs text-green-600/80">{t('operational')}</p>
				</CardContent>
			</Card>

			<Card 
				className={`bg-linear-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20 transition-all cursor-pointer hover:shadow-lg ${
					activeFilter === 'maintenance' ? 'ring-2 ring-yellow-600 shadow-lg scale-105' : ''
				}`}
				onClick={() => onFilterChange?.('maintenance')}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-yellow-700">{t('maintenance')}</CardTitle>
					<Settings className="h-4 w-4 text-yellow-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-yellow-700">{stats.maintenance}</div>
					<p className="text-xs text-yellow-600/80">{t('scheduledChecks')}</p>
				</CardContent>
			</Card>

			<Card 
				className={`bg-linear-to-br from-red-500/10 to-rose-500/5 border-red-500/20 transition-all cursor-pointer hover:shadow-lg ${
					activeFilter === 'out_of_order' ? 'ring-2 ring-red-600 shadow-lg scale-105' : ''
				}`}
				onClick={() => onFilterChange?.('out_of_order')}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-red-700">{t('incidents')}</CardTitle>
					<AlertTriangle className="h-4 w-4 text-red-600" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-red-700">{stats.incidents}</div>
					<p className="text-xs text-red-600/80">{t('requiresAttention')}</p>
				</CardContent>
			</Card>
		</div>
	)
}
