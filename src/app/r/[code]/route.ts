import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * A fellow's referral link: anticipy.ai/r/<code>  (and /c/<code>, same handler).
 *
 * This USED TO BE a next.config.mjs rewrite straight to the backend. It is a
 * route handler now because of a difference between platforms that costs money
 * and reports nothing:
 *
 *   The backend answers /r/<code> with a 302 whose Location carries the
 *   attribution -- ?ref=CODE plus the utm campaign. THAT HOP IS THE REFERRAL.
 *
 *   Vercel's rewrite proxy passes the 302 to the browser. OpenNext's does not:
 *   Workers' fetch() defaults to redirect:"follow", so the Worker FOLLOWED the
 *   302 itself and returned the homepage as its own 200. The visitor still
 *   landed on a working page, ?ref never reached the address bar, no Set-Cookie
 *   reached the browser, and the fellow who sent them was never credited.
 *   Nothing errored; a smoke test scored it 200/pass.
 *
 * So the hop is forwarded deliberately, with redirect:"manual", and the
 * upstream status, Location and Set-Cookie are passed through untouched. Same
 * behaviour on both platforms, and it no longer depends on which proxy is
 * underneath.
 */
const ORIGIN =
  process.env.FELLOWSHIP_ORIGIN || "https://backend-production-61e0a.up.railway.app";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = encodeURIComponent(params.code ?? "");
  const home = new URL("/", request.url);

  let upstream: Response;
  try {
    upstream = await fetch(`${ORIGIN}/r/${code}`, {
      redirect: "manual",           // the whole point of this file
      headers: {
        // Let the backend see who is asking; it counts clicks by IP hash.
        "user-agent": request.headers.get("user-agent") ?? "",
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
      },
    });
  } catch {
    // Attribution is worth less than the visit. A backend that cannot be
    // reached must still put somebody on the product.
    return NextResponse.redirect(home, { status: 307 });
  }

  const location = upstream.headers.get("location");
  if (upstream.status >= 300 && upstream.status < 400 && location) {
    const res = NextResponse.redirect(location, { status: upstream.status });
    // Set-Cookie is part of the attribution, not decoration. getSetCookie() is
    // the only correct reader (get() folds multiple cookies into one comma-
    // joined string that no browser will parse), but fall back to get() rather
    // than to [] -- dropping the cookie silently is the exact class of bug this
    // file exists to fix.
    const many = upstream.headers.getSetCookie?.();
    if (many && many.length) {
      for (const c of many) res.headers.append("set-cookie", c);
    } else {
      const one = upstream.headers.get("set-cookie");
      if (one) res.headers.append("set-cookie", one);
    }
    return res;
  }

  // An unknown code, or anything else: still land them on the product. These
  // links are printed in bios and burned into video captions where they cannot
  // be corrected, so a typo must never be a dead end.
  return NextResponse.redirect(home, { status: 307 });
}
