import { string, uuid, z } from 'zod'

export const jwtPayloadSchema = z.object({
    userId: z.uuid()
});