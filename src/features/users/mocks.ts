import { SupportUser } from './types'
import { UserStatus, UserRole } from '../../types'

const firstNames = [
  'Marina', 'Kaique', 'Beatriz', 'Thiago', 'Ana', 'Rodrigo', 'Lucas', 'Camila',
  'Rafael', 'Bianca', 'Gustavo', 'Larissa', 'Eduardo', 'Fernanda', 'Vinícius',
  'Juliana', 'Matheus', 'Patrícia', 'Bruno', 'Carla',
]

const lastNames = [
  'Souza', 'Lima', 'Ramos', 'Costa', 'Martins', 'Nunes', 'Prado', 'Duarte',
  'Oliveira', 'Santos', 'Pereira', 'Almeida', 'Carvalho', 'Ribeiro', 'Barbosa', 'Teixeira',
]

// Mais usuários ativos que qualquer outro status, e assinantes bem mais comuns que admin/gerente.
const statusCycle: UserStatus[] = ['active', 'active', 'active', 'inactive', 'active', 'suspended']
const roleCycle: UserRole[] = [
  'subscriber', 'subscriber', 'subscriber', 'manager',
  'subscriber', 'subscriber', 'subscriber', 'admin',
  'subscriber', 'subscriber',
]

function pad(value: number, length: number) {
  return value.toString().padStart(length, '0')
}

function buildPhone(index: number): string {
  const ddd = 11 + (index % 15)
  const part1 = pad((1000 + index * 37) % 10000, 4)
  const part2 = pad((2000 + index * 91) % 10000, 4)
  return `(${ddd}) 9${part1}-${part2}`
}

export const users: SupportUser[] = Array.from({ length: 42 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[(i * 3 + 1) % lastNames.length]
  const usernameSuffix = ((i * 13 + 7) % 90) + 10

  return {
    id: `usr_${pad(i + 1, 3)}`,
    firstName,
    lastName,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${usernameSuffix}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: buildPhone(i),
    status: statusCycle[i % statusCycle.length],
    role: roleCycle[i % roleCycle.length],
  }
})