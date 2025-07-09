import { TRPCError } from "@trpc/server";
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
        }))
        .mutation(async ({ctx, input}) => {
            const existingBid = await ctx.db.bid.findFirst({
                where: {
                    projectId: input.projectId,
                    studentId: ctx.session.user.id
                }
            })
            if (existingBid) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Вы уже откликнулись на это задание"
                })
            }
            return await ctx.db.bid.create({
                data: {
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
            if (input.message) data.message = input.message;
            if (input.status) data.status = input.status;

            return await ctx.db.bid.update({
                where: {
                    id: input.bidId
                },
                data: data
            })
        }),
    countByProjectId: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            return await ctx.db.bid.count({
                where:{
                    projectId: input
                }
            })
        }),
    getByStudentId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.bid.findMany({
        where: { studentId: input },
        include: {
          project: {
            include: {
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }),
    deleteBid: protectedProcedure
    .input(z.string())
    .mutation(async ({ctx, input}) => {
        return await ctx.db.bid.delete({
            where: {
                id: input
            }
        })
    })
})