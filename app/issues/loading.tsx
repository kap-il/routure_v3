export default function IssuesLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="pt-10 pb-8 text-center">
        <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-10 w-48 mx-auto bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-px w-14 mx-auto bg-gray-300" />
      </header>
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px] pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-sm overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
