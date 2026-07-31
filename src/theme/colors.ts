// Espelha src/theme/colors.ts do app mobile (React Native/Expo)
export const colors = {
  pear: '#BCFF00',
  richBlack: '#061414',
  laurelLeaf: '#96998C',
  celeste: '#D2D3CE',
  ceilingWhite: '#E9EBE6',
} as const

export type ColorToken = keyof typeof colors
