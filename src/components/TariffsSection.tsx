import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  CONTACT_ACTION,
  MATRIX_FOLDED,
  PAY_BUTTONS,
  TARIFFS,
  formatPrice,
  tariff,
  whatsappHref,
  type Tariff,
  type TariffId,
} from '../data/tariffs'
import { StarIcon, WhatsAppIcon } from './icons'

/**
 * Слайд 6 ТЗ «Выбери свой тариф» — три тарифа и восемнадцать позиций сетки.
 *
 * Подача «Столбцы» с макетной `/tariffs.html`, выбор владельца из трёх
 * (отклонены «Лестница» и «Матрица» — они остались на макетной). Устройство
 * ниже объясняется двумя вещами: буквой ТЗ и правкой владельца по выбранной
 * подаче.
 *
 * ── Что задано ТЗ ────────────────────────────────────────────────────────
 * «На самом сайте тарифы идут отдельными столбцами, при этом нужно выделить
 * цветом 2-ой тариф и добавить туда значок звездочки и слово: ХИТ, чтобы
 * отразить, что именно этот тариф самый популярный (нам надо его
 * продавать)».
 *
 * Три колонки рядом на 430px не встают — по 130px на каждую при названиях
 * позиций в 40–70 знаков. Поэтому **столбцы остались столбцами, но
 * листаются**: карточка 262px прилипает по центру, соседние видны с обеих
 * сторон, лента открыта сразу на ПРЕМИУМЕ.
 *
 * ── Правка владельца по выбранной подаче ─────────────────────────────────
 * «Не активные столбцы должны быть чуть прозрачными. У каждого столбца свой
 * цвет, придумай аналогию цвета к названию. Тарифы идут по возрастанию,
 * нужно придумать, как их выделять по-своему. Хит выделить больше всех.»
 *
 * **Три цвета — три материала ступени:** сталь → синий → золото. Аналогия и
 * её обоснование записаны в `data/tariffs.ts`, поле `accent`; ни один цвет
 * не выдуман под этот слайд, все три уже работают на странице.
 *
 * **У каждой ступени свой приём выделения, а не только свой цвет** — та же
 * доктрина, что в слайде 5 («цвета мало, у категории должна быть своя
 * форма»): СТАНДАРТ идёт без верхней грани и с самой тихой рамкой, он точка
 * отсчёта; ПРЕМИУМ получает шапку во всю ширину; ВИП — золотую грань в 2px.
 *
 * **Возрастание показано делениями, а не словами:** три штриха под
 * названием, залито столько, какой тариф по счёту. Подписи вроде «базовый»
 * пришлось бы сочинять, а тексты мы берём только из ТЗ.
 *
 * **Хит выделен больше всех** четырьмя вещами разом: сплошная заливка
 * акцентом (единственная в секции), рамка вдвое плотнее соседей, тень под
 * карточкой и единственная плоская синяя кнопка «Оплатить полностью» — у
 * СТАНДАРТА и ВИП она контурная в их цвете.
 *
 * ── Кнопки ───────────────────────────────────────────────────────────────
 * В таблице заказчика их пять на тариф, то есть 15 на секцию (Q17). Три —
 * рассрочка, клубы и академии, отдельные модули — одинаковые для всех
 * тарифов и от выбора не зависят: вынесены одним блоком под ленту. В
 * карточке остались две, в иерархии заливки ячеек исходной таблицы.
 *
 * TODO (Q18): номера WhatsApp и текстов стартовых сообщений заказчик не
 * дал. `WHATSAPP_NUMBER` пуст — ссылки рисуются, но никуда не ведут.
 * TODO (Q19): бэкенда нет, обе кнопки оплаты — заглушки.
 * TODO (Q23): два вопроса заказчика к самому себе (микрогруппы в СТАНДАРТЕ,
 * живая встреча вообще) стоят в данных с флагом `pending`.
 */

// Bebas инлайновым стилем, а не утилитой font-[...]: имя шрифта с пробелами
// Tailwind как arbitrary-значение не разбирает. Так же сделано в «Авторе
// обучения» и в «Как проходит обучение».
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Ширина карточки и зазор ленты. Держатся здесь: от них считается прокрутка. */
const CARD = 262
const GAP = 12
/** Боковое поле секции (px-5), на которое лента выходит наружу через -mx-5. */
const BLEED = 20

