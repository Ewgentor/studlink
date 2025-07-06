import { asyncWrapProviders } from "async_hooks";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.string() )
        .query( async ({ctx, input}) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: input
                }
            })
            return user
        }),
    updateProfile: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            role: z.string().optional(),
            bio: z.string().optional(),
            rating: z.number().optional(),
            skills: z.array(z.string()).optional(),
        }))
        .mutation(async ({ctx, input}) => {
            return await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    role: input.role,
                    bio: input.bio,
                    rating: input.rating,
                    skills: input.skills,
                }
            })
        }),
})