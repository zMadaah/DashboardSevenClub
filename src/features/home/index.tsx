import { useState } from 'react'
import { Ticket, CreditCard, ShieldAlert, MessageSquare, Download, DollarSign } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { UserStatusDonut } from '../../components/charts/UserStatusDonut'
import { RegionMap } from '../../components/charts/RegionMap'
import { AnalyticsOverview } from './AnalyticsOverview'
import { AnalyticsPage }from '../analytics'
import { NotificationsPage } from '../notifications'
import { useSubscriptionSummary } from './useSubscriptionSummary'
import { useHomeSummary } from './useHomeSummary'
import { useRecentPayments } from './useRecentPayments'
import { useTheme } from '../../theme/ThemeContext'
import { usersByRegion } from './mocks'

const statIcons = [Ticket, CreditCard, ShieldAlert, MessageSquare, DollarSign]

const tabs = ['Visão geral', 'Análises', 'Relatórios', 'Notificações'] as const
const enabledTabs: (typeof tabs)[number][] = ['Visão geral', 'Análises', 'Notificações']

export function HomePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0])
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { data: userStatusData, total: userStatusTotal, isLoading: statusLoading, error: statusError } =
    useSubscriptionSummary()
  const { cards: summaryCards, isLoading: summaryLoading, error: summaryError } = useHomeSummary()
  const { payments: recentPayments, isLoading: paymentsLoading, error: paymentsError } = useRecentPayments()

  const textPrimary = dark ? 'text-ceilingWhite' : 'text-richBlack'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard</h1>
        <button
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            dark ? 'bg-ceilingWhite text-richBlack hover:bg-white' : 'bg-richBlack text-ceilingWhite hover:bg-richBlack/90'
          }`}
        >
          <Download size={14} />
          Baixar relatório
        </button>
      </div>

      <div className={`inline-flex w-fit gap-1 rounded-lg p-1 ${dark ? 'bg-surface' : 'bg-ceilingWhite'}`}>
        {tabs.map((tab) => {
          const isEnabled = enabledTabs.includes(tab)
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              disabled={!isEnabled}
              onClick={() => isEnabled && setActiveTab(tab)}
              title={!isEnabled ? 'Em breve' : undefined}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? dark
                    ? 'bg-richBlack text-ceilingWhite'
                    : 'bg-white text-richBlack shadow-sm'
                  : isEnabled
                    ? `text-laurelLeaf ${dark ? 'hover:text-ceilingWhite' : 'hover:text-richBlack'}`
                    : 'cursor-not-allowed text-laurelLeaf/40'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {activeTab === 'Análises' ? (
        <AnalyticsPage />
      ) : activeTab === 'Notificações' ? (
        <NotificationsPage />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {summaryLoading ? (
              <p className="col-span-4 text-sm text-laurelLeaf">Carregando...</p>
            ) : summaryError ? (
              <p className="col-span-4 text-sm text-red-400">Não foi possível carregar: {summaryError}</p>
            ) : (
              summaryCards.map((card, i) => {
                const Icon = statIcons[i]
                return (
                  <Card key={card.label} dark={dark}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-laurelLeaf">{card.label}</p>
                      <Icon size={16} className="text-laurelLeaf" />
                    </div>
                    <p className={`mt-2 text-2xl font-semibold ${textPrimary}`}>{card.value}</p>
                    <p className="mt-1 text-xs text-pear">{card.trend}</p>
                  </Card>
                )
              })
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card dark={dark} className="col-span-2">
              <h2 className="mb-4 text-sm font-medium text-laurelLeaf">Usuários por status</h2>
              {statusLoading ? (
                <p className="text-sm text-laurelLeaf">Carregando...</p>
              ) : statusError ? (
                <p className="text-sm text-red-400">Não foi possível carregar: {statusError}</p>
              ) : (
                <UserStatusDonut data={userStatusData} total={userStatusTotal} dark={dark} />
              )}
            </Card>

            <Card dark={dark}>
              <h2 className="mb-4 text-sm font-medium text-laurelLeaf">Últimos pagamentos</h2>
              {paymentsLoading ? (
                <p className="text-sm text-laurelLeaf">Carregando...</p>
              ) : paymentsError ? (
                <p className="text-sm text-red-400">Não foi possível carregar: {paymentsError}</p>
              ) : recentPayments.length === 0 ? (
                <p className="text-sm text-laurelLeaf">Nenhum pagamento recente.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-laurelLeaf/20 text-xs font-semibold ${textPrimary}`}
                        >
                          {p.initials}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className={`text-sm ${textPrimary}`}>{p.name}</span>
                          <span className="text-xs text-laurelLeaf">{p.gateway}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-pear">
                        +R$ {p.amount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card dark={dark}>
            <h2 className="mb-4 text-sm font-medium text-laurelLeaf">Usuários por região</h2>
            <RegionMap data={usersByRegion} />
          </Card>
        </>
      )}
    </div>
  )
}