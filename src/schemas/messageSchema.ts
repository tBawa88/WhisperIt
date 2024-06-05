import { z } from 'zod';

export const messageSchema = z.object({
    content: z.string()
        .min(10, { message: 'Message must be atleast 6 characters' })
        .max(300, { message: "Message cannot be more than 300 characters" })
});