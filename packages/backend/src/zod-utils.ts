import { z } from 'zod'

export const address = z.string().startsWith('0x').length(42)
