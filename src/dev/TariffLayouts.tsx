import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  CONTACT_LINKS,
  MATRIX_FOLDED,
  PAY_BUTTONS,
  TARIFFS,
  addedIn,
  formatPrice,
  includedIn,
  tariff,
  whatsappHref,
  type Tariff,
  type TariffId,
} from '../data/tariffs'
import { StarIcon, WhatsAppIcon } from '../components/icons'

/**
 * Макетная слайда 6 «Выбери свой тариф»: три подачи. Отдельная точка входа
 * (tariffs.html → src/tariffs.tsx), в прод-сборку не попадает.
 *
 * ── Что задано ТЗ и не обсуждается ───────────────────────────────────────
 *   1. Заголовок «ВЫБЕРИ СВОЙ ТАРИФ»;
 *   2. «на самом сайте тарифы идут отдельными столбцами» — ощущение колонок
 *      должно сохраниться, хотя три колонки на 430px рядом не встают
 *      (по 130px на каждую, а названия позиций там в 40–70 знаков);
 *   3. «нужно выделить цветом 2-ой тариф и добавить туда значок звездочки и
 *      слово: ХИТ» — ПРЕМИУМ, 64 900 ₽. Выделен ровно один тариф во всех
 *      трёх подачах: два выделенных не выделяют ни одного.
 *
 * ── Два решения, общие для всех трёх подач ───────────────────────────────
 *
 * **Пятнадцать кнопок сведены к пяти (Q17).** В таблице у каждого тарифа
 * пять кнопок, то есть 15 на секцию. Но три из них — рассрочка, клубы и
 * академии, отдельные модули — одинаковые для всех тарифов и от выбора не
 * зависят. Они вынесены одним блоком под сетку. В карточке остаются две:
 * «Оплатить полностью» и «Забронировать за 10 000 ₽», в той же иерархии,
 * что в заливке ячеек исходной таблицы.
 *
 * **Модули 1–5 свёрнуты в одну строку.** Они входят во все три тарифа —
 * пять строк подряд с одинаковыми галочками ничего не сравнивают, а
 * забирают треть высоты. Названия модулей стоят этажом выше, в «Программе
 * обучения». Свёртка живёт в данных (`MATRIX_FOLDED`), не в раскладке.
 *
 * **Описаний позиций здесь нет.** Девять из восемнадцати описаны дословно
 * этажом выше, в «Как проходит обучение» — повторять их в тарифах значит
 * дать вторую стену текста сразу после первой. В сетке заказчика описаний
 * тоже нет, только названия.
 *
 * ── Материал ─────────────────────────────────────────────────────────────
 * Тот же язык, что у остальной страницы: радиус 6px, названия Bebas'ом
 * капслоком, свет волосяной линией и кромкой в 1px.
 *
 * Свечения по краю (`inset`-ореола вокруг блока) нет ни у одной карточки:
 * этот приём на странице занят героем слайда 5, платформой, и второй такой
 * же перестал бы работать выделением. У ПРЕМИУМА в подаче 01 стоит тень
 * **под** карточкой — она поднимает её над лентой, а не обводит светом, и с
 * приёмом платформы не путается.
 *
 * TODO (Q18): номера WhatsApp нет — три ссылки рисуются, но никуда не
 * ведут (`whatsappHref` отдаёт undefined).
 * TODO (Q19): кнопки оплаты — заглушки, по нажатию пишут «Скоро».
 */

// Bebas инлайновым стилем: имя шрифта с пробелами Tailwind как
// arbitrary-значение не разбирает. Та же грабля во всех макетных.
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Синий акцент страницы. Им выделен ПРЕМИУМ — требование ТЗ про «цветом». */
const HIT = '#6AA0FF'

/** Световая кромка в 1px по верхней грани — приём кнопок первого экрана. */
function LightEdge({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{
        backgroundImage: `linear-gradient(90deg,transparent,rgba(255,255,255,${opacity}),transparent)`,
      }}
    />
  )
}

export function TariffLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          «Выбери свой тариф» — три подачи
        </h1>
        <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-white/58">
          Заказчик просит «отдельные столбцы» и выделенный цветом второй тариф со звёздочкой и
          словом ХИТ. Три колонки рядом на 430&nbsp;px не встают — на каждую приходится 130&nbsp;px
          при названиях позиций в 40–70 знаков. Подачи отвечают на это по-разному: 01 сохраняет
          буквальные столбцы прокруткой, 02 отказывается от них ради лестницы «что добавляется за
          доплату», 03 оставляет таблицу сравнения, но делает колонку выбираемой.
        </p>
        <p className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-white/40">
          Во всех трёх: пятнадцать кнопок сведены к пяти (три общих обращения в WhatsApp вынесены
          под сетку), модули 1–5 свёрнуты в одну строку — они входят везде. Каждая подача на
          проектных 430&nbsp;px и на 360&nbsp;px. Оговорка: рамки — это блоки, а не окно браузера,
          медиазапросы по ширине вьюпорта внутри них не срабатывают.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Столбцы"
          why="Буквальное исполнение просьбы: тарифы остаются столбцами, просто столбцы листаются. Карточка 262px прилипает по центру, соседние видны с обеих сторон — «столбцы» из ТЗ читаются даже без прокрутки. Открывается сразу на ПРЕМИУМЕ: его и надо продавать, а СТАНДАРТ виден слева как точка отсчёта. Внутри каждой карточки полный состав из 14 строк, включая то, что в тариф НЕ входит: прочерк напротив SCOUTWAY в ПРЕМИУМЕ продаёт ВИП лучше любого текста — ровно так же работала зачёркнутая строка в исходной таблице. Плата: сравнивать всё равно приходится по памяти — у соседних столбцов видно только край."
          tags={['лента со snap', 'открыта на ПРЕМИУМЕ', 'полный состав в каждой', 'галочки и прочерки']}
        >
          <V1Columns />
        </Frame>

        <Frame
          n="02"
          name="Лестница"
          why="Столбцов нет — есть три ступени одна под другой, и каждая следующая перечисляет только то, что добавляется за доплату. СТАНДАРТ показан целиком (пять строк), ПРЕМИУМ — «всё из стандарта, плюс» шесть позиций, ВИП — «всё из премиума, плюс» три. Разница СТАНДАРТ → ПРЕМИУМ это 15 000 ₽ за шесть позиций, и в такой подаче она видна цифрой и списком одновременно; ПРЕМИУМ выигрывает сам, без уговоров. Самая короткая из трёх и единственная, где ничего не нужно листать. Плата: полного состава ПРЕМИУМА и ВИП на экране нет, он собирается сложением."
          tags={['три карточки стопкой', 'только прибавка', 'самая короткая', 'ничего не листается']}
        >
          <V2Ladder />
        </Frame>

        <Frame
          n="03"
          name="Матрица"
          why="Единственная подача, где три тарифа видно одновременно — то есть та самая таблица из файла заказчика, но работающая на 430px: длинное название позиции слева, три узкие колонки отметок справа. Шапка кликается, выбранная колонка подсвечивается сверху донизу, а пара кнопок внизу подписывается ценой выбранного тарифа. Кнопок в секции получается пять на все три тарифа — меньше, чем в остальных подачах. Плата: три колонки отметок забирают 168px, и на 360px названию остаётся 152px — длинные позиции переносятся в три строки. Самая тесная из трёх."
          tags={['все три сразу', 'колонка выбирается', '5 кнопок на секцию', 'самая тесная']}
        >
          <V3Matrix />
        </Frame>
      </div>
    </div>
  )
}

/* ══ Общие детали ════════════════════════════════════════════════════════ */

function SectionTitle() {
  return (
    <h2 className="section-title text-[32px] uppercase leading-[.94] tracking-title">
      Выбери свой тариф
    </h2>
  )
}

/**
 * Звезда и слово «ХИТ» — дословное требование ТЗ. Стоит только у ПРЕМИУМА.
 * Набрано Bebas'ом, как все ярлыки страницы, и в синем акценте — том же,
 * которым выделена сама карточка.
 */
function HitBadge({ className = '' }: { className?: string }) {
  return (
    <span
      style={{ ...BEBAS, color: '#0A1220', backgroundColor: HIT }}
      className={`inline-flex shrink-0 items-center gap-1 rounded-[3px] px-2 py-[3px] text-[14px] leading-none tracking-[1px] ${className}`}
    >
      <StarIcon className="size-[11px]" />
      ХИТ
    </span>
  )
}

/**
 * Название тарифа и цена. Цена — самый крупный текст карточки после имени.
 *
 * `badge` отключается там, где «ХИТ» уже стоит отдельной шапкой во всю
 * ширину карточки (подача 01): два одинаковых ярлыка в сорока пикселях друг
 * от друга читаются сбоем, а не выделением.
 */
function PriceHead({
  item,
  size = 'full',
  badge = true,
}: {
  item: Tariff
  size?: 'full' | 'compact'
  badge?: boolean
}) {
  const nameSize = size === 'full' ? 'text-[30px]' : 'text-[26px]'
  const priceSize = size === 'full' ? 'text-[38px]' : 'text-[32px]'

  return (
    <div>
      <div className="flex items-center gap-2">
        <h3
          style={BEBAS}
          className={`min-w-0 flex-1 uppercase leading-none tracking-[1px] text-white ${nameSize}`}
        >
          {item.name}
        </h3>
        {item.hit && badge && <HitBadge />}
      </div>
      <p
        style={{ ...BEBAS, color: item.hit ? '#DCE9FF' : '#FFFFFF' }}
        className={`mt-2 leading-none tracking-[1px] tabular-nums ${priceSize}`}
      >
        {formatPrice(item.price)}
      </p>
    </div>
  )
}

/**
 * Индикатор ступени: три деления, залито столько, какой тариф по счёту.
 *
 * Нужен, потому что тарифы идут по возрастанию, а цвет об этом не говорит:
 * сталь, синий и золото — три разных цвета, а не три уровня одного. Деления
 * показывают порядок без единого слова, и придумывать подписи («базовый»,
 * «расширенный») не приходится — их в ТЗ нет, а тексты мы не сочиняем.
 */
function StepMeter({ item }: { item: Tariff }) {
  const step = TARIFFS.findIndex((t) => t.id === item.id)

  return (
    <span aria-hidden="true" className="flex gap-1">
      {TARIFFS.map((_, i) => (
        <span
          key={i}
          className="h-[3px] w-[15px] rounded-full"
          style={{ backgroundColor: i <= step ? item.accent : 'rgba(255,255,255,.22)' }}
        />
      ))}
    </span>
  )
}

/**
 * Отметка «входит / не входит». Галочка и прочерк, а не два разных значка:
 * в исходной таблице «не входит» показано зачёркиванием, то есть отсутствие
 * читается как отсутствие, а не как отдельное свойство.
 */
