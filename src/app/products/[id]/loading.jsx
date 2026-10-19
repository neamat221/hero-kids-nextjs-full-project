export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-base-300" />
        <div className="h-4 w-16 rounded bg-base-300" />
        <div className="h-4 w-28 rounded bg-base-300" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-base-300" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-base-300" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-4 w-48 rounded bg-base-300" />
          <div className="h-10 w-3/4 rounded bg-base-300" />
          <div className="h-5 w-1/2 rounded bg-base-300" />
          <div className="h-16 w-full rounded-2xl bg-base-300" />
          <div className="h-12 w-full rounded-full bg-base-300" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-base-300" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-base-300" />
            <div className="h-4 w-5/6 rounded bg-base-300" />
            <div className="h-4 w-2/3 rounded bg-base-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
