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
        })
})