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
            const bids = await ctx.db.bid.findMany({
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
            return await ctx.db.bid.create({
                data: {
                    message: input.message,
                    studentId: ctx.session.user.id,
                    projectId: input.projectId,
                }
            })
        }),
    changeBid: protectedProcedure
        .input(z.object({
            bidId: z.string(),
            message: z.string().optional(),
            status: z.string().optional(),
        }))
        .mutation(async ({ctx, input}) => {
            const data: Record<string, string> = {}
            input.message ? data.message = input.message : null
            input.status ? data.status = input.status : null

            return await ctx.db.bid.update({
                where: {
                    id: input.bidId
                },
                data: data
            })
        })
})