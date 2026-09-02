import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { faqAnswer } from '../data/faq'
import { legalDoc } from '../data/legal'
import { learningItem } from '../data/learning'
import {
  PAY_METHODS,
  PAY_PROVIDER,
  RESERVE_AMOUNT,
  formatPrice,
  highlightsOf,
  tariff,
  whatsappHref,
  type PayAction,
  type Tariff,
  type TariffId,
} from '../data/tariffs'
import { PAY_FORM_ID, PayForm } from './PayForm'
import sbpLogo from '../assets/sbp.svg'
import {
  CardIcon,
  CheckIcon,
  CloseIcon,
  ManagerIcon,
  WhatsAppIcon,
  InstallmentIcon,
  LockIcon,
} from './icons'

/**
 * Лист покупки — модалка кнопок «Оплатить полностью» и «Забронировать».
 *
 * ── Что это за шаг ───────────────────────────────────────────────────────
 * Не оплата, а шаг перед ней. У Prodamus, который записан в план этапом 10,
 * порядок такой: сайт показывает заказ и собирает контакты, а карту человек
 * вводит уже на защищённой странице сервиса. Поэтому здесь нет и не будет
 * полей карты, а есть ровно три вещи: что покупается, чем можно платить и
 * как с покупателем связаться.
 *
 * ── Почему лист выглядит именно так ──────────────────────────────────────
 * Две предыдущие версии владелец отверг. Первая была собрана из пяти
 * одинаковых коробок с рамкой в 1px, вторая заговорила языком витрины —
 * Bebas-капслок в подписях полей, трекинг .14em, радиус 6px, надзаголовок
 * над каждым блоком. Обе читались тактической схемой, а не формой оплаты.
 *
 * Владелец попросил обычную форму, сделанную хорошо, — и это здесь принято
 * буквально. Лист говорит языком интерфейса, а не страницы:
 *
 *   — **подписи обычным текстом** в 13–15px, без капслока и трекинга.
 *     Капслок Bebas остался ровно в двух местах, где он работает: заголовок
 *     листа и сумма к оплате;
 *   — **радиус 10px у полей и кнопки, 16px по верхним углам листа.** Шесть
 *     проектных пикселей — язык витрины; нижний лист с мягкими углами
 *     человек узнаёт до того, как прочтёт заголовок;
 *   — **одна панель на группу, а не рамка на каждом элементе.** Сводка
 *     заказа и способ оплаты лежат на подложке, всё остальное стоит прямо
 *     на листе и разделено воздухом;
 *   — **один акцент на весь лист.** Цвет действия работает на сумме,
 *     кнопке, галочках и фокусе полей — больше нигде.
 *
 * ── Порядок блоков ───────────────────────────────────────────────────────
 * Задан владельцем: «сверху способы оплаты, снизу форма, снизу чекбоксы».
 * Выше способов — сводка и что входит: сначала человек убеждается, что
 * выбрал то, что хотел.
 *
 *   1. сводка заказа — тариф, стоимость, сумма к оплате;
 *   2. что входит — три позиции;
 *   3. способы оплаты — СБП, карты, рассрочки и строка про Prodamus;
 *   4. контактные данные — четыре поля;
 *   5. согласия;
 *   6. подвал — кнопка с суммой и ссылка на оферту.
 *
 * Форма с согласиями живёт в `PayForm`. Кнопка стоит в подвале, вне области
 * прокрутки, и связана с формой атрибутом `form=`: так она приклеена к
 * нижней кромке экрана — в зоне большого пальца, — и всё равно запускает
 * проверку полей.
 *
 * ── Почему нативный <dialog> ─────────────────────────────────────────────
 * Разбор целиком лежит в `index.css` рядом с `.pay-dialog`, здесь коротко:
 * `<main>` обёрнут в `overflow-hidden` (без него якорная прокрутка уносит
 * секции), и любой собственный оверлей внутри него пришлось бы портировать
 * в `document.body`. Модальный `<dialog>` уходит в top layer и даёт даром
 * захват фокуса, Esc и `inert` для страницы под собой.
 *
 * ── Чем два листа отличаются по цвету ────────────────────────────────────
 * По **действию**, а не по тарифу, — иначе у СТАНДАРТА оба листа вышли бы
 * одинаковыми стальными. Полная оплата идёт в цвете ступени (сталь → синий
 * → золото), бронь — в газонном зелёном `#21B365`, одном на все три тарифа:
 * этот цвет на странице уже означает «шаг дальше», а не покупку, и бронь —
 * именно шаг. Цвет уезжает в переменную `--pay-accent`, поэтому им же
 * подсвечиваются поля в фокусе и залитые чекбоксы.
 *
 * TODO (Q19): бэкенда нет. Форма проверяет введённое и останавливается,
 * подвал показывает, что приём оплаты ещё не подключён. Появится Prodamus —
 * правка в `onValid` ниже.
 */

