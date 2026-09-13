import { StrictMode, type CSSProperties, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import coachCheer from './assets/coach-cheer.webp'
import { QUOTE } from './data/quote'
import './index.css'

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }
const SERIF: CSSProperties = { fontFamily: 'Georgia, "Times New Roman", "Noto Serif", serif' }
const HYPH = { hyphens: 'auto', WebkitHyphens: 'auto' } as CSSProperties
const ACCENT = '#6AA0FF'

const COLON = QUOTE.text.indexOf(':')
const LEAD = QUOTE.text.slice(0, COLON)
const TAIL = QUOTE.text.slice(COLON + 1).trim()

function Frame({ n, title, idea, children }: { n: string; title: string; idea: string; children: ReactNode }) {
  return (
    <section id={`v${n}`} className="mb-9">
      <div className="px-5 pb-3">
        <p style={BEBAS} className="text-[19px] uppercase leading-none tracking-[1px] text-white">
          <span style={{ color: ACCENT }}>{n}</span> {title}
        </p>
        <p className="mt-1.5 text-[12px] leading-[1.4] text-white/50">{idea}</p>
      </div>
      <div className="relative overflow-hidden bg-[#0a1119]">{children}</div>
    </section>
  )
}

function Quote({ size = 20 }: { size?: number }) {
  return (
    <>
      <p style={{ ...SERIF, ...HYPH, fontSize: size }} className="leading-[1.3] tracking-[-.02em] text-[#F2F6FB]">
        <span aria-hidden="true" style={{ color: ACCENT }}>
          «
        </span>
        {LEAD}
      </p>
      <p className="mt-3.5 text-[12.5px] leading-[1.6] text-[#93A2B4]">{TAIL}</p>
    </>
  )
}

function Name() {
  return (
    <>
      <p style={BEBAS} className="mt-6 text-[23px] uppercase leading-none tracking-[1px] text-white">
        Гаджиев
      </p>
      <p className="mt-2 text-[12px] leading-[1.4] text-[#93A2B4]">Гаджи Муслимович, автор обучения</p>
    </>
  )
}

const FIG = 'pointer-events-none absolute select-none max-w-none w-auto'

function V01() {
  return (
    <div className="relative min-h-[470px]">
      <span aria-hidden="true" className="absolute inset-x-5 top-[150px] block h-px bg-white/[.07]" />
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 right-0 h-full'} />
      <div className="relative mr-[46%] flex min-h-[470px] flex-col justify-end pb-10 pl-5 pr-2 pt-[186px]">
        <Quote />
        <Name />
      </div>
    </div>
  )
}

function V02() {
  return (
    <div className="relative min-h-[480px]">
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 right-[-14%] h-[96%]'} />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,#0a1119_18%,rgba(10,17,25,.72)_52%,transparent_82%)]"
      />
      <div className="relative flex min-h-[480px] flex-col justify-center px-5 py-10">
        <div className="max-w-[74%]">
          <Quote size={21} />
          <Name />
        </div>
      </div>
    </div>
  )
}

function V03() {
  return (
    <div className="relative min-h-[470px] overflow-hidden">
      <p
        style={BEBAS}
        className="absolute inset-x-0 top-8 px-4 text-center text-[54px] uppercase leading-[.86] tracking-[1px] text-white/[.07]"
      >
        Всю жизнь учишься
      </p>
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 left-1/2 h-[86%] -translate-x-1/2'} />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#0a1119_72%)]" />
      <div className="relative flex min-h-[470px] flex-col justify-end px-5 pb-9">
        <Quote size={18} />
        <Name />
      </div>
    </div>
  )
}

function V04() {
  return (
    <div className="relative min-h-[500px]">
      <span
        aria-hidden="true"
        className="absolute left-[46%] top-[54px] size-[260px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 40% 34%, rgba(120,168,255,.3), rgba(38,66,116,.5) 62%, rgba(16,28,48,.25) 100%)',
        }}
      />
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' left-[46%] top-[10px] h-[330px] -translate-x-1/2'} />
      <div className="relative flex min-h-[500px] flex-col justify-end px-5 pb-9 pt-[356px]">
        <Quote size={19} />
        <Name />
      </div>
    </div>
  )
}

function V05() {
  return (
    <div className="relative min-h-[470px]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[130px] bg-[linear-gradient(180deg,rgba(106,160,255,.12),rgba(10,17,25,0))]"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-[130px] h-px bg-[#6AA0FF]/30" />
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-[130px] right-3 h-[300px]'} />
      <div className="relative flex min-h-[470px] flex-col justify-end px-5 pb-8">
        <div className="max-w-[62%]">
          <Quote size={18} />
          <Name />
        </div>
      </div>
    </div>
  )
}

function V06() {
  return (
    <div className="relative min-h-[440px] px-5 py-10">
      <img
        src={coachCheer}
        alt=""
        aria-hidden="true"
        className="float-right ml-3 h-[360px] w-auto max-w-none select-none"
        style={{ shapeOutside: 'url(' + coachCheer + ')', shapeMargin: 10 }}
      />
      <p style={{ ...SERIF, ...HYPH }} className="text-[19px] leading-[1.34] tracking-[-.02em] text-[#F2F6FB]">
        <span aria-hidden="true" style={{ color: ACCENT }}>
          «
        </span>
        {LEAD}
      </p>
      <p className="mt-3 text-[12.5px] leading-[1.6] text-[#93A2B4]">{TAIL}</p>
      <Name />
    </div>
  )
}

function V07() {
  return (
    <div className="relative min-h-[460px] overflow-hidden">
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' top-0 right-[-16%] h-[640px]'} />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(10,17,25,.92)_58%,#0a1119)]"
      />
      <div className="relative flex min-h-[460px] flex-col justify-end px-5 pb-9">
        <div className="max-w-[80%]">
          <Quote size={20} />
          <Name />
        </div>
      </div>
    </div>
  )
}

