import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The site uses NO ISR, no generateStaticParams, no revalidate/revalidateTag,
// no unstable_cache and no draftMode (verified across src/). So the
// incremental cache does not need to be configured for correctness -- the
// single hardest part of an OpenNext port simply is not present here.
export default defineCloudflareConfig({});
