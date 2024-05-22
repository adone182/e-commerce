import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const onlyAdmin = ["admin"];
const authPage = ["auth"];

export default function WithAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const pathSegment = pathname.split("/")[1];

    if (requireAuth.includes(pathSegment)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token && !authPage.includes(pathSegment)) {
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURIComponent(req.url));
        return NextResponse.redirect(url);
      }

      if (token) {
        if (authPage.includes(pathSegment)) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        if (token.role !== "admin" && onlyAdmin.includes(pathSegment)) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    return middleware(req, event);
  };
}
