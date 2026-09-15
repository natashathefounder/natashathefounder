export const SITE = "https://www.natashathefounder.com";
export function pageHead(title: string, description: string, path: string) {
  return {
    meta: [{ title }, { name: "description", content: description }],
    links: [{ rel: "canonical", href: SITE + path }],
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
