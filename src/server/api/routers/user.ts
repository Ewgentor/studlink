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
            const data: Record<string, string | number | Array<string>> = {}
            input.name && (data.name = input.name);
            input.role && (data.role = input.role);
            input.bio && (data.bio = input.bio);
            input.rating && (data.rating = input.rating);
            input.skills && (data.skills = input.skills);


            return await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: data
            })
        }),
})