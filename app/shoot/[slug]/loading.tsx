export default function ShootLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-6 sm:mx-[80px] mt-4 rounded-sm overflow-hidden">
        <div className="w-full bg-gray-200 animate-pulse" style={{ aspectRatio: '3/2' }} />
      </div>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pt-12 pb-6">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-px w-28 bg-gray-300 mb-4" />
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-[80px] pb-10">
        <div className="flex flex-col gap-4">
          <div className="h-80 bg-gray-200 rounded-sm animate-pulse" />
          <div className="flex gap-4">
            <div className="h-48 bg-gray-200 rounded-sm animate-pulse" style={{ flex: 1 }} />
            <div className="h-48 bg-gray-200 rounded-sm animate-pulse" style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
