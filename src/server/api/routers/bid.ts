import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const bidRouter = createTRPCRouter({
    getByProjectId: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            const bids = ctx.db.bid.findMany({
                where: {
                    projectId: input,
                }
            })
            return bids
        }),
    createBid: protectedProcedure
        .input(z.object({
            projectId: z.string(),
            message: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            return ctx.db.bid.create({
                data: {
                    message: input.message,
                    studentId: ctx.session.user.id,
                    projectId: input.projectId,
                }
            })
        })
})