import { useState } from 'react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { usePayments, PaymentFilter } from './usePayments'
import { formatDate } from '../../lib/format'
import { PaymentStatus } from '../../types'

const statusTone: Record<PaymentStatus, 'success' | 'danger' | 'neutral' | 'warning'> = {
  success: 'success',
  failed: 'danger',
  refunded: 'neutral',
  disputed: 'warning',
}

const statusLabel: Record<PaymentStatus, string> = {
  success: 'Sucesso',
  failed: 'Falha',
  refunded: 'Reembolsado',
  disputed: 'Em disputa',
}

const filters: { key: PaymentFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'success', label: 'Sucesso' },
  { key: 'failed', label: 'Falha' },
  { key: 'refunded', label: 'Reembolsado' },
  { key: 'disputed', label: 'Em disputa' },
]

export function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('all')
  const { payments, isLoading, error } = usePayments(activeFilter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ceilingWhite">Pagamentos</h1>
        <p className="text-sm text-laurelLeaf">Transações e cobranças de assinaturas</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-pear text-richBlack'
                : 'border border-surfaceBorder text-laurelLeaf hover:text-ceilingWhite'
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
        <EmptyState dark message="Nenhum pagamento encontrado." />
      ) : (
        <Table dark>
          <TableHead dark>
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
              <TableRow key={p.id} dark>
                <TableCell>{p.userName}</TableCell>
                <TableCell>R$ {p.amount.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                  <Badge label={statusLabel[p.status]} tone={statusTone[p.status]} />
                </TableCell>
                <TableCell>{p.gateway}</TableCell>
                <TableCell>{formatDate(p.paidAt)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}