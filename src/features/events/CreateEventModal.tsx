import { FormEvent, useState } from 'react'
import { X } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { CreateEventPayload } from './api'

interface CreateEventModalProps {
  onClose: () => void
  onCreate: (input: CreateEventPayload) => Promise<void>
}

const inputClass =
  'w-full rounded-lg border border-surfaceBorder bg-surface px-3 py-2 text-sm text-ceilingWhite outline-none placeholder:text-laurelLeaf/60 focus:border-pear'

export function CreateEventModal({ onClose, onCreate }: CreateEventModalProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!name.trim() || !date || !location.trim()) {
      setError('Preencha nome, data e localização.')
      return
    }

    setError(null)
    setSaving(true)
    try {
      await onCreate({
        name: name.trim(),
        location: location.trim(),
        eventDate: new Date(date).toISOString(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o evento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ceilingWhite">Novo evento</h2>
          <p className="mt-1 text-sm text-laurelLeaf">
            Participantes e status ficam disponíveis a partir de agora, geridos pela API.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-laurelLeaf transition-colors hover:bg-white/5 hover:text-ceilingWhite"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ceilingWhite">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Batalha de Crews — Zona Leste vs Zona Sul"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ceilingWhite">Data</span>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ceilingWhite">Localização</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Parque Ibirapuera, São Paulo"
            className={inputClass}
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-pear px-4 py-2 text-sm font-medium text-richBlack transition-colors hover:bg-pear/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Criando...' : 'Criar evento'}
          </button>
        </div>
      </form>
    </Modal>
  )
}