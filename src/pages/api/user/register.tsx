import { signUp } from "@/services/auth/services";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await signUp(
      req.body,
      (result: { status: boolean; code: number; message: string }) => {
        res.status(result.code).json({
          status: result.status,
          statusCode: result.code,
          message: result.message,
        });
      }
    );
  } else {
    res
      .status(405)
      .json({ status: false, statusCode: 405, message: "Method not allowed" });
  }
}
