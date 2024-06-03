import { z } from "zod";

export const routeSchema = z.object({
  id: z.number(),
  url: z.string().min(1),
  weight: z.number().optional().default(1),
});

export const tokenSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  healthRoute: z.string().min(3),
  token: z.string(),
});

export const tokensSchema = z.array(tokenSchema);
export const tokenWithRoutesSchema = tokenSchema.extend({ routes: z.array(routeSchema) });

export type Route = z.infer<typeof routeSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
