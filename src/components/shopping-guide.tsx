import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ArrowLeft, X, Compass, Link2, Circle, Layers } from "lucide-react";

export const charmSystems = [
  {
    name: "Glide & Stack",
    icon: Layers,
    description: "For slider chains with silicone-lined balls.",
    detail:
      "Start with the slider chain you own or are considering. The charm opening and the chain’s fittings both matter.",
  },
  {
    name: "Hoop charms",
    icon: Circle,
    description: "For hoops up to 2.5 mm wide.",
    detail:
      "Check the width of your hoop and the charm’s attachment. A similar appearance does not establish a fit.",
  },
  {
    name: "Clip charms",
    icon: Link2,
    description: "For curve chains or suitable chain links.",
    detail:
      "Check the opening of the clip against the exact link you want to attach it to, including paperclip-style links.",
  },
];
export function ShoppingGuide({
  label = "Help me choose",
  product,
  className = "guide-trigger",
}: {
  label?: string;
  product?: string;
  className?: string;
}) {
  const [step, setStep] = useState<"start" | "existing" | "new" | "details">("start");
  const [system, setSystem] = useState(0);
  const contact = `/contact?topic=Product+guidance${product ? `&piece=${encodeURIComponent(product)}` : ""}`;
  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) setStep("start");
      }}
    >
      <Dialog.Trigger className={className}>
        <Compass size={18} />
        <span>{label}</span>
        <ArrowUpRight size={16} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-shade" />
        <Dialog.Content className="shopping-guide">
          <header>
            <span className="eyebrow">ORA / A LITTLE DIRECTION</span>
            <Dialog.Close className="icon-button" aria-label="Close shopping guide">
              <X />
            </Dialog.Close>
          </header>
          <Dialog.Title>
            A little guidance.
            <br />
            <i>A lot more you.</i>
          </Dialog.Title>
          <Dialog.Description>
            Start with what you have, or what you have in mind. We’ll help you find your next step.
          </Dialog.Description>
          {product && (
            <p className="guide-piece">
              Your piece <strong>{product}</strong>
            </p>
          )}
          {step !== "start" && (
            <button className="text-link guide-back" onClick={() => setStep("start")}>
              <ArrowLeft size={15} /> Back to the beginning
            </button>
          )}
          <div className="guide-body" aria-live="polite">
            {step === "start" ? (
              <div className="guide-choices">
                <button onClick={() => setStep("existing")}>
                  <span className="eyebrow">01 / BUILD ON WHAT YOU HAVE</span>
                  <strong>I have a chain or hoops.</strong>
                  <span>Understand the three charm systems.</span>
                  <ArrowUpRight />
                </button>
                <button onClick={() => setStep("new")}>
                  <span className="eyebrow">02 / A FRESH START</span>
                  <strong>I’m starting something new.</strong>
                  <span>Explore at your own pace.</span>
                  <ArrowUpRight />
                </button>
                <button onClick={() => setStep("details")}>
                  <span className="eyebrow">03 / THE DETAILS MATTER</span>
                  <strong>I have a question about a piece.</strong>
                  <span>Materials, care, sizing or a particular date.</span>
                  <ArrowUpRight />
                </button>
              </div>
            ) : step === "existing" ? (
              <>
                <h3>Start with the connection.</h3>
                <p>
                  These are three different systems. Their charms are not interchangeable across all
                  chains and hoops.
                </p>
                <div className="system-tabs" role="group" aria-label="Learn about a charm system">
                  {charmSystems.map((s, i) => (
                    <button key={s.name} aria-pressed={system === i} onClick={() => setSystem(i)}>
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="system-explanation">
                  <p className="eyebrow">{charmSystems[system].name}</p>
                  <h3>{charmSystems[system].description}</h3>
                  <p>{charmSystems[system].detail}</p>
                </div>
                <p className="guide-note">
                  This explains the systems, not a confirmed match for an individual product. Share
                  the names or links of both pieces if you’re unsure.
                </p>
                <a className="button full" href={contact}>
                  Ask about my combination <ArrowUpRight size={16} />
                </a>
              </>
            ) : step === "new" ? (
              <>
                <h3>Choose a beginning.</h3>
                <p>
                  One piece is enough to start. Explore the shapes you’re drawn to; check the
                  connection before combining charms with a base.
                </p>
                <div className="guide-destinations">
                  <a href="/stack">
                    Explore the charm guide <ArrowUpRight />
                  </a>
                  <a href="/shop?q=chain">
                    Look at chains <ArrowUpRight />
                  </a>
                  <a href="/shop?q=hoop">
                    Look at hoops <ArrowUpRight />
                  </a>
                  <a href="/shop">
                    Browse all jewellery <ArrowUpRight />
                  </a>
                </div>
                <p className="guide-note">
                  Browse links show catalogue search results. They do not certify compatibility.
                </p>
              </>
            ) : (
              <>
                <h3>Good questions make good choices.</h3>
                <ul className="guide-checklist">
                  <li>
                    <strong>What is it made of?</strong> Look for the exact metal, finish and stone
                    in the product description.
                  </li>
                  <li>
                    <strong>How will I care for it?</strong> Ask for guidance for that material and
                    finish.
                  </li>
                  <li>
                    <strong>Will it fit or arrive in time?</strong> Share the measurements or date
                    you need confirmed.
                  </li>
                  <li>
                    <strong>What cover applies?</strong> Ask for the guarantee terms for the
                    particular piece before ordering.
                  </li>
                </ul>
                <a className="button full" href={contact}>
                  Ask about {product ? "this piece" : "a piece"} <ArrowUpRight size={16} />
                </a>
              </>
            )}
          </div>
          <p className="guide-signoff">Your choice. A clearer path.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function DiscoveryEntry() {
  return (
    <section className="discovery-entry" aria-labelledby="discovery-title">
      <div>
        <p className="eyebrow">YOUR STORY, YOUR STARTING POINT</p>
        <h2 id="discovery-title">
          So many possibilities.
          <br />
          <i>One place to begin.</i>
        </h2>
      </div>
      <div>
        <p>
          A new charm. A first chain. Something entirely your own. Find a little direction without
          losing the pleasure of choosing.
        </p>
        <div className="actions">
          <a className="button" href="/stack">
            Explore the charm guide <ArrowUpRight size={16} />
          </a>
          <ShoppingGuide />
        </div>
      </div>
    </section>
  );
}
