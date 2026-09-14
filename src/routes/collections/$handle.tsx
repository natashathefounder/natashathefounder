import { createFileRoute } from "@tanstack/react-router";
import { getCatalogue } from "@/lib/commerce/catalogue";
import { searchParams } from "@/lib/commerce/search";
import { CataloguePage } from "@/components/catalogue-page";
import { Loading } from "@/components/commerce";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/collections/$handle")({
  validateSearch: searchParams,
  loaderDeps: ({ search }) => search,
  loader: ({ deps, params }) =>
    getCatalogue({
      data: { ...deps, collection: params.handle === "all" ? undefined : params.handle },
    }),
  pendingComponent: Loading,
  head: ({ loaderData, params }) =>
    pageHead(
      `${loaderData?.collections[0]?.title || "Collection"} — ORA Jewellery`,
      loaderData?.collections[0]?.description || "Discover the ORA Jewellery collection.",
      `/collections/${params.handle}`,
    ),
  component: Page,
});
function Page() {
  const data = Route.useLoaderData();
  const { handle } = Route.useParams();
  return (
    <CataloguePage
      {...Route.useSearch()}
      data={data}
      title={
        handle === "all" ? "The complete edit." : data.collections[0]?.title || "The collection."
      }
      path={`/collections/${handle}`}
    />
  );
}
