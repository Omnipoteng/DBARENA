export default function Loading() {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(247,247,245,0.92)] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-black/10 border-t-black"
          aria-hidden="true"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
          Maaf agak lama, sedang memuat...
        </p>
      </div>
    </div>
  );
}
