import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/members")({
  head: () =>
    pageHead(
      "The private salon — Natasha The Founder",
      "A quieter space for ORA private edits, early access and premier invitations.",
      "/members",
    ),
  component: () => (
    <main>
      <section className="salon-hero">
        <div>
          <p className="eyebrow">THE PRIVATE SALON / AN INVITATION</p>
          <h1>
            Come a little
            <br />
            <i>closer.</i>
          </h1>
          <p>
            A private space for a more personal relationship with the house. Selected offers, early
            access and invitations will appear when confirmed.
          </p>
          <div className="actions">
            <a className="button light" href="https://i6z1cd-5f.myshopify.com/account">
              Sign in with Shopify ↗
            </a>
            <a className="text-link" href="/contact?topic=membership">
              Ask about membership
            </a>
          </div>
          <p className="small mt-5">
            New here? Follow Shopify’s account sign-in to create or access your customer account.
            Membership benefits require separate confirmation.
          </p>
        </div>
        <div className="salon-art">
          <img
            src="/media/atmosphere.webp"
            width="1536"
            height="1024"
            alt="Dark stone and oxblood fabric, an atmospheric still life"
            loading="lazy"
          />
        </div>
      </section>
      <section className="section feature-grid">
        <article>
          <p className="eyebrow">THE PRIVATE EDIT</p>
          <h2>Something set aside.</h2>
          <p>
            No private product releases or discount codes are currently confirmed here. We will not
            invent an offer to fill the space.
          </p>
        </article>
        <article>
          <p className="eyebrow">PREMIER INVITATIONS</p>
          <h2>The room before the crowd.</h2>
          <p>Confirmed event details and access requirements will be published when available.</p>
          <a className="text-link" href="/events">
            Explore events ↗
          </a>
        </article>
        <article>
          <p className="eyebrow">YOUR RELATIONSHIP WITH THE HOUSE</p>
          <h2>On your terms.</h2>
          <p>
            Manage your customer profile and orders through your Shopify account. Contact us to
            discuss your interests and communication preferences.
          </p>
          <a className="text-link" href="https://i6z1cd-5f.myshopify.com/account">
            Profile & orders ↗
          </a>
        </article>
      </section>
    </main>
  ),
});
