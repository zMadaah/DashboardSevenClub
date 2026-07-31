import { Table, TableHead, TableRow, TableCell } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { events } from './mocks'
import { EventStatus } from './types'

const statusTone: Record<EventStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  scheduled: 'neutral',
  live: 'success',
  finished: 'neutral',
  cancelled: 'danger',
}

const statusLabel: Record<EventStatus, string> = {
  scheduled: 'Agendado',
  live: 'Ao vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

export function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-richBlack">Evento</h1>
        <button className="rounded-lg bg-pear px-4 py-2 text-sm font-medium text-richBlack">
          Novo evento
        </button>
      </div>

      <Table>
        <TableHead>
          <tr>
            <TableCell>Nome</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Participantes</TableCell>
            <TableCell>Status</TableCell>
          </tr>
        </TableHead>
        <tbody>
          {events.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.date}</TableCell>
              <TableCell>{e.participants}</TableCell>
              <TableCell>
                <Badge label={statusLabel[e.status]} tone={statusTone[e.status]} />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
