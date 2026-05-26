type LoadingBarProps = {
  loading: boolean;
};

export function LoadingBar({ loading }: LoadingBarProps) {
  if (!loading) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-50 overflow-hidden">
      <div className="h-full bg-[var(--back-accent)] animate-loading-bar" />
    </div>
  );
}