function Mark({ on, color = HIT }: { on: boolean; color?: string }) {
  if (!on) {
    return (
      <span aria-hidden="true" className="block h-px w-[9px] bg-white/22" />
    )
  }
  return (
    <svg viewBox="0 0 14 12" aria-hidden="true" className="block size-[13px]" fill="none">
      <path
        d="M1.4 6.2l3.6 3.8L12.6 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Две кнопки покупки. Иерархия — из заливки ячеек таблицы заказчика:
 * «Оплатить полностью» яркая, «Забронировать» контурная.
 *
 * Q19: бэкенда нет, обе — заглушки. По нажатию подпись меняется на «Скоро»
 * и возвращается: кнопка обязана отвечать на нажатие, иначе человек решит,
 * что сломался сайт, и уйдёт. Ставятся сеткой, а не флексом в колонку:
 * у .btn-hero-primary в CSS стоит flex:1.15 (это для пары в строку), и в
 * колоночном флексе базис 0% схлопнул бы кнопку по высоте.
 *
 * `accent` передаётся тем тарифам, которые **не** хит: их главная кнопка
 * становится контурной в цвете тарифа, а плоская синяя заливка остаётся
 * ровно у ПРЕМИУМА. Иначе самый громкий элемент карточки — кнопка — у всех
 * трёх одинаковый, и «выделить хит больше всех» ломается именно на нём.
 * Вернуть всем одинаковую синюю заливку — это убрать одно свойство.
 */
function PayButtons({ id, accent }: { id: TariffId; accent?: string }) {
  const [pressed, setPressed] = useState<string | null>(null)
  const name = tariff(id).name

  return (
    <div className="mt-4 grid gap-2">
      {PAY_BUTTONS.map((button, i) => {
        const main = i === 0
        const tinted = main && accent

        return (
          <button
            key={button.action}
            type="button"
            // Тариф назван в aria-label, а не отдельной скрытой строкой: без
            // него скринридер читает три пары одинаковых кнопок подряд.
            aria-label={`${button.label} — тариф ${name}`}
            onClick={() => {
              setPressed(button.action)
              window.setTimeout(() => setPressed(null), 1400)
            }}
            style={
              tinted
                ? {
                    color: accent,
                    border: `1px solid ${accent}80`,
                    backgroundColor: `${accent}1F`,
                  }
                : undefined
            }
            className={`btn-hero w-full ${main ? (tinted ? '' : 'btn-hero-primary') : 'btn-hero-secondary'}`}
          >
            {pressed === button.action ? 'Скоро' : button.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Три обращения, общие для всех тарифов (Q17). Стоят под сеткой отдельным
 * блоком: они не про выбор тарифа, а про то, что делать, если ни один не
 * подошёл. Самая тихая типографика секции — так же они выглядели в
 * заливке ячеек у заказчика.
 *
 * Заголовок блока — единственный текст слайда 6 не из ТЗ.
 */
function ContactBlock() {
  return (
    <div className="mt-7 border-t border-white/10 pt-5">
      <p className="text-[12.5px] leading-[1.45] text-white/45">
        Не подошёл ни один вариант? Напишите в WhatsApp:
      </p>
      <ul className="mt-2.5 flex flex-col gap-px">
        {CONTACT_LINKS.map((link) => (
          <li key={link.key}>
            {/* Q18: номера нет — href отсутствует, ссылка не ведёт никуда.
                Появится номер — заработает без правки вёрстки. */}
            <a
              href={whatsappHref(link.message)}
              className="flex min-h-[44px] items-center gap-2.5 text-[13px] leading-[1.3] text-white/72 underline decoration-white/20 underline-offset-4"
            >
              <WhatsAppIcon className="size-4 shrink-0 fill-white/45" />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ══ 01. Столбцы ═════════════════════════════════════════════════════════
   Тарифы остаются столбцами — столбцы листаются. Лента со snap, карточка
   фиксированной ширины, соседняя видна краем. Открывается на ПРЕМИУМЕ.

   ── Правка по замечаниям владельца ────────────────────────────────────────
   «Не активные столбцы должны быть чуть прозрачными. У каждого столбца свой
   цвет, придумай аналогию цвета к названию. Тарифы идут по возрастанию,
   нужно придумать, как их выделять по-своему. Хит-тариф выделить больше
   всех.» Отсюда четыре вещи:

   1. **Три цвета — три материала ступени:** сталь → синий → золото. Аналогия
      и её обоснование записаны в `data/tariffs.ts`, поле `accent`: все три
      цвета уже работают на странице и значат там то же самое.

   2. **Каждому тарифу — свой приём выделения, а не только свой цвет.** Это
      та же доктрина, что в слайде 5 («цвета мало, у категории должна быть
      своя форма»): СТАНДАРТ идёт без верхней грани и с самой тихой рамкой —
      он точка отсчёта; ПРЕМИУМ получает шапку во всю ширину; ВИП — золотую
      грань в 2px по верху карточки вместо световой кромки.

   3. **Возрастание показано делениями,** а не словами: три штриха под
      названием, залито столько, какой тариф по счёту. Подписи вроде
      «базовый» пришлось бы сочинять, а тексты мы не сочиняем.

   4. **Неактивный столбец приглушён** — `opacity .52` плюс `saturate(.6)`,
      чтобы гас и цвет, а не только яркость. Гасится вся карточка целиком,
      включая кнопки: активная колонка в любой момент ровно одна, и именно
      она принимает нажатие. */

function V1Columns() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<TariffId>('premium')

  // Открыть на ПРЕМИУМЕ. Без анимации и до первой отрисовки: анимированная
  // прокрутка на старте читается как самопроизвольное движение страницы.
  useLayoutEffect(() => {
    const el = track.current
    if (!el) return
    el.scrollLeft = centerOf(el, 1)
  }, [])

  const scrollTo = (index: number) => {
    const el = track.current
    if (!el) return
    // Присваивание scrollLeft, а не scrollTo({behavior:'smooth'}): плавная
    // прокрутка не работает вместе со snap-mandatory — прилипание тянет
    // ленту назад на каждом кадре, и нажатие по точке не двигало её вообще.
    el.scrollLeft = centerOf(el, index)
    setActive(TARIFFS[index].id)
  }

  return (
    <>
      <SectionTitle />

      {/* Лента выходит за боковые поля секции: карточка должна прилипать к
          экрану, а не к полю в 20px. Приём тот же, что у ленты сегментов
          слайда 2.

          Прилипание по центру, а не по левому краю. Со `snap-start` лента,
          открытая на ПРЕМИУМЕ, показывала его вплотную к левому краю — и
          СТАНДАРТ уходил за экран целиком, без единого намёка, что слева
          что-то есть. По центру видно обе соседние карточки, и «столбцы» из
          ТЗ читаются даже без прокрутки.

          Боковое поле — `calc(50% - 131px)`, то есть половина ленты минус
          половина карточки. Процент считается от ширины самой ленты, значит
          формула работает и на 430, и на 360 без медиазапроса; без неё
          крайние карточки не могут доехать до центра, и браузер молча
          прилипает к ближайшей достижимой точке. */}
      <div
        ref={track}
        // calc(50% + 20px - 131px): проценты в padding считаются от ширины
        // содержащего блока, а не самой ленты, а лента на 40px шире него
        // (-mx-5). С честным calc(50% - 131px) крайние карточки вставали не
        // по центру — замер на 360: 22px слева против 61 справа.
        style={{ paddingInline: 'calc(50% + 20px - 131px)' }}
        className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          const el = event.currentTarget
          const index = Math.round(el.scrollLeft / (262 + 12))
          setActive(TARIFFS[Math.min(index, TARIFFS.length - 1)].id)
        }}
      >
        {TARIFFS.map((item) => (
          <ColumnCard key={item.id} item={item} active={active === item.id} />
        ))}
      </div>

      {/* py-3 у ленты — не отступ, а место под тень ПРЕМИУМА: overflow-x
          auto делает и вертикальный overflow неявно скрытым, и без запаса
          тень срезалась по нижней грани ленты. Поэтому у точек ниже
          собственный отступ уже маленький. */}

      {/* Точки — настоящие кнопки с тач-целью 44px. На слайде 2 они сначала
          были span'ами с aria-hidden: зона 20×6px, не нажимались ничем. */}
      <div className="mt-1 flex justify-center gap-1">
        {TARIFFS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Тариф ${item.name}`}
            aria-current={active === item.id}
            onClick={() => scrollTo(i)}
            className="flex size-11 items-center justify-center"
          >
            {/* Точка окрашена в цвет своего тарифа, а не в общий синий:
                иначе полоска под лентой — единственное место, где шкала
                «сталь → синий → золото» прерывается. */}
            <span
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: active === item.id ? 20 : 6,
                backgroundColor: active === item.id ? item.accent : 'rgba(255,255,255,.22)',
              }}
            />
          </button>
        ))}
      </div>

      <ContactBlock />
    </>
  )
}

/**
 * Прокрутка, при которой карточка `index` встаёт по центру ленты.
 *
 * Считается по `getBoundingClientRect`, а не по `offsetLeft`: лента выходит
 * за поля секции отрицательным margin, и её `offsetParent` не совпадает с
 * `offsetParent` карточки — разница в 20px приезжала прямо в результат, и
 * лента открывалась не по центру.
 */
function centerOf(track: HTMLElement, index: number) {
  const card = track.children[index] as HTMLElement | undefined
  if (!card) return track.scrollLeft
  const trackBox = track.getBoundingClientRect()
  const cardBox = card.getBoundingClientRect()
  return track.scrollLeft + (cardBox.left - trackBox.left) - (trackBox.width - cardBox.width) / 2
}

function ColumnCard({ item, active }: { item: Tariff; active: boolean }) {
  const hit = Boolean(item.hit)
  const accent = item.accent

  return (
    <article
      style={{
        width: 262,
        // Рамка и заливка — в цвете тарифа, плотность растёт со ступенью.
        // ПРЕМИУМ идёт заметно плотнее обоих соседей: у него и рамка вдвое
        // насыщеннее, и подложка, и тень. Требование владельца — «хит нужно
        // выделить больше всех».
        borderColor: hit ? `${accent}A6` : `${accent}33`,
        backgroundColor: hit ? 'rgba(76,141,255,.09)' : `${accent}08`,
        boxShadow: hit ? '0 14px 36px rgba(30,91,255,.24)' : 'none',
        // Приглушение неактивных. saturate гасит и цвет, а не только
        // яркость: без него стальной СТАНДАРТ на .52 всё равно оставался
        // таким же серым, как в полную силу, и приглушённым не выглядел.
        opacity: active ? 1 : 0.52,
        filter: active ? 'none' : 'saturate(.6)',
        transition: 'opacity 240ms var(--ease-mass), filter 240ms var(--ease-mass)',
      }}
      className="relative shrink-0 snap-center overflow-hidden rounded-[6px] border"
    >
      {/* Свой приём выделения у каждой ступени.

          ПРЕМИУМ — шапка во всю ширину со звездой и словом «ХИТ» из ТЗ.
          Единственная в секции сплошная заливка акцентом: у соседей цвет
          живёт только в рамке, отметках и кнопке. Карточки в ленте одной
          высоты (флекс тянет их по самой высокой), поэтому шапка не
          выпирает, а забирает верхние 30px самой карточки — её видно
          первой, ещё до названия.

          ВИП — золотая грань в 2px по верхней кромке вместо шапки. Тише
          шапки ровно настолько, чтобы не спорить с хитом, но карточка
          опознаётся сверху, ещё до чтения названия.

          СТАНДАРТ — ничего. Это и есть его приём: точка отсчёта не должна
          выглядеть предложением. */}
      {hit ? (
        <div
          style={{ ...BEBAS, backgroundColor: accent, color: '#0A1220' }}
          className="flex items-center justify-center gap-1.5 py-[7px] text-[15px] uppercase leading-none tracking-[1.5px]"
        >
          <StarIcon aria-hidden="true" className="size-[13px]" />
          Хит
        </div>
      ) : (
        item.id === 'vip' && (
          <div aria-hidden="true" className="h-[2px]" style={{ backgroundColor: accent }} />
        )
      )}

      <div className="relative p-4">
        {!hit && <LightEdge opacity={0.24} />}

        <StepMeter item={item} />
        <div className="mt-3">
          {/* badge отключён: «ХИТ» уже стоит шапкой сверху. */}
          <PriceHead item={item} badge={false} />
        </div>

        <ul className="mt-4 border-t border-white/8">
          {MATRIX_FOLDED.map((feature) => {
            const on = feature.in[item.id]
            return (
              <li
                key={feature.key}
                className="flex items-start gap-2.5 border-b border-white/8 py-2.5 last:border-b-0"
              >
                <span className="mt-[3px] flex size-[13px] shrink-0 items-center justify-center">
                  <Mark on={on} color={accent} />
                </span>
                <span
                  className={`text-[12px] leading-[1.35] ${on ? 'text-white/78' : 'text-white/28'}`}
                >
                  {feature.title}
                </span>
              </li>
            )
          })}
        </ul>

        <PayButtons id={item.id} accent={hit ? undefined : accent} />
      </div>
    </article>
  )
}

/* ══ 02. Лестница ════════════════════════════════════════════════════════
   Три ступени стопкой. Каждая следующая перечисляет только прибавку —
   разница между тарифами становится содержанием, а не выводом из двух
   длинных списков. */

function V2Ladder() {
  return (
    <>
      <SectionTitle />

      <div className="mt-6 flex flex-col gap-3">
        {TARIFFS.map((item, i) => (
          <LadderCard key={item.id} item={item} previous={TARIFFS[i - 1]} />
        ))}
      </div>

      <ContactBlock />
    </>
  )
}

function LadderCard({ item, previous }: { item: Tariff; previous?: Tariff }) {
  const hit = Boolean(item.hit)
  // Первая ступень показывается целиком, остальные — только прибавкой.
  const rows = previous ? addedIn(item.id, MATRIX_FOLDED) : includedIn(item.id, MATRIX_FOLDED)
  const delta = previous ? item.price - previous.price : 0

  return (
    <article
      style={{
        borderColor: hit ? `${HIT}66` : 'rgba(255,255,255,.12)',
        backgroundColor: hit ? 'rgba(76,141,255,.07)' : 'rgba(255,255,255,.02)',
      }}
      className="relative overflow-hidden rounded-[6px] border p-4"
    >
      <LightEdge opacity={hit ? 0.55 : 0.28} />

      <div className="flex items-end justify-between gap-3">
        <PriceHead item={item} size="compact" />
        {/* Доплата к предыдущей ступени. Цифра считается из цен, а не
            записана руками: поменяется цена — поменяется и она. */}
        {previous && (
          <p
            style={BEBAS}
            className="shrink-0 pb-1 text-right text-[15px] leading-[1.1] tracking-[1px] text-white/38"
          >
            +{formatPrice(delta)}
            <br />к {previous.name.toLowerCase()}у
          </p>
        )}
      </div>

      <p className="mt-3.5 text-[11px] uppercase leading-none tracking-[.16em] text-white/40">
        {previous ? `Всё из ${previous.name.toLowerCase()}а, плюс:` : 'В тариф входит:'}
      </p>

      <ul className="mt-2.5">
        {rows.map((feature) => (
          <li key={feature.key} className="flex items-start gap-2.5 py-[7px]">
            <span className="mt-[3px] flex size-[13px] shrink-0 items-center justify-center">
              <Mark on color={hit ? HIT : '#FFFFFF'} />
            </span>
            <span className="text-[12.5px] leading-[1.35] text-white/80">{feature.title}</span>
          </li>
        ))}
      </ul>

      <PayButtons id={item.id} />
    </article>
  )
}

/* ══ 03. Матрица ═════════════════════════════════════════════════════════
   Таблица из файла заказчика, приведённая к 430px: название позиции слева,
   три узкие колонки отметок справа. Шапка выбирается, выбранная колонка
   подсвечена, кнопки внизу подписаны ценой выбранного тарифа. */

function V3Matrix() {
  const [selected, setSelected] = useState<TariffId>('premium')
  const chosen = tariff(selected)

  return (
    <>
      <SectionTitle />

      <div className="mt-6 overflow-hidden rounded-[6px] border border-white/12 bg-white/[.02]">
        {/* Шапка: три колонки-кнопки. Роль radiogroup, а не набор кнопок —
            выбор один и взаимоисключающий, и с клавиатуры он должен вести
            себя как переключатель. */}
        <div role="radiogroup" aria-label="Тариф" className="flex border-b border-white/10">
          {/* Пустая ячейка над колонкой названий: она задаёт ту же сетку,
              что у строк ниже, иначе колонки отметок разъедутся. */}
          <span aria-hidden="true" className="min-w-0 flex-1" />
          {TARIFFS.map((item) => {
            const on = selected === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSelected(item.id)}
                style={{
                  backgroundColor: on ? 'rgba(76,141,255,.12)' : 'transparent',
                  borderColor: on ? HIT : 'transparent',
                }}
                className="relative w-[56px] shrink-0 border-b-2 px-0.5 pb-2.5 pt-2.5"
              >
                {/* Строка под звёздочку и «ХИТ» держится у всех трёх колонок,
                    даже пустая: иначе названия тарифов встают на разной
                    высоте и шапка выглядит съехавшей. */}
                <span
                  style={{ ...BEBAS, color: HIT }}
                  className="mb-1 flex h-[11px] items-center justify-center gap-[3px] text-[11px] leading-none tracking-[.5px]"
                >
                  {item.hit && (
                    <>
                      <StarIcon aria-hidden="true" className="size-[9px]" />
                      ХИТ
                    </>
                  )}
                </span>
                <span
                  style={BEBAS}
                  className={`block text-[13px] uppercase leading-none tracking-[.5px] ${
                    on ? 'text-white' : 'text-white/55'
                  }`}
                >
                  {item.name}
                </span>
                <span
                  style={BEBAS}
                  className={`mt-1 block text-[12px] leading-none tracking-[.5px] tabular-nums ${
                    on ? 'text-[#AECBFF]' : 'text-white/35'
                  }`}
                >
                  {/* Цена без знака рубля: колонка 56px, с «₽» запись не
                      встаёт. Округлять до «50к» нельзя — 49 900 превратилось
                      бы в 50 000, то есть в неверную цену. Полная запись со
                      знаком стоит под таблицей, у кнопки. */}
                  {item.price.toLocaleString('ru-RU').replace(/\s/g, ' ')}
                </span>
              </button>
            )
          })}
        </div>

        <ul>
          {MATRIX_FOLDED.map((feature) => (
            <li key={feature.key} className="flex items-stretch border-b border-white/7 last:border-b-0">
              <span className="min-w-0 flex-1 py-2.5 pl-3 pr-2 text-[12px] leading-[1.3] text-white/72">
                {feature.title}
              </span>
              {TARIFFS.map((item) => (
                <span
                  key={item.id}
                  style={{
                    backgroundColor:
                      selected === item.id ? 'rgba(76,141,255,.07)' : 'transparent',
                  }}
                  className="flex w-[56px] shrink-0 items-center justify-center py-2.5"
                >
                  <Mark
                    on={feature.in[item.id]}
                    color={selected === item.id ? HIT : 'rgba(255,255,255,.6)'}
                  />
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Кнопки одни на всю таблицу и подписаны выбранным тарифом — иначе
          пришлось бы ставить по паре под каждой колонкой, то есть шесть
          кнопок в столбик под таблицей в 14 строк. */}
      <p className="mt-5 text-[12.5px] leading-[1.4] text-white/50">
        Выбран тариф{' '}
        <span className="font-bold uppercase text-white">{chosen.name}</span> —{' '}
        <span className="tabular-nums text-white">{formatPrice(chosen.price)}</span>
      </p>
      <PayButtons id={selected} />

      <ContactBlock />
    </>
  )
}

/* ══ Обвязка макетной ════════════════════════════════════════════════════ */

function Frame({
  n,
  name,
  why,
  tags,
  children,
}: {
  n: string
  name: string
  why: string
  tags: string[]
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[.02] p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-[13px] font-bold tracking-wide text-[#6AA0FF] tabular-nums">{n}</span>
        <h2 className="text-[20px] font-bold leading-none">{name}</h2>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] leading-none text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mb-6 max-w-[80ch] text-[13.5px] leading-relaxed text-white/55">{why}</p>

      <div className="flex flex-wrap items-start gap-7">
        <Preview width={430} caption="430 px — проектная ширина">
          {children}
        </Preview>
        <Preview width={360} caption="360 px — узкий телефон">
          {children}
        </Preview>
      </div>
    </section>
  )
}

function Preview({ width, caption, children }: { width: number; caption: string; children: ReactNode }) {
  return (
    <div style={{ width }} className="shrink-0">
      <p className="mb-2 text-[11px] uppercase tracking-[.1em] text-white/35">{caption}</p>
      {/* Тот же фон и те же боковые поля, что у секции на живой странице. */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#05080b] px-5 py-8">
        {children}
      </div>
    </div>
  )
}
