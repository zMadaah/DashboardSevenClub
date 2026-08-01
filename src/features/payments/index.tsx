import { useState } from 'react'
import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { payments } from './mocks'
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

type FilterOption = 'all' | PaymentStatus

const filters: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'success', label: 'Sucesso' },
  { key: 'failed', label: 'Falha' },
  { key: 'refunded', label: 'Reembolsado' },
  { key: 'disputed', label: 'Em disputa' },
]

export function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')

  const filtered =
    activeFilter === 'all' ? payments : payments.filter((p) => p.status === activeFilter)

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
          {filtered.map((p) => (
            <TableRow key={p.id} dark>
              <TableCell>{p.user}</TableCell>
              <TableCell>R$ {p.amount.toFixed(2).replace('.', ',')}</TableCell>
              <TableCell>
                <Badge label={statusLabel[p.status]} tone={statusTone[p.status]} />
              </TableCell>
              <TableCell>{p.gateway}</TableCell>
              <TableCell>{p.date}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  )
}