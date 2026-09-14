import { createFileRoute } from "@tanstack/react-router";
import { getCatalogue } from "@/lib/commerce/catalogue";
import { searchParams } from "@/lib/commerce/search";
import { CataloguePage } from "@/components/catalogue-page";
import { Loading } from "@/components/commerce";
export const Route = createFileRoute("/search")({
  validateSearch: searchParams,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getCatalogue({ data: deps }),
  pendingComponent: Loading,
  head: () => ({
    meta: [{ title: "Search — ORA Jewellery" }, { name: "robots", content: "noindex,follow" }],
  }),
  component: function Page() { return (
    <CataloguePage
      {...Route.useSearch()}
      data={Route.useLoaderData()}
      title="Find your own signature."
      path="/search"
    />
  ); },
});