function V08() {
  return (
    <div className="relative min-h-[470px]">
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 right-4 h-[210px]'} />
      <div className="relative min-h-[470px] px-5 pt-11">
        <p style={{ ...SERIF, ...HYPH }} className="text-[26px] leading-[1.24] tracking-[-.025em] text-[#F2F6FB]">
          <span aria-hidden="true" style={{ color: ACCENT }}>
            «
          </span>
          {LEAD}
        </p>
        <p className="mt-4 max-w-[58%] text-[12.5px] leading-[1.6] text-[#93A2B4]">{TAIL}</p>
        <div className="max-w-[52%]">
          <Name />
        </div>
      </div>
    </div>
  )
}

function V09() {
  return (
    <div className="relative min-h-[460px]">
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 left-[-10%] h-full'} />
      <span
        aria-hidden="true"
        className="absolute inset-y-9 left-[50%] w-px"
        style={{ backgroundImage: 'linear-gradient(180deg, transparent, ' + ACCENT + '66 24%, ' + ACCENT + '66 74%, transparent)' }}
      />
      <div className="relative ml-[52%] flex min-h-[460px] flex-col justify-center py-10 pl-4 pr-5">
        <Quote size={19} />
        <Name />
      </div>
    </div>
  )
}

function V10() {
  return (
    <div className="relative min-h-[480px] overflow-hidden">
      <img
        src={coachCheer}
        alt=""
        aria-hidden="true"
        className={FIG + ' bottom-0 right-[-26%] h-[118%] opacity-[.16]'}
        style={{ filter: 'grayscale(1) brightness(1.6) blur(3px)' }}
      />
      <img src={coachCheer} alt="" aria-hidden="true" className={FIG + ' bottom-0 right-[2%] h-[88%]'} />
      <div className="relative mr-[44%] flex min-h-[480px] flex-col justify-center py-10 pl-5 pr-2">
        <Quote size={19} />
        <Name />
      </div>
    </div>
  )
}

function Layouts() {
  return (
    <main className="mx-auto w-full max-w-[430px] bg-pitch pb-16 pt-8">
      <div className="px-5 pb-8">
        <p style={BEBAS} className="text-[26px] uppercase leading-none tracking-[1px] text-white">
          Слайд 9: десять вариаций
        </p>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-white/55">
          Кадр с альфой: фигуру больше не нужно никуда вписывать — она может перекрывать, выходить за края и пускать
          текст вокруг себя. Типографика везде одна, чтобы сравнивать композицию.
        </p>
      </div>

      <Frame n="01" title="Перешагивает линию" idea="Линия FAQ закрывает список, фигура её пересекает. Стоит на странице сейчас.">
        <V01 />
      </Frame>
      <Frame n="02" title="Текст поверх фигуры" idea="Цитата ложится на корпус, шторка держит читаемость.">
        <V02 />
      </Frame>
      <Frame n="03" title="Bebas за спиной" idea="Фраза плакатом позади фигуры, на грани видимости.">
        <V03 />
      </Frame>
      <Frame n="04" title="Круг света" idea="Диск позади, фигура выходит за него сверху и снизу.">
        <V04 />
      </Frame>
      <Frame n="05" title="Сцена" idea="Световая полоса-пол: он стоит на ней, а не висит.">
        <V05 />
      </Frame>
      <Frame n="06" title="Обтекание силуэта" idea="Текст течёт по контуру фигуры — shape-outside по альфе.">
        <V06 />
      </Frame>
      <Frame n="07" title="Крупный план" idea="Фигура увеличена и срезана верхом секции, цитата внизу.">
        <V07 />
      </Frame>
      <Frame n="08" title="Минимализм" idea="Маленькая фигура, много воздуха, цитата крупно.">
        <V08 />
      </Frame>
      <Frame n="09" title="Зеркально с нитью" idea="Фигура слева, цитата справа, между ними синяя вертикаль.">
        <V09 />
      </Frame>
      <Frame n="10" title="Двойник" idea="Размытый силуэт позади даёт глубину, резкая фигура впереди.">
        <V10 />
      </Frame>
    </main>
  )
}

const container = document.getElementById('root')
if (!container) throw new Error('Не найден #root')

createRoot(container).render(
  <StrictMode>
    <Layouts />
  </StrictMode>,
)
