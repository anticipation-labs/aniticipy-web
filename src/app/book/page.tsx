import type { Metadata } from "next";
import { CustomerFrame } from "@/components/customer/CustomerFrame";

export const metadata: Metadata = {
  title: "Book a call: Anticipy",
  description:
    "Book a quick call with the Anticipy team. Questions about the pendant, pre-orders, or privacy: pick a time that works for you.",
};

const CAL_LINK = "https://calendar.app.google/QnCVQxa9Aj3x8QKD7";
const CAL_EMBED =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ30VqtLax0yLxRLrPymbks4JOmA39jo2X42gUw6FC_9O5BgpgkH5ch_fHDgSPp7YPHcVNg85McP?gv=true";

export default function BookPage() {
  return (
    <CustomerFrame>
      <main id="page-content" tabIndex={-1} className="ac-main ac-enter">
        <div className="ac-book-grid">
          <div>
            <p className="ac-eyebrow">A conversation goes a long way</p>
            <h1>Let’s talk.</h1>
            <p className="ac-lead">
              Questions about the pendant, your order or your privacy? Find a
              time that works for you.
            </p>
            <p className="ac-aside-link">
              Prefer email?
              <br />
              <a href="mailto:hello@anticipy.ai">hello@anticipy.ai ↗</a>
            </p>
            <p className="ac-aside-link">
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-text-link"
              >
                Open the booking calendar ↗
              </a>
            </p>
          </div>
          <div className="ac-calendar">
            <iframe
              src={CAL_EMBED}
              width="100%"
              height="720"
              title="Book an Anticipy call"
            />
          </div>
        </div>
      </main>
    </CustomerFrame>
  );
}
