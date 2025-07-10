 import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ctx}) => {
      const projects = await ctx.db.project.findMany({
        orderBy: {createdAt: "desc"}
      })
      return projects ?? null
    }),

  getByCompanyId: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      return await ctx.db.project.findMany({
        orderBy: {createdAt: "desc"},
        where: {companyId: input}
      })
    }),
  
  createPost: protectedProcedure
    .input(z.object({
      title: z.string(),
      category: z.string(),
      deadline: z.string(),
      budget: z.number(),
      description: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
      return await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          budget: input.budget,
          deadline: input.deadline,
          category: input.category,
          companyId: ctx.session.user.id
        }
      })
    }),

  getProjectName: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      return await ctx.db.project.findUnique({
        where: {
          id: input
        },
        select: {
          title: true
        }
      })
    })
});
