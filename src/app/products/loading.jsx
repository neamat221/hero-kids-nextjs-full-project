import ProductsSkeleton from "@/components/Loading/ProductsSkeleton";

export default function Loading() {
  return (
    <div>
      <section className="border-b border-base-200 bg-base-200/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 px-4 py-12 md:py-16">
          <div className="h-4 w-16 animate-pulse rounded bg-base-300" />
          <div className="h-10 w-56 animate-pulse rounded bg-base-300" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-base-300" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductsSkeleton />
      </div>
    </div>
  );
}
