export function LoadingBar({ loading }: { loading: boolean }) {
  return loading ? (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 overflow-hidden">
      <div className="h-full bg-[#00d58e] animate-loading-bar"></div>
    </div>
  ) : null;
}