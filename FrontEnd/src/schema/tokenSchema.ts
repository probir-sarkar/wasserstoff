import { z } from "zod";

export const routeSchema = z.object({ id: z.number(), url: z.string(), weight: z.number().optional().default(1) });

export const tokenSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    healthRoute: z.string(),
    token: z.string(),
    routes: z.array(routeSchema).optional(),
  })
);

export type Route = z.infer<typeof routeSchema>;
export type Token = z.infer<typeof tokenSchema>;