/**
 * Боковое поле ленты: столько, чтобы крайняя карточка доезжала до центра.
 *
 * Проценты в `padding` считаются **не от ширины самого элемента, а от
 * ширины его содержащего блока** — то есть от контентной коробки секции,
 * которая на 40px уже ленты (у ленты `-mx-5`). С честным `calc(50% - 131px)`
 * поле выходило на 20px короче нужного, и СТАНДАРТ с ВИП вставали не по
 * центру, а со сдвигом: замер на 360 — 22px слева против 61 справа.
 * Отсюда поправка на вылет.
 */
const SIDE_PAD = `calc(50% + ${BLEED}px - ${CARD / 2}px)`

export function TariffsSection() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<TariffId>('premium')

  // Открыть на ПРЕМИУМЕ — его и надо продавать, а СТАНДАРТ остаётся слева
  // точкой отсчёта. Без анимации и до первой отрисовки: анимированная
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
    // ленту назад на каждом кадре анимации, и нажатие по точке не двигало
    // её вообще (замер: scrollLeft 254 до клика и 254 после). Та же грабля
    // уже записана по ленте сегментов слайда 2. Свайп пальцем анимируется
    // браузером сам и не страдает.
    el.scrollLeft = centerOf(el, index)
    // Индекс ставится сразу, а не ждёт onScroll: событие приходит на
    // следующем такте, и быстрые нажатия подсвечивали предыдущую точку.
    setActive(TARIFFS[index].id)
  }

  return (
    <section
      id="tariffs"
      aria-labelledby="tariffs-title"
      // Своего фона у секции нет: под ней идёт та же тональная база
      // CourseBackdrop, что под «Программой» и «Как проходит обучение».
      // z-10 обязателен — слой лежит на z-[3] поверх потока и непрозрачен.
      // Подъём вешается на саму секцию, а не на внутренний контейнер: та же
      // грабля, что в трёх секциях выше.
      className="section-rhythm relative z-10 px-5"
    >
      {/* Сход в bg-pitch отсюда снят 01.09 и уехал в FAQ: за тарифами
          встала ещё одна секция, и гасить тон по низу этой значило рисовать
          ступеньку прямо на стыке двух. Слой всегда живёт у последней секции
          страницы — этой правкой он переезжает уже третий раз («Программа»
          → «Как проходит обучение» → тарифы → FAQ). */}

      <h2 id="tariffs-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
        Выбери свой тариф
      </h2>

      {/* Лента выходит за боковые поля секции: карточка должна прилипать к
          экрану, а не к полю в 20px. Приём тот же, что у ленты сегментов
          слайда 2.

          Прилипание по центру, а не по левому краю. Со `snap-start` лента,
          открытая на ПРЕМИУМЕ, показывала его вплотную к левому краю — и
          СТАНДАРТ уходил за экран целиком, без единого намёка, что слева
          что-то есть. По центру видно обе соседние карточки, и «столбцы» из
          ТЗ читаются даже без прокрутки.

          Боковое поле — `SIDE_PAD`, оно же половина ленты минус половина
          карточки: без него крайние карточки не могут доехать до центра, и
          браузер молча прилипает к ближайшей достижимой точке. Формула в
          процентах, поэтому работает и на 430, и на 360 без медиазапроса.

          py-3 — не отступ, а место под тень ПРЕМИУМА: `overflow-x: auto`
          делает и вертикальный overflow неявно скрытым, и без запаса тень
          срезалась по нижней грани ленты. */}
      <div
        ref={track}
        style={{ paddingInline: SIDE_PAD }}
        className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => {
          const el = event.currentTarget
          const index = Math.round(el.scrollLeft / (CARD + GAP))
          setActive(TARIFFS[Math.min(Math.max(index, 0), TARIFFS.length - 1)].id)
        }}
      >
        {TARIFFS.map((item) => (
          <TariffCard key={item.id} item={item} active={active === item.id} />
        ))}
      </div>

      {/* Точки — настоящие кнопки с тач-целью 44px. На слайде 2 они сначала
          были span'ами с aria-hidden: зона 20×6px, не нажимались ничем.
          Точка окрашена в цвет своего тарифа: иначе полоска под лентой —
          единственное место, где шкала «сталь → синий → золото» рвётся. */}
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
    </section>
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

