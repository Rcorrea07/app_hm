/** Barra de status falsa do iPhone. Só aparece dentro da moldura (desktop). */
export function StatusBar() {
  return (
    <div
      aria-hidden
      className="hidden moldura:flex h-[50px] shrink-0 items-end justify-between bg-inatel px-8 pb-1.5 text-[15px] font-semibold text-white"
    >
      <span className="w-12 text-center tabular-nums">9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.7" />
          <rect x="5" y="5" width="3" height="6" rx="0.7" />
          <rect x="10" y="2.5" width="3" height="8.5" rx="0.7" />
          <rect x="15" y="0" width="3" height="11" rx="0.7" opacity="0.4" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 2.2c2.2 0 4.2.8 5.7 2.2l1.1-1.1A9.6 9.6 0 0 0 8 .6 9.6 9.6 0 0 0 1.2 3.3l1.1 1.1A8 8 0 0 1 8 2.2Zm0 3.2c1.3 0 2.5.5 3.4 1.3l1.1-1.1A6.4 6.4 0 0 0 8 3.8c-1.7 0-3.3.7-4.5 1.8l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Zm0 3.2c.5 0 .9.2 1.2.5L8 10.4 6.8 9.1c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="23" height="11" rx="3.5" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="12" height="8" rx="2" fill="currentColor" />
          <path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4Z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
