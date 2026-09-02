export default function StoreRouteLoading() {
  return (
    <div className="mx-auto grid min-h-[65vh] max-w-7xl animate-pulse grid-cols-1 gap-10 px-5 py-10 sm:px-6 md:py-14 lg:grid-cols-2" role="status">
      <span className="sr-only">Loading</span>
      <div className="aspect-[4/3] bg-[#E9EAEC]" />
      <div className="space-y-5 py-2">
        <div className="h-9 w-3/4 bg-[#E9EAEC]" />
        <div className="h-4 w-2/5 bg-[#E9EAEC]" />
        <div className="h-28 bg-[#E9EAEC]" />
        <div className="h-12 w-2/3 bg-[#E9EAEC]" />
      </div>
    </div>
  );
}
