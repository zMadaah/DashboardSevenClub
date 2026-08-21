import { useState } from 'react'
import { Ticket, CreditCard, ShieldAlert, Download, DollarSign } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { RegionMap } from '../../components/charts/RegionMap'
import { AnalyticsOverview } from './AnalyticsOverview'
import { NotificationsPage } from '../notifications'
import { useHomeSummary } from './useHomeSummary'
import { useTheme } from '../../theme/ThemeContext'
import { usersByRegion } from './mocks'

// Cards que não têm API real ainda — pagamentos/receita dependem de
// decisão de gateway (a integração Asaas foi removida por enquanto);
// anti-cheat tem tabela mas a rota nunca foi construída. Fixos aqui, não
// tentam buscar nada — mesmo tratamento visual das abas "Em breve".
const COMING_SOON_CARDS = [
  { label: 'Falhas de pagamento hoje', icon: CreditCard },
  { label: 'Fila anti-cheat', icon: ShieldAlert },
  { label: 'Receita total', icon: DollarSign },
]

const tabs = ['Visão geral', 'Análises', 'Relatórios', 'Notificações'] as const
const enabledTabs: (typeof tabs)[number][] = ['Visão geral', 'Análises', 'Notificações']

export function HomePage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0])
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { cards: summaryCards, isLoading: summaryLoading, error: summaryError } = useHomeSummary()

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
        <AnalyticsOverview />
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
              <>
                {summaryCards.map((card) => (
                  <Card key={card.label} dark={dark}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-laurelLeaf">{card.label}</p>
                      <Ticket size={16} className="text-laurelLeaf" />
                    </div>
                    <p className={`mt-2 text-2xl font-semibold ${textPrimary}`}>{card.value}</p>
                    <p className="mt-1 text-xs text-richblack">{card.trend}</p>
                  </Card>
                ))}

                {COMING_SOON_CARDS.map(({ label, icon: Icon }) => (
                  <Card key={label} dark={dark} className="opacity-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-laurelLeaf">{label}</p>
                      <Icon size={16} className="text-laurelLeaf" />
                    </div>
                    <p className={`mt-2 text-2xl font-semibold ${textPrimary}`}>—</p>
                    <p className="mt-1 text-xs text-laurelLeaf">Em breve</p>
                  </Card>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card dark={dark} className="col-span-2 opacity-50">
              <h2 className="mb-4 text-sm font-medium text-laurelLeaf">Usuários por status</h2>
              <p className="text-sm text-laurelLeaf">
                Em breve — depende do sistema de assinatura, ainda não definido.
              </p>
            </Card>

            <Card dark={dark} className="opacity-50">
              <h2 className="mb-4 text-sm font-medium text-laurelLeaf">Últimos pagamentos</h2>
              <p className="text-sm text-laurelLeaf">
                Em breve — depende da escolha do gateway de pagamento.
              </p>
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