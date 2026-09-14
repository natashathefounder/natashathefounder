export const stories: Record<
  string,
  { eyebrow: string; title: string; lede: string; sections: [string, string][] }
> = {
  natasha: {
    eyebrow: "The founder",
    title: "A life with a point of view.",
    lede: "Natasha Collins. Founder, jewellery designer, coach and storyteller. The person behind ORA Jewellery.",
    sections: [
      [
        "Jewellery is only the beginning.",
        "This house brings my worlds into one place: the pieces we choose, the stories we carry, and the courage it takes to build something of our own. I want it to feel like a conversation, not a performance.",
      ],
      [
        "Make room for yourself.",
        "There is no single way to be a woman, a founder, or a person with something to say. I am interested in the work of becoming—and in the moments when we realise we do not need permission.",
      ],
      [
        "Come closer.",
        "Explore ORA. Ask about a piece of your own. Or join me for a conversation about what you are building next.",
      ],
    ],
  },
  ora: {
    eyebrow: "ORA Jewellery",
    title: "Your story. Your signature.",
    lede: "Jewellery should feel like an expression of who you are—not a set of instructions for who to become.",
    sections: [
      [
        "A personal language.",
        "A small detail can carry an entire story. A piece worn alone, a collection built over time, something chosen for a person only you know. ORA is a space for that kind of individuality.",
      ],
      [
        "The piece comes first.",
        "The photographs, prices and options in our collection come directly from our Shopify catalogue. Read each piece’s description for its specified materials and details, and ask us when something is not clear.",
      ],
    ],
  },
  origin: {
    eyebrow: "A question of origin",
    title: "Look closer. Ask more.",
    lede: "“Why buy gold or diamonds from China or America when you can purchase directly from their natural source—Africa?”",
    sections: [
      [
        "The question is the starting point.",
        "This is a provocative brand question, not evidence that a particular piece, metal or gemstone was sourced in Africa. It asks us to think about the distance between the things we buy and the stories we are told about them.",
      ],
      [
        "Rooted in African perspective.",
        "Our philosophy is about a closer relationship to source, and about recognising perspectives too often left outside the luxury conversation. It does not mean every material shares one geographic origin.",
      ],
      [
        "Provenance should be visible.",
        "Material origin, where a piece is crafted and where a brand is based are different facts. We do not treat one as proof of another. Our transparency page explains how to read the distinction.",
      ],
    ],
  },
  transparency: {
    eyebrow: "Provenance & transparency",
    title: "A story is not a certificate.",
    lede: "We believe you should be able to see what is known, what is a point of view, and what still needs an answer.",
    sections: [
      [
        "Confirmed facts",
        "Natasha Collins is the founder and creative force behind ORA Jewellery. Product names, prices, variants and descriptions displayed in the shop are supplied by the connected Shopify catalogue. A catalogue statement is not independent certification.",
      ],
      [
        "Brand philosophy",
        "Rooted in African perspective, with an ambition for a closer relationship to source. These describe the brand’s outlook. They are not promises about every material in every piece.",
      ],
      [
        "Material provenance",
        "Gold purity, plating, gemstone identity and geographic origin are only stated where specified for the individual product. An African origin is not assumed. Ask for supporting documentation if material provenance is central to your purchase.",
      ],
      [
        "Craft location",
        "Design location, material origin, assembly and finishing may differ. A craft location is confirmed only when documentation specific to that piece supports it.",
      ],
      [
        "Still requiring verification",
        "Unspecified sourcing, certification, environmental benefits and ethical claims remain unverified. We will not fill those gaps with imagery or language that implies proof. Generated still-life imagery on this site is atmospheric illustration; it does not document a mine, workshop, material supply chain or purchasable piece.",
      ],
    ],
  },
  craftsmanship: {
    eyebrow: "The attention in the detail",
    title: "Good questions make better choices.",
    lede: "Look at the form. Understand the finish. Ask how a piece came to be.",
    sections: [
      [
        "Read the piece",
        "The product description is the first place to look for materials, dimensions and techniques. These details vary between pieces. We do not use one product’s specifications to describe the entire collection.",
      ],
      [
        "What you cannot see",
        "A photograph cannot establish metal purity, gemstone certification or production location. Where that evidence matters to you, ask us before ordering.",
      ],
      [
        "Keep it close",
        "Care should follow the actual material and finish. We can help you ask the right questions for the piece you have chosen.",
      ],
    ],
  },
  delivery: {
    eyebrow: "At your service",
    title: "Before it becomes yours.",
    lede: "Delivery costs and available services are calculated by Shopify at checkout for your address.",
    sections: [
      [
        "A date that matters",
        "If you need a piece for a particular date, contact us before placing an order. We do not automatically promise production or delivery timelines.",
      ],
      [
        "International orders",
        "Available destinations, shipping options and applicable charges are shown at checkout. Ask us about any unclear import or delivery costs before ordering.",
      ],
      [
        "Returns and custom work",
        "Read the store policies shown at checkout before buying. Ask for the applicable return terms and any custom-order conditions in writing. This page does not replace those terms or your statutory rights.",
      ],
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Your information deserves care.",
    lede: "This storefront uses Shopify for product commerce, shopping bags, accounts and checkout.",
    sections: [
      [
        "Essential storage",
        "A private cookie remembers your Shopify bag. Recently viewed pieces are stored on your device. You can clear device history through your browser. These features do not require advertising tracking.",
      ],
      [
        "Enquiries",
        "An enquiry opens a draft in your email application. It is not sent until you send it. Share only information needed for your request. If you ask to receive letters, say so explicitly; a product enquiry does not subscribe you.",
      ],
      [
        "Accounts and payments",
        "Shopify handles account sign-in and payment collection. This app does not collect card details. Shopify’s applicable privacy information is available in its account and checkout experience.",
      ],
      [
        "Analytics",
        "No advertising pixels or optional analytics have been enabled by this storefront upgrade. Future integrations must respect consent.",
      ],
      [
        "Your questions",
        "Contact me@natashathefounder.com about access, correction or deletion requests. The business privacy notice and retention policy require owner review before launch.",
      ],
    ],
  },
  terms: {
    eyebrow: "Before you order",
    title: "Clarity comes first.",
    lede: "Shopify checkout presents the applicable commercial terms and final order total.",
    sections: [
      [
        "Product information",
        "Prices and availability may change. Check your selected variant, material description and final checkout details before completing a purchase.",
      ],
      [
        "No assumed guarantees",
        "We do not imply a sourcing certification, production location, warranty or delivery promise where the product information does not establish it.",
      ],
      [
        "Launch review",
        "Complete business terms, legal business identity and applicable store policies must be reviewed by the owner before this preview is approved for production.",
      ],
    ],
  },
};
export const journal: Record<string, { title: string; lede: string; body: string }> = {
  "a-question-of-origin": {
    title: "The question before the purchase.",
    lede: "Where did it come from? A simple question, with more than one answer.",
    body: "A brand’s address is not a gemstone’s origin. A beautiful image is not a certificate. The interesting conversation begins when we separate what we know from what we assume. That is the perspective behind this house: ask better questions, and make room for clearer answers.",
  },
  "your-own-signature": {
    title: "The pieces you make yours.",
    lede: "Style is not always about adding more. Sometimes it is about recognising what already feels like you.",
    body: "A piece can be a punctuation mark. Quiet, emphatic, entirely personal. The invitation is to choose with attention: to your own taste, to the details of the object, and to the story you want to carry. There is no correct collection to build.",
  },
  "permission-to-begin": {
    title: "Permission to begin.",
    lede: "The perfect moment rarely announces itself.",
    body: "Building something asks for a particular kind of honesty. What do you want? What can you do now? What question have you been avoiding? Founder conversations belong here because a business, like a personal style, begins with a point of view—and becomes real through the choices that follow.",
  },
};
