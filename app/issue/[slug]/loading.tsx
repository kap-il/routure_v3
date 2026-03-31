export default function IssueLoading() {
  return (
    <div className="min-h-screen bg-[#F5F4F2]">
      <header className="pt-10 pb-8 text-center">
        <div className="h-4 w-32 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-12 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-3" />
        <div className="h-px w-14 mx-auto bg-gray-300" />
      </header>
      <div className="mx-auto max-w-[1280px] px-[80px] pb-20 space-y-5">
        <div className="h-96 bg-gray-200 rounded-sm animate-pulse" />
        <div className="grid grid-cols-3 gap-5">
          <div className="h-48 bg-gray-200 rounded-sm animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-sm animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
