export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="pt-8 md:pt-12 pb-8 md:pb-10 text-center px-5 md:px-0">
        <div className="h-3 w-20 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-10 w-48 mx-auto bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-px w-14 mx-auto bg-gray-300 mb-4" />
        <div className="h-3 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
      </header>
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px] pb-16 md:pb-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 py-7 md:py-8 border-b" style={{ borderColor: '#E8E8E6' }}>
            <div className="w-full md:w-[240px] shrink-0 rounded-sm bg-gray-200 animate-pulse" style={{ aspectRatio: '3/2' }} />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
