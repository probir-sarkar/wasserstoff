import { RequestHandler } from "express";

export const verifyIncoming: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!id || id === "") {
    return res.status(400).json({ message: "Id is required" });
  }
  console.log(`Incoming request with id: ${id}`);

  next();
};
