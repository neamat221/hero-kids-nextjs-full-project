const ProductsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mb-10 h-10 w-64 rounded bg-base-300" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-base-200 bg-base-100"
          >
            <div className="h-52 w-full bg-base-300" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-5/6 rounded bg-base-300" />
              <div className="h-3 w-2/3 rounded bg-base-300" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-6 w-16 rounded bg-base-300" />
                <div className="h-8 w-16 rounded-full bg-base-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSkeleton;
