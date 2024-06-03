import { ZodError } from "zod";
import type { RequestHandler } from "express";
export const formatZodErrors = (errors: ZodError<any>): any => {
  return errors.errors.map((error) => ({
    path: error.path[0],
    message: error.message,
  }));
};

export const tryCatch =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