/** Столбец тарифа: шапка ступени, цена, полный состав, две кнопки. */
function TariffCard({ item, active }: { item: Tariff; active: boolean }) {
  const hit = Boolean(item.hit)
  const accent = item.accent

  return (
    <article
      style={{
        width: CARD,
        // Рамка и заливка — в цвете тарифа. ПРЕМИУМ идёт заметно плотнее
        // обоих соседей: и рамка вдвое насыщеннее, и подложка, и тень.
        borderColor: hit ? `${accent}A6` : `${accent}33`,
        backgroundColor: hit ? 'rgba(76,141,255,.09)' : `${accent}08`,
        // Тень **под** карточкой, а не свечение по краю: приём свечения на
        // странице занят героем слайда 5 (платформой), и второй такой же
        // перестал бы работать выделением.
        boxShadow: hit ? '0 14px 36px rgba(30,91,255,.24)' : 'none',
        // Приглушение неактивных. saturate гасит и цвет, а не только
        // яркость: без него стальной СТАНДАРТ на .52 всё равно оставался
        // таким же серым, как в полную силу.
        opacity: active ? 1 : 0.52,
        filter: active ? 'none' : 'saturate(.6)',
        transition: 'opacity 240ms var(--ease-mass), filter 240ms var(--ease-mass)',
      }}
      className="relative shrink-0 snap-center overflow-hidden rounded-[6px] border"
    >
      {/* Свой приём выделения у каждой ступени.

          ПРЕМИУМ — шапка во всю ширину со звездой и словом «ХИТ» из ТЗ.
          Единственная в секции сплошная заливка акцентом: у соседей цвет
          живёт только в рамке, отметках и кнопке.

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

        <div className="mt-3 flex items-center gap-2">
          <h3
            style={BEBAS}
            className="min-w-0 flex-1 text-[30px] uppercase leading-none tracking-[1px] text-white"
          >
            {item.name}
          </h3>
        </div>
        <p
          style={{ ...BEBAS, color: hit ? '#DCE9FF' : '#FFFFFF' }}
          className="mt-2 text-[38px] leading-none tracking-[1px] tabular-nums"
        >
          {formatPrice(item.price)}
        </p>

        {/* Полный состав, включая то, что в тариф НЕ входит: прочерк
            напротив SCOUTWAY в ПРЕМИУМЕ работает ровно так же, как
            зачёркнутая строка в таблице заказчика — он и продаёт ВИП. */}
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
                <span className={`text-[12px] leading-[1.35] ${on ? 'text-white/78' : 'text-white/28'}`}>
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

/**
 * Индикатор ступени: три деления, залито столько, какой тариф по счёту.
 *
 * Нужен, потому что тарифы идут по возрастанию, а цвет об этом не говорит:
 * сталь, синий и золото — три разных цвета, а не три уровня одного.
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
function Mark({ on, color }: { on: boolean; color: string }) {
  if (!on) return <span aria-hidden="true" className="block h-px w-[9px] bg-white/22" />

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
 * что сломался сайт, и уйдёт. Ставятся сеткой, а не флексом в колонку: у
 * .btn-hero-primary в CSS стоит flex:1.15 (это для пары в строку), и в
 * колоночном флексе базис 0% схлопнул бы кнопку по высоте.
 *
 * `accent` передаётся тем тарифам, которые **не** хит: их главная кнопка
 * становится контурной в цвете тарифа, а плоская синяя заливка остаётся
 * ровно у ПРЕМИУМА. Иначе самый громкий элемент карточки у всех трёх
 * одинаковый, и «выделить хит больше всех» ломается именно на нём. Вернуть
 * всем одинаковую синюю заливку — это убрать одно свойство.
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
                ? { color: accent, border: `1px solid ${accent}80`, backgroundColor: `${accent}1F` }
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
 * Обращение под лентой (Q17). Не про выбор тарифа, а про то, что делать,
 * если ни один не подошёл.
 *
 * **Было три тихие ссылки, стало один блок с кнопкой** — правка владельца от
 * 01.09: два обращения (условия для клубов и академий, покупка отдельных
 * модулей) сняты, оставшееся оформлено кнопкой. Снятые тексты не потеряны,
 * они лежат в `CONTACT_LINKS` и работают на макетной `/tariffs.html` —
 * править её в этот раз просили отдельно не надо.
 *
 * Почему панель, а не просто кнопка на фоне: под ней сразу начинается сход
 * секции в `bg-pitch`, и одиночная кнопка на гаснущем фоне повисала бы в
 * пустоте. Рамка даёт ей низ, а вопрос и ответ читаются одним объектом.
 *
 * **Про зелёный.** Это единственное место на странице, где стоит фирменный
 * цвет WhatsApp (#25D366), и он здесь не «ещё один зелёный акцент», а часть
 * знака мессенджера — вместе с глифом он читается как «написать в WhatsApp»,
 * а не как кнопка сайта. От газонного `.btn-hero-turf` он отличается и
 * тоном, и материалом: тот полосатый и приглушённый, этот плоский и яркий.
 * Тарифных цветов (сталь, синий, золото) блок не трогает намеренно — он про
 * то, что человек не выбрал ни один тариф.
 *
 * Текст на кнопке тёмно-зелёный, а не белый: на #25D366 белый даёт 2.1:1,
 * то есть нечитаемо, а #08291A — 7.9:1.
 *
 * Заголовок блока — единственный текст слайда 6 не из ТЗ.
 */
function ContactBlock() {
  return (
    <div
      className="relative mt-7 rounded-[6px] border border-[#25D366]/26 p-4"
      style={{
        backgroundImage: 'linear-gradient(168deg,rgba(37,211,102,.075) 0%,rgba(37,211,102,.02) 100%)',
        // Внешнее свечение панели — широкое и слабое. Оно тут работает не
        // украшением, а опорой: сразу под блоком секция гаснет в bg-pitch, и
        // без ореола нижняя грань рамки растворяется вместе с фоном.
        // overflow-hidden с панели снят: он обрезал бы собственную тень.
        boxShadow: '0 10px 40px rgba(37,211,102,.10)',
      }}
    >
      <LightEdge opacity={0.22} />
      <p className="text-[13px] leading-[1.45] text-white/70">
        Не подошёл ни один вариант? Напишите в WhatsApp:
      </p>
      {/* Q18: номера нет — whatsappHref отдаёт undefined, href не ставится и
          кнопка никуда не ведёт. Появится номер — заработает без правки
          вёрстки. Вид при этом остаётся боевым намеренно: приглушать кнопку
          из-за отсутствующих данных значило бы показывать владельцу не то,
          что он получит. */}
      <a
        href={whatsappHref(CONTACT_ACTION.message)}
        style={{
          // Два слоя, а не один: ближний держит контур кнопки, дальний даёт
          // ореол. Одним слоем свет либо липнет к краю, либо расплывается
          // мутным пятном. Плотность дальнего слоя (.3) взята с оглядкой на
          // тень ХИТа — `0 14px 36px rgba(30,91,255,.24)`: свет здесь может
          // быть сопоставим, но не громче, иначе обращение начнёт спорить с
          // тарифом, который надо продавать.
          boxShadow: '0 3px 12px rgba(37,211,102,.22), 0 12px 32px rgba(37,211,102,.3)',
        }}
        className="mt-3.5 flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-[6px] bg-[#25D366] px-4 text-center text-[14px] font-semibold leading-[1.2] text-[#08291A] transition-[filter,transform,box-shadow] duration-150 active:scale-[.99] active:brightness-95"
      >
        <WhatsAppIcon className="size-[19px] shrink-0 fill-[#08291A]" />
        {CONTACT_ACTION.label}
      </a>
    </div>
  )
}

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
