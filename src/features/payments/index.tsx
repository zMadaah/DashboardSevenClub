import { useState } from 'react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Card } from '../../components/ui/Card'
import { usePayments, PaymentFilter } from './usePayments'
import { usePaymentsSummary } from './usePaymentsSummary'
import { formatDate } from '../../lib/format'
import { useTheme } from '../../theme/ThemeContext'
import { PaymentStatus } from '../../types'

const statusTone: Record<PaymentStatus, 'success' | 'danger' | 'neutral' | 'warning'> = {
  paid: 'success',
  failed: 'danger',
  refunded: 'neutral',
  pending: 'warning',
}

const statusLabel: Record<PaymentStatus, string> = {
  paid: 'Pago',
  failed: 'Falha',
  refunded: 'Reembolsado',
  pending: 'Pendente',
}

const filters: { key: PaymentFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'paid', label: 'Pagos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'failed', label: 'Falha' },
  { key: 'refunded', label: 'Reembolsado' },
]

export function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('all')
  const { payments, isLoading, error } = usePayments(activeFilter)
  const { summary, isLoading: summaryLoading } = usePaymentsSummary()
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`text-2xl font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>Pagamentos</h1>
        <p className="text-sm text-laurelLeaf">
          Transações e cobranças de assinaturas — dado real, direto da Asaas via webhook. Não precisa mais abrir o painel deles pra conferir.
        </p>
      </div>

      {!summaryLoading && summary && (
        <div className="grid grid-cols-4 gap-4">
          <Card dark={dark}>
            <p className="text-sm text-laurelLeaf">Receita total</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
              R$ {summary.totalRevenue.toFixed(2).replace('.', ',')}
            </p>
          </Card>
          <Card dark={dark}>
            <p className="text-sm text-laurelLeaf">Pagamentos confirmados</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
              {summary.paidCount}
            </p>
          </Card>
          <Card dark={dark}>
            <p className="text-sm text-laurelLeaf">Falhas hoje</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
              {summary.failuresToday}
            </p>
          </Card>
          <Card dark={dark}>
            <p className="text-sm text-laurelLeaf">Reembolsos</p>
            <p className={`mt-2 text-2xl font-semibold ${dark ? 'text-ceilingWhite' : 'text-richBlack'}`}>
              {summary.refundedCount}
            </p>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-pear text-richBlack'
                : dark
                  ? 'border border-surfaceBorder text-laurelLeaf hover:text-ceilingWhite'
                  : 'border border-celeste text-laurelLeaf hover:text-richBlack'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-laurelLeaf">Carregando...</p>
      ) : error ? (
        <p className="text-sm text-red-400">Não foi possível carregar: {error}</p>
      ) : payments.length === 0 ? (
        <EmptyState dark={dark} message="Nenhum pagamento encontrado." />
      ) : (
        <Table dark={dark}>
          <TableHead dark={dark}>
            <tr>
              <TableCell>Usuário</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Gateway</TableCell>
              <TableCell>Data</TableCell>
            </tr>
          </TableHead>
          <tbody>
            {payments.map((p) => (
              <TableRow key={p.id} dark={dark}>
                <TableCell>{p.userName}</TableCell>
                <TableCell>R$ {p.amount.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                  <Badge label={statusLabel[p.status]} tone={statusTone[p.status]} />
                </TableCell>
                <TableCell>{p.gateway}</TableCell>
                <TableCell>{formatDate(p.paidAt ?? p.createdAt)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}