import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /download — hand over the current Anticipy for Mac.
 *
 * The app is one committed, notarized zip in the main repository
 * (backend/pb_public/mac/Anticipy-for-Mac.zip), served by the API Worker as
 * a static asset. This route used to redirect to /dl/Anticipy_1.0.0_aarch64.dmg,
 * the May 2026 build of the previous desktop app — a different product at a
 * different version — and its HEAD handler answered 200 with hand-written
 * headers for a file this route never served, so `curl -I` said the download
 * was fine while a GET handed a stranger 2.5 GB of the wrong thing
 * (anticipation-labs/Anticipy#37).
 *
 * Both methods redirect now, so what `curl -I -L` reports is what a GET gets.
 * The legacy DMG stays reachable at its own /dl/ path for anything that still
 * names it.
 */
const MAC_APP_URL = "https://api.anticipy.ai/mac/Anticipy-for-Mac.zip";

export function GET(): NextResponse {
  return NextResponse.redirect(MAC_APP_URL, { status: 302 });
}

export function HEAD(): NextResponse {
  return NextResponse.redirect(MAC_APP_URL, { status: 302 });
}
