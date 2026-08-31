export function SiteHeader() {
  return (
    <header className="bg-black px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <a href="#" className="flex min-w-0 items-start gap-2.5" aria-label="Гаджи Муслимович Гаджиев">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-[#1E5BFF] to-[#3D7CFF] font-badge text-[18px] font-extrabold leading-none text-white shadow-[0_0_18px_rgba(30,91,255,.34)]">
            Г
          </span>
          <span className="min-w-0 pt-0.5 font-badge leading-[1.05]">
            <span className="block truncate text-[11px] font-bold tracking-[.01em] text-white">Гаджи Муслимович</span>
            <span className="block truncate text-[11px] font-bold tracking-[.01em] text-white">Гаджиев</span>
          </span>
        </a>

        <span className="shrink-0 rounded-full border border-white/10 bg-white/12 px-3 py-1.5 font-badge text-[10px] font-semibold tracking-[.01em] text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-xs">
          <span className="mr-1 inline-block size-1 rounded-full bg-white/70 align-middle" />
          Предзапись открыта
        </span>
      </div>
    </header>
  )
}