const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Цвет действия «бронь». Газонный зелёный страницы, см. шапку файла. */
const RESERVE_ACCENT = '#21B365'

/**
 * Тёмная краска подписи на залитой кнопке. Одна на все четыре возможных
 * цвета действия: стальной, синий, золотой и зелёный по светлоте близки, и
 * белый на любом из них даёт меньше 3:1, а эта — от 7:1 и выше.
 */
const INK = '#07101A'

/** Что открыто: какой тариф выбран и по какой из двух кнопок пришли. */
export type PayTarget = { id: TariffId; action: PayAction }

export function PaySheet({ target, onClose }: { target: PayTarget | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  // Последняя показанная цель. Пока лист уезжает вниз, родитель уже обнулил
  // target, а содержимое обязано дожить до конца анимации — иначе панель
  // уходит вниз пустой коробкой.
  const [shown, setShown] = useState<PayTarget | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !target) return
    setShown(target)
    setClosing(false)
    setChecked(false)
    // Проверка обязательна: showModal() на уже открытом диалоге бросает
    // InvalidStateError, а в dev-режиме эффекты вызываются дважды.
    if (!dialog.open) dialog.showModal()
  }, [target])

  const requestClose = () => {
    const dialog = ref.current
    if (!dialog || !dialog.open || closing) return
    // Кому анимации выключены, лист закрывается сразу. Под
    // prefers-reduced-motion CSS обнуляет анимацию, animationend не приходит
    // вовсе — ждать его значило бы не закрыть лист никогда.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close()
      return
    }
    setClosing(true)
  }

  const t = shown ? tariff(shown.id) : null
  const reserve = shown?.action === 'reserve'
  const color = !t || reserve ? RESERVE_ACCENT : t.accent
  const due = !t ? 0 : reserve ? RESERVE_AMOUNT : t.price
  const offer = legalDoc('offer')

  return (
    <dialog
      ref={ref}
      aria-labelledby="pay-title"
      className={`pay-dialog ${closing ? 'is-closing' : ''}`}
      // Тап мимо листа. Клик приходит ровно на сам <dialog>, потому что
      // внутренней обёртки-подложки у него нет — см. комментарий к
      // .pay-dialog в index.css.
      onClick={(event) => {
        if (event.target === ref.current) requestClose()
      }}
      // Esc закрывает диалог мгновенно и без анимации. Перехватываем, чтобы
      // уход был тем же движением, что по крестику.
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClose={() => {
        setClosing(false)
        setShown(null)
        onClose()
      }}
    >
      {t && (
        <div
          style={{ '--pay-accent': color } as CSSProperties}
          className={`pay-sheet ${closing ? 'pay-sheet-closing' : ''}`}
          onAnimationEnd={() => {
            // Событие приходит и на открытии — закрываем только своё.
            if (closing) ref.current?.close()
          }}
        >
          {/* Шапка. Линия снизу обязательна: содержимое прокручивается под
              неё, и без линии обрезанная на полуслове строка читается
              браком вёрстки. У подвала такая же линия сверху. */}
          <div className="shrink-0 border-b border-white/8">
            <div className="flex justify-center pt-2.5">
              <span aria-hidden="true" className="pay-grabber" />
            </div>

            <div className="flex items-center gap-2 px-5 pb-3.5 pt-3">
              <h2
                id="pay-title"
                style={BEBAS}
                className="min-w-0 flex-1 text-[24px] uppercase leading-none tracking-title text-white"
              >
                {reserve ? 'Бронь места' : 'Оплата курса'}
              </h2>
              {/* Тач-цель 44px при глифе в 20: крестик стоит у верхней
                  кромки листа, промахнуться по нему проще всего. */}
              <button
                type="button"
                aria-label="Закрыть"
                onClick={requestClose}
                className="-mr-2.5 flex size-11 shrink-0 items-center justify-center rounded-[10px] text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>
          </div>

          <div className="pay-scroll px-5 pb-6 pt-4">
            <OrderSummary item={t} reserve={reserve} color={color} />
            <Included item={t} color={color} />
            <PayMethods />
            <PayForm onValid={() => setChecked(true)} onDirty={() => setChecked(false)} />
          </div>

          {/* Подвал. Кнопка в зоне большого пальца и остаётся на месте, пока
              форма прокручивается над ней. */}
          <div className="pay-footer shrink-0 border-t border-white/8 px-5 pt-3.5">
            {/* Q19: форма проверена, а платить нечем. Сказать об этом прямо
                честнее, чем сделать вид, что заявка ушла: данные никуда не
                отправляются, бэкенда в проекте нет. */}
            {checked && (
              <p
                role="status"
                className="mb-3 rounded-[10px] border px-3.5 py-3 text-[13px] leading-[1.45] text-white/85"
                style={{ borderColor: `${color}40`, backgroundColor: `${color}12` }}
              >
                Данные проверены. Приём оплаты ещё не подключён — кнопка
                заработает вместе с {PAY_PROVIDER}.
              </p>
            )}

            {/* Сумма прямо на кнопке — так человек в последний раз видит,
                сколько с него спишут, не поднимая глаз к сводке. */}
            <button
              type="submit"
              form={PAY_FORM_ID}
              style={{ backgroundColor: color, color: INK }}
              className="pay-cta"
            >
              {reserve ? 'Забронировать за' : 'Оплатить'} {formatPrice(due)}
            </button>

            {/* Оферта ссылкой у кнопки, а не только в подвале страницы:
                Q24, до оплаты покупателю сообщают состав услуги, цену и
                порядок возврата. Документа пока нет, и тогда рисуется
                пунктирная надпись вместо ссылки. */}
            <p className="mt-2.5 text-center text-[11.5px] leading-[1.4] text-white/40">
              Нажимая кнопку, вы принимаете условия{' '}
              {offer.href ? (
                <a
                  href={offer.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 underline decoration-white/30 underline-offset-4"
                >
                  публичной оферты
                </a>
              ) : (
                <span className="underline decoration-dotted decoration-white/25 underline-offset-4">
                  публичной оферты
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </dialog>
  )
}

/**
 * Сводка заказа — обычная для чекаута: строки «что» и «сколько», под чертой
 * итог. У брони строк на две больше, потому что она делит одну цену на две
 * части, и обе человек должен увидеть до нажатия.
 *
 * Итог набран Bebas в 34px — единственное место листа, где типографика
 * страницы берёт слово. Сумма к оплате и есть то, ради чего лист открыт.
 */
function OrderSummary({
  item,
  reserve,
  color,
}: {
  item: Tariff
  reserve: boolean
  color: string
}) {
  return (
    <div className="pay-panel p-4">
      <Row label="Тариф">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-white">{item.name}</span>
          {item.hit && (
            <span
              className="rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[.08em]"
              style={{ backgroundColor: `${item.accent}22`, color: item.accent }}
            >
              Хит
            </span>
          )}
        </span>
      </Row>

      {reserve && (
        <Row label="Стоимость курса">
          <span className="text-[15px] text-white/75 tabular-nums">{formatPrice(item.price)}</span>
        </Row>
      )}

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/8 pt-3">
        <span className="pb-1 text-[13px] text-white/60">
          {reserve ? 'Вносится сейчас' : 'К оплате'}
        </span>
        <span
          style={{ ...BEBAS, color }}
          className="text-[34px] leading-none tracking-[1px] tabular-nums"
        >
          {formatPrice(reserve ? RESERVE_AMOUNT : item.price)}
        </span>
      </div>

      {reserve && (
        <>
          {/* Остаток отдельной строкой, а не вычитанием в уме: человек
              должен видеть обе половины цены до нажатия. */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[13px] text-white/45">Остаток</span>
            <span className="text-[14px] text-white/55 tabular-nums">
              {formatPrice(item.price - RESERVE_AMOUNT)}
            </span>
          </div>

          {/* Дословный ответ FAQ: без него разбивка «сейчас / остаток»
              читается рассрочкой, которой она не является. */}
          <p className="mt-3 border-t border-white/8 pt-3 text-[12.5px] leading-[1.45] text-white/45">
            {faqAnswer('booking')}
          </p>
        </>
      )}
    </div>
  )
}

/** Строка сводки: подпись слева, значение справа. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 first:mt-0 [&+&]:mt-2.5">
      <span className="text-[13px] text-white/60">{label}</span>
      {children}
    </div>
  )
}

/**
 * Что входит в тариф — три позиции.
 *
 * Ровно три на каждом: требование владельца. Какие именно, решает
 * `HIGHLIGHTS` в `data/tariffs.ts`, там же записано, почему список задан
 * руками, а не считается из матрицы.
 *
 * Подача — обычный список с галочками, без рамок, плашек и капслока:
 * ровно так «что входит» выглядит в любом чекауте, и ровно этого просил
 * владелец. Название 14px полужирным, пояснение 12.5px приглушённым — оно
 * из слайда 5 и стоит целиком.
 */
function Included({ item, color }: { item: Tariff; color: string }) {
  return (
    <section className="mt-6">
      <h3 className="text-[15px] font-semibold text-white">Что входит в тариф</h3>

      <ul className="mt-3 flex flex-col gap-3">
        {highlightsOf(item.id).map((feature) => {
          // У ключа feedback название точнее в таблице тарифов: текст
          // слайда 5 описывает разом чат и проверку домашних заданий, а на
          // СТАНДАРТЕ заданий нет.
          const learning = feature.learningKey ? learningItem(feature.learningKey) : null
          const generic = feature.learningKey === 'feedback'

          return (
            <li key={feature.key} className="flex gap-2.5">
              <CheckIcon
                aria-hidden="true"
                className="mt-[3px] size-4 shrink-0"
                style={{ color }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-[1.3] text-white">
                  {learning && !generic ? learning.title : feature.title}
                </p>
                {learning && !generic && (
                  // Без обрезки по строкам: висящее «…» посреди описания
                  // читается недоделкой, а лист и так прокручивается.
                  <p className="mt-0.5 text-[12.5px] leading-[1.4] text-white/45">
                    {learning.text}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * Способы оплаты.
 *
 * Состав задан владельцем: СБП, карты, банковская и исламская рассрочка —
 * см. `PAY_METHODS` в `data/tariffs.ts`, там же записано расхождение с
 * ответом FAQ, которое надо закрыть на стороне заказчика.
 *
 * ── Знаки ────────────────────────────────────────────────────────────────
 * У СБП стоит **настоящий фирменный знак** — цветной, файлом
 * `assets/sbp.svg`. Он лежит отдельным файлом, а не компонентом среди
 * значков проекта, ровно потому, что это чужой товарный знак: заменить его
 * на вариант из официального брендбука НСПК (nspk.ru/advertising) — это положить
 * другой файл, не трогая код. Из скачанного логотипа оставлен только знак:
 * словесная часть «сбп» в нём чёрная и на тёмной подложке не читается, а
 * название способа и так набрано текстом рядом.
 *
 * У остальных трёх фирменных знаков не существует или они не подходят.
 * «Любая карта РФ» — это и МИР, и карты Visa/Mastercard российских банков;
 * один логотип на этой строке сузил бы обещание до своей системы. Рассрочка
 * — не бренд вовсе. Поэтому там рисованные глифы того же веса, что значки
 * полей формы.
 *
 * ── Почему не переключатели ──────────────────────────────────────────────
 * Это перечисление, а не выбор. Способ выбирается на стороне сервиса, и
 * элемент, похожий на радиокнопку, обещал бы выбор, которого страница
 * сделать не может.
 */
const METHOD_ICONS = {
  card: CardIcon,
  installment: InstallmentIcon,
  islamic: ManagerIcon,
} as const

/**
 * Фирменный зелёный WhatsApp. Единственное место листа с этим цветом, и он
 * здесь не «ещё один зелёный акцент», а часть знака мессенджера: вместе с
 * глифом кнопка читается как «написать в WhatsApp», а не как второе главное
 * действие. Разница важна на листе брони, где цвет действия — газонный
 * `#21B365`: два зелёных рядом иначе спорили бы. Тот же довод записан у
 * `ContactBlock` в `TariffsSection`.
 *
 * Подпись тёмно-зелёная, а не белая: на `#25D366` белый даёт 2.1:1, то есть
 * нечитаемо, а `#08291A` — 7.9:1.
 */
const WA_GREEN = '#25D366'
const WA_INK = '#08291A'

function PayMethods() {
  return (
    <section className="mt-6">
      <h3 className="text-[15px] font-semibold text-white">Способы оплаты</h3>

      <ul className="pay-panel mt-3 overflow-hidden">
        {PAY_METHODS.map((method) => {
          const Icon = method.key === 'sbp' ? null : METHOD_ICONS[method.key]
          const href = method.message ? whatsappHref(method.message) : undefined

          return (
            <li
              key={method.key}
              className="flex items-center gap-3 border-b border-white/6 px-3.5 py-3 last:border-b-0"
            >
              {/* Значок стоит прямо на подложке строки. Квадратная плашка под
                  ним была снята: четыре одинаковых квадрата в столбик
                  читались вторым списком поверх первого, а знак СБП в
                  плашке выглядел наклейкой на кнопке. */}
              <span className="flex w-6 shrink-0 items-center justify-center">
                {Icon ? (
                  <Icon aria-hidden="true" className="size-[19px] text-white/60" />
                ) : (
                  // Знак СБП цветной и перекраске не подлежит.
                  <img src={sbpLogo} alt="" className="h-[19px] w-auto" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-[1.25] text-white">{method.title}</p>
                <p className="mt-0.5 text-[12px] leading-[1.35] text-white/45">{method.desc}</p>
              </div>

              {/* Кнопка есть только там, где способ нельзя оформить на сайте.
                  Q18: номера нет — href не ставится, и она никуда не ведёт. */}
              {method.message && (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: WA_GREEN, color: WA_INK }}
                  className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[13px] font-semibold transition-transform duration-150 active:scale-[.97]"
                >
                  <WhatsAppIcon aria-hidden="true" className="size-[15px] fill-[#08291A]" />
                  Менеджер
                </a>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-2.5 flex items-center gap-2 text-[12px] leading-[1.35] text-white/40">
        <LockIcon aria-hidden="true" className="size-[14px] shrink-0" />
        Оплата проходит на защищённой странице {PAY_PROVIDER}
      </p>
    </section>
  )
}
