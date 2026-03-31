export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-[80px]">
        <div className="mt-10 rounded-sm overflow-hidden bg-gray-200 animate-pulse" style={{ height: '480px' }} />
        <div className="h-px bg-[#E0E0E0] mt-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
          <div className="h-64 bg-gray-200 rounded-sm animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
