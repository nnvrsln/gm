import { HeartIcon } from './icons'

export function SiteFooter() {
  return (
    // relative z-10: общий фон секций (CourseBackdrop) — слой в 4200px с
    // z-[3], и он тянется ниже своей обёртки. Пока под программой стояли
    // «Тренер» и форма, подвал был вне его досягаемости; теперь страница
    // кончается программой, и без подъёма подвал уходит под слой.
    <footer className="relative z-10 px-5 pb-4 pt-1">
      <div className="flex items-center justify-center gap-1.5">
        <span className="font-badge text-[11px] font-medium tracking-wide text-white/35">Создано с любовью</span>
        <HeartIcon className="size-3.5 shrink-0" />
        <span className="font-badge text-[11px] font-medium tracking-wide text-white/35">студией</span>
        <a
          href="https://t.me/nnvrsln"
          target="_blank"
          rel="noopener"
          className="font-badge text-[11px] font-semibold tracking-wide text-[#6AA0FF] transition-colors hover:text-white"
        >
          nunaev.ru
        </a>
      </div>
    </footer>
  )
}
