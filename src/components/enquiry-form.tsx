import { useState } from "react";
export function EnquiryForm({ custom = false }: { custom?: boolean }) {
  const [draft, setDraft] = useState("");
  return (
    <>
      <form
        className="enquiry-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const body = Array.from(f.entries())
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n\n");
          const subject = custom ? "A personal jewellery enquiry" : "A conversation with Natasha";
          setDraft(
            `mailto:me@natashathefounder.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          );
        }}
      >
        <label>
          Your name
          <input name="Name" required autoComplete="name" maxLength={100} />
        </label>
        <label>
          Email address
          <input name="Email" required type="email" autoComplete="email" maxLength={254} />
        </label>
        <label>
          What would you like to discuss?
          <select name="Topic" defaultValue={custom ? "Custom jewellery" : "General enquiry"}>
            <option>General enquiry</option>
            <option>Custom jewellery</option>
            <option>Coaching</option>
            <option>Private salon</option>
            <option>Events</option>
            <option>Newsletter</option>
          </select>
        </label>
        <label>
          Phone (optional)
          <input name="Phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        {custom && (
          <>
            <label>
              Your comfortable budget (GBP)
              <input
                name="Budget GBP"
                placeholder="Share a range, or ask for guidance"
                maxLength={100}
              />
            </label>
            <label>
              Occasion or intended recipient
              <input
                name="Occasion"
                placeholder="A milestone, a person, yourself…"
                maxLength={200}
              />
            </label>
            <label>
              Material preferences
              <input
                name="Materials"
                placeholder="Metal, stone, finish, or open to ideas"
                maxLength={200}
              />
            </label>
            <label>
              Desired date (if any)
              <input name="Desired date" type="date" />
            </label>
          </>
        )}
        <label className="wide">
          {custom ? "Tell us the story behind your piece" : "Your message"}
          <textarea name="Message" required rows={5} maxLength={3000} />
        </label>
        <label className="consent wide">
          <input type="checkbox" name="Enquiry consent" value="Agreed" required />
          <span>
            I agree that my details may be used to respond to this enquiry.{" "}
            <a href="/pages/privacy" className="underline">
              Privacy information
            </a>
            .
          </span>
        </label>
        <label className="consent wide">
          <input
            type="checkbox"
            name="Letters consent"
            value="I would like to receive brand letters"
          />
          <span>
            I would also like to hear about new pieces, stories and invitations. Optional.
          </span>
        </label>
        <div className="wide">
          <button className="button" type="submit">
            Prepare my enquiry ↗
          </button>
          <p className="small muted mt-4">
            This prepares an email for you to review and send. Nothing is submitted automatically.{" "}
            {custom ? "You can attach inspiration images in your email application." : ""}
          </p>
        </div>
      </form>
      {draft && (
        <div className="notice" role="status">
          <h2 className="text-3xl">Your enquiry is ready to review.</h2>
          <p>
            Open the draft below, check it, then send it from your email application. This page has
            not sent an enquiry or confirmed a booking.
          </p>
          <a className="button" href={draft}>
            Open my email draft ↗
          </a>
          <p className="small mt-4">
            If no email application opens, write to me@natashathefounder.com.
          </p>
        </div>
      )}
    </>
  );
}
