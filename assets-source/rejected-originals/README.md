# Rejected product originals — NOT for use, NOT to be served

The renders that were rejected for carrying the defects the media policy names:
engraved chain tags, backwards pendants, wrong geometry. `hero.png` and
`lifestyle-male.png` are the two called out by name. Kept as the record of what
was rejected, so nobody regenerates them believing they are new.

## Why they are not in public/

`public/` is served verbatim, so while they lived at
`public/images/originals_backup/` every one of them was fetchable:

    $ curl -o /dev/null -w '%{http_code} %{size_download}' \
        https://www.anticipy.ai/images/originals_backup/hero.png
    200 1279767

A rejected product image, carrying the exact defect the policy forbids,
answering 200 on the marketing domain. They are also 23 MB re-uploaded on every
deploy for files nothing references.

Nothing but prose ever referenced them. `assets-source/` is not served and is
not part of the build.

They are NOT duplicates of the live images: every file differs in byte size from
its counterpart in `public/images/`. These are the earlier takes.
