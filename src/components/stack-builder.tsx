import { createElement, useEffect } from "react";
export function StackBuilder({ products }: { products: unknown[] }) {
  useEffect(() => {
    if (!document.querySelector("script[data-ora-stack-runtime]")) {
      const script = document.createElement("script");
      script.src = "/stack-builder.js";
      script.dataset.oraStackRuntime = "true";
      document.body.append(script);
    }
  }, []);
  return (
    <section className="section" id="build-stack" aria-label="Build your charm stack">
      {createElement(
        "ora-stack-builder",
        { "data-mode": "app" },
        <script
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(products).replace(/</g, "\\u003c") }}
        />,
        <p className="stack-loading">
          Preparing your stack builder… If it does not load,{" "}
          <a href="/shop?q=charm">browse charms</a>.
        </p>,
      )}
      <noscript>Enable JavaScript to assemble a stack, or shop individual pieces.</noscript>
    </section>
  );
}
