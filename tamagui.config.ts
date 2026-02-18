import { config as baseConfig } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const appConfig = createTamagui(baseConfig)

export default appConfig

export type AppTamaguiConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
