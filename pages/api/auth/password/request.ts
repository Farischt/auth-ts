import type { NextApiRequest, NextApiResponse } from "next"

import Database from "server/database"
import type { ApiError } from "api/types"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<any | ApiError>
) {
  if (req.method === "POST") {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    }

    try {
      const user = await Database.User.getByEmail(req.body.email)
      if (!user) {
        res.statusCode = 400
        return res.json({ error: "invalid_email" })
      } else if (!user.verified) {
        res.statusCode = 400
        return res.json({ error: "invalid_email" })
      }

      await Database.PasswordResetToken.destroyUserInvalidToken(user.id)

      if (await Database.PasswordResetToken.getValidToken(user.id)) {
        res.statusCode = 400
        return res.json({ error: "already_sent" })
      }

      const passwordResetToken = await Database.PasswordResetToken.create({
        userId: user.id,
      })

      res.statusCode = 200
      res.json({
        ...passwordResetToken,
      })
    } catch (error) {
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  } else {
    res.statusCode = 405
    res.json({ error: "method_not_allowed" })
  }
}
