import cookie from "cookie"
import formidable, { Fields, Files } from "formidable"
// import Database from "@/server/database"

class Backend {
  getIpAddress(context: { req: { socket: { remoteAddress: any } } }) {
    return context.req.socket.remoteAddress
  }

  isUUID(id: string) {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    return regexExp.test(id)
  }

  setAuthCookie(
    context: { res: { setHeader: (arg0: string, arg1: string) => void } },
    token: string
  ) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })
    )
  }

  deleteAuthCookie(context: {
    req?:
      | { cookies: { authToken: string } }
      | { cookies: { authToken: string } }
    res?: any
  }) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      })
    )
  }

  // hasAuthTokenExpired(token: Token) {
  //   return Date.now() - new Date(token.createdAt).getTime() + 60 * 60 <= 0
  // }

  async parseMultipart(context: { req: any }) {
    return await new Promise((resolve, reject) => {
      formidable().parse(
        context.req,
        (error: any, body: Fields, files: Files) => {
          if (error) return reject(error)
          context.req.body = body
          context.req.files = files
          return resolve({ body, files })
        }
      )
    })
  }

  // async login(context: any, token: string) {
  //   this.setAuthCookie(context, token)
  // }

  // async logout(context: { req: { cookies: { authToken: string } } }) {
  //   const token =
  //     context.req.cookies.authToken &&
  //     this.isUUID(context.req.cookies.authToken) &&
  //     (await Database.AuthToken.findByPk(context.req.cookies.authToken))
  //   token && (await token.destroy())

  //   this.deleteAuthCookie(context)
  // }

  // async getAuthenticatedUser(context: {
  //   req: { cookies: { authToken: string } }
  // }) {
  //   if (!context.req.cookies.authToken) return null
  //   const token =
  //     this.isUUID(context.req.cookies.authToken) &&
  //     (await Database.AuthToken.findByPk(context.req.cookies.authToken))

  //   if (!token) return null
  //   else if (this.hasAuthTokenExpired(token)) {
  //     this.deleteAuthCookie(context)
  //     await token.destroy()
  //     return null
  //   }
  //   return (await Database.User.findByPk(token.user_id)) || null
  // }
}

export default new Backend()
