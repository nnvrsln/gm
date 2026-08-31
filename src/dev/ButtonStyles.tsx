import { useState, type ReactNode } from 'react'
import academyPhoto from '../assets/audience-academy.webp'
import coachPhoto from '../assets/hero-gadzhiev.webp'
import proPhoto from '../assets/audience-pro.webp'
import stadiumPhoto from '../assets/course-bg.webp'
import {
  ArrowRightIcon,
  AwardIcon,
  CheckIcon,
  GrowthIcon,
  MonitorIcon,
  PlayIcon,
  TacticsIcon,
  WhatsAppIcon,
  WhistleIcon,
} from '../components/icons'

/**
 * Макетная страница кнопок. Отдельная точка входа (buttons.html →
 * src/buttons.tsx), в прод-сборку не попадает: Vite собирает только
 * index.html.
 *
 * Первая версия страницы была отвергнута: «это не CTA, а обычные статичные
 * кнопки, и все одинаково голубые». Справедливо — там менялась геометрия
 * (радиус, положение иконки, две строки вместо одной), а материал у всех
 * шестнадцати был один: плоская заливка #1e5bff. Поэтому здесь переделано по
 * двум осям сразу:
 *
 *   • ЦВЕТ вынесен отдельным блоком. Восемь семейств на одной форме — чтобы
 *     цвет выбирался отдельно от подачи. Красного среди них нет: решение от
 *     30.08 — акцент страницы синий, `--color-blood` не используем.
 *   • МАТЕРИАЛ и ДВИЖЕНИЕ у каждого варианта свои: фотография в заливке,
 *     разметка поля, металл, неон, стекло, толщина с нижней гранью,
 *     заливка-развёртка, едущая стрелка, перфорация билета, градиентная
 *     рамка, портрет тренера внутри кнопки.
 *
 * Половина эффектов живёт в наведении и нажатии — на статичном скриншоте их
 * не видно, страницу надо потыкать.
 *
 * Правила из app-чеклиста скилла ui-ux-pro-max соблюдены: тач-цель не меньше
 * 44px (здесь у всех 52), отклик на нажатие не двигает соседей, декоративные
 * иконки скрыты из дерева доступности, у иконочных кнопок есть `aria-label`,
 * анимации выключаются по `prefers-reduced-motion`.
 */
export function ButtonStyles() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <ButtonCss />

      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          Кнопки — цвета и девятнадцать подач
        </h1>
        <p className="mt-3 max-w-[72ch] text-[14px] leading-relaxed text-white/58">
          Сначала палитра: одна форма в восьми цветах, чтобы выбрать цвет отдельно от
          подачи. Дальше — варианты, где отличается не геометрия, а материал: фотография
          в заливке, разметка поля, металл, неон, стекло, толщина, перфорация билета,
          портрет тренера.
        </p>
        <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-white/40">
          Каждый вариант — на проектных 430&nbsp;px и на 360&nbsp;px. Половина эффектов
          появляется при наведении и нажатии, на скриншоте их не видно: ведите курсор и
          жмите. Красного в палитре нет по решению от 30.08 — акцент страницы синий.
          Подписи условные везде, кроме «К ПРОГРАММЕ»: её задаёт ТЗ.
        </p>
      </header>

      {/* ── Палитра ─────────────────────────────────────────────────────── */}
      <section className="mx-auto mb-10 max-w-[1500px] rounded-2xl border border-white/10 bg-white/[.02] p-6">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
          <span className="text-[13px] font-bold tracking-wide text-[#6AA0FF]">00</span>
          <h2 className="text-[20px] font-bold leading-none">Палитра — одна форма, восемь цветов</h2>
        </div>
        <p className="mb-6 max-w-[72ch] text-[13.5px] leading-relaxed text-white/55">
          Цвет и подача выбираются отдельно. Здесь одна и та же кнопка в восьми
          семействах, у каждого своя роль: чем ниже по списку, тем тише голос. Электрик —
          то, что стоит сейчас; газон и золото просятся на тарифы; неон-лайм самый
          громкий и годится ровно для одной кнопки на весь лендинг.
        </p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {PALETTE.map((tone) => (
            <div key={tone.name}>
              <button type="button" className={`bx bx-fill w-full ${tone.className}`}>
                <span>{tone.label}</span>
                <ArrowRightIcon className="size-5 shrink-0" />
              </button>
              <p className="mt-2 text-[11.5px] leading-snug text-white/45">
                <span className="text-white/70">{tone.name}</span> — {tone.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Подачи ──────────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Текущая — эталон"
          why="То, что стоит на странице сейчас: .btn-hero-primary. Плоская заливка, световая кромка по верхней грани. Здесь для сравнения — остальные меряются с ней."
          tags={['уже в проекте', 'слайды 1, 2']}
        >
          <a href="#" className="btn-hero btn-hero-primary w-full">
            К программе
          </a>
        </Frame>

        <Frame
          n="02"
          name="Фотография в заливке"
          why="Внутри кнопки не цвет, а кадр стадиона: снимок притемнён, сверху синий множитель, чтобы подпись держалась. Кнопка перестаёт быть плашкой и становится куском страницы. Наведите — кадр наезжает."
          tags={['фото', 'слайды 1, 2', 'наведите']}
        >
          <button type="button" className="bx bx-photo w-full">
            <span
              className="bx-photo-img"
              style={{ backgroundImage: `url(${stadiumPhoto})` }}
              aria-hidden="true"
            />
            <span className="bx-photo-veil" aria-hidden="true" />
            <span className="relative z-10">К программе</span>
            <ArrowRightIcon className="relative z-10 size-5 shrink-0" />
          </button>
        </Frame>

        <Frame
          n="03"
          name="Разметка поля"
          why="Зелёный газона плюс диагональные полосы — те самые, что остаются от газонокосилки, и белая линия штрафной понизу. Всё нарисовано градиентами, картинки нет, поэтому ничего не весит."
          tags={['газон', 'слайд 6', 'фактура градиентом']}
        >
          <button type="button" className="bx bx-turf w-full">
            <WhistleIcon className="relative z-10 size-5 shrink-0" />
            <span className="relative z-10">Записаться в группу</span>
          </button>
        </Frame>

        <Frame
          n="04"
          name="Золото — премиум"
          why="Металлический градиент с бликом, который проезжает поперёк раз в четыре секунды, и тёмная подпись вместо белой. Нужен ровно один раз: на верхнем тарифе. Рядом с синими читается как другой класс, а не как ещё одна кнопка."
          tags={['верхний тариф', 'слайд 6', 'блик 4.5s']}
        >
          <button type="button" className="bx bx-gold w-full">
            <AwardIcon className="relative z-10 size-5 shrink-0" />
            <span className="relative z-10">Тариф «Личный разбор»</span>
          </button>
        </Frame>

        <Frame
          n="05"
          name="Неон-контур"
          why="Заливки нет вообще: лаймовая обводка, лаймовый текст и свечение наружу. На тёмном видно издалека, но кнопка остаётся лёгкой. Наведите — свечение усиливается и внутрь заезжает заливка."
          tags={['самая громкая', 'одна на страницу', 'наведите']}
        >
          <button type="button" className="bx bx-neon w-full">
            <span>Забрать место</span>
            <ArrowRightIcon className="size-5 shrink-0" />
          </button>
        </Frame>

        <Frame
          n="06"
          name="Стекло на фото"
          why="Матовое стекло поверх кадра: подложка размывает то, что под ней, и подпись держится на любом снимке. Ставить только на фотографию — на плоском тоне выглядит бледной."
          tags={['поверх фото', 'слайды 1, 3, 7', 'backdrop-filter']}
        >
          <PhotoBed src={proPhoto}>
            <button type="button" className="bx bx-glass w-full">
              <PlayIcon className="size-4 shrink-0" />
              <span>Смотреть разбор</span>
            </button>
          </PhotoBed>
        </Frame>

        <Frame
          n="07"
          name="С толщиной"
          why="У кнопки есть нижняя грань — она физически стоит на странице. При нажатии уезжает вниз на 3px и грань исчезает: палец чувствует нажатие без всякой вибрации. Нажмите."
          tags={['тактильная', 'слайд 6', 'нажмите']}
        >
          <button type="button" className="bx bx-solid3d w-full">
            <span>Оплатить участие</span>
          </button>
        </Frame>

        <Frame
          n="08"
          name="Заливка-развёртка"
          why="В покое контур, при наведении цвет заезжает слева направо и подпись становится тёмной. Вторичное действие, которое не спорит с главным, пока на него не посмотрели. Наведите."
          tags={['вторичное действие', 'слайды 4, 8', 'наведите']}
        >
          <button type="button" className="bx bx-sweep w-full">
            <span className="relative z-10">Посмотреть программу</span>
          </button>
        </Frame>

        <Frame
          n="09"
          name="Едущая стрелка"
          why="При наведении стрелка уезжает вправо, а на её место слева приезжает вторая. Движение говорит «перенесёт дальше» лучше подписи — это ровно смысл кнопки «К ПРОГРАММЕ». Наведите."
          tags={['навигация', 'слайд 2', 'наведите']}
        >
          <button type="button" className="bx bx-fill bx-tone-electric bx-arrow w-full">
            <span>К программе</span>
            <span className="bx-arrow-box" aria-hidden="true">
              <ArrowRightIcon className="bx-arrow-a size-5" />
              <ArrowRightIcon className="bx-arrow-b size-5" />
            </span>
          </button>
        </Frame>

        <Frame
          n="10"
          name="Билет"
          why="Кнопка-корешок: по бокам вырезы, между действием и ценой пунктир. Тариф выглядит не строкой прайса, а пропуском, который выдают на руки. Вырезы — радиальные градиенты, картинки нет."
          tags={['тарифы', 'слайд 6', 'перфорация']}
        >
          <div className="flex flex-col gap-3">
            <button type="button" className="bx-ticket bx-ticket-blue w-full">
              <span className="bx-ticket-main">
                <span className="bx-ticket-label">Стандарт</span>
                <span className="bx-ticket-note">6 модулей, 35 уроков</span>
              </span>
              <span className="bx-ticket-cut" aria-hidden="true" />
              <span className="bx-ticket-price">29 900 ₽</span>
            </button>
            <button type="button" className="bx-ticket bx-ticket-gold w-full">
              <span className="bx-ticket-main">
                <span className="bx-ticket-label">Личный разбор</span>
                <span className="bx-ticket-note">Обратная связь от ГМ</span>
              </span>
              <span className="bx-ticket-cut" aria-hidden="true" />
              <span className="bx-ticket-price">79 900 ₽</span>
            </button>
          </div>
        </Frame>

        <Frame
          n="11"
          name="Градиентная рамка"
          why="Тело кнопки тёмное, а рамка — градиент из синего в лайм. Спокойная, но не безликая: годится там, где рядом уже стоит яркая кнопка и вторая заливка была бы дракой."
          tags={['вторичное действие', 'слайды 4, 8', 'рамка градиентом']}
        >
          <button type="button" className="bx bx-gradborder w-full">
            <MonitorIcon className="size-5 shrink-0 text-[#6AA0FF]" />
            <span>Как проходит обучение</span>
          </button>
        </Frame>

        <Frame
          n="12"
          name="С портретом"
          why="Слева лицо Гаджиева, дальше подпись и стрелка. Кнопка перестаёт быть кнопкой и становится обращением к человеку: нажимают не «форму», а «написать ему». Для связи и для блока автора."
          tags={['связь, автор', 'слайды 3, 6', 'фото в кнопке']}
        >
          <button type="button" className="bx-person w-full">
            <span
              className="bx-person-face"
              style={{ backgroundImage: `url(${coachPhoto})` }}
              aria-hidden="true"
            />
            <span className="bx-person-text">
              <span className="bx-person-title">Задать вопрос</span>
              <span className="bx-person-note">Отвечает команда Гаджи Муслимовича</span>
            </span>
            <ArrowRightIcon className="size-5 shrink-0 text-white/40" />
          </button>
        </Frame>

        <Frame
          n="13"
          name="Плиты с цветными иконками"
          why="Пункт меню, а не призыв: иконка в цветном квадрате, подпись в две строки. Цвет квадрата разводит пункты по смыслу — видео синее, практика зелёная, разбор фиолетовый. Для слайда 5 и FAQ."
          tags={['список действий', 'слайды 5, 8', 'три цвета']}
        >
          <div className="flex flex-col gap-2.5">
            <TileButton
              tone="electric"
              icon={<MonitorIcon className="size-5" />}
              title="Видеоурок"
              note="18 минут, доступ навсегда"
            />
            <TileButton
              tone="turf"
              icon={<WhistleIcon className="size-5" />}
              title="Практика"
              note="Задание с проверкой"
            />
            <TileButton
              tone="violet"
              icon={<TacticsIcon className="size-5" />}
              title="Разбор матча"
              note="«Анжи» образца 2012 года"
            />
          </div>
        </Frame>

        <Frame
          n="14"
          name="Мессенджеры"
          why="Уход из сайта в другое приложение. Фирменный цвет тут не украшение, а предупреждение: человек должен понимать, что откроется WhatsApp, ещё до нажатия. Иконка обязательна."
          tags={['внешний переход', 'слайд 6', 'фирменные цвета']}
        >
          <div className="flex flex-col gap-2.5">
            <button type="button" className="bx bx-whatsapp w-full">
              <WhatsAppIcon className="size-5 shrink-0 fill-current" />
              <span>Написать в WhatsApp</span>
            </button>
            <button type="button" className="bx bx-fill bx-tone-cyan w-full">
              <ArrowRightIcon className="size-5 shrink-0 -rotate-45" />
              <span>Написать в Telegram</span>
            </button>
          </div>
        </Frame>

        <Frame
          n="15"
          name="С бейджем и живой точкой"
          why="Ярлык в углу и пульсирующая точка рядом с подписью. Ярлык отвечает на «почему сейчас», точка — на «идёт ли ещё набор». Оба слоя не трогают геометрию, кнопку можно ставить в любую раскладку."
          tags={['срочность', 'слайд 6', 'пульс']}
        >
          <div>
            <button type="button" className="bx bx-fill bx-tone-electric w-full">
              <span className="bx-badge">−30% до 5 сентября</span>
              <span className="bx-dot" aria-hidden="true" />
              <span>Занять место в потоке</span>
            </button>
            <p className="mt-2.5 text-center text-[11.5px] text-white/40">осталось 12 мест из 40</p>
          </div>
        </Frame>

        <Frame
          n="16"
          name="Прогресс набора в заливке"
          why="Заливка показывает, сколько мест занято: залито 70% — группа почти собрана. Цифра и кнопка становятся одним объектом, и повод торопиться виден, не читая ни строчки."
          tags={['набор группы', 'слайд 6', 'данные в кнопке']}
        >
          <button
            type="button"
            className="bx bx-progress w-full"
            style={{ ['--fill' as string]: '70%' }}
          >
            <span className="bx-progress-bar" aria-hidden="true" />
            <span className="relative z-10">Записаться — 28 из 40</span>
          </button>
        </Frame>

        <Frame
          n="17"
          name="Иконочные и текстовая ссылка"
          why="Круглые 52×52 для карусели и плеера: акцентные со свечением, остальные тихие. Ссылка со стрелкой не должна выглядеть кнопкой вовсе — наведите, зазор до стрелки расходится."
          tags={['минимальный вес', 'слайды 2, 4', '52×52']}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2.5">
              <IconButton label="Предыдущий">
                <ArrowRightIcon className="size-5 rotate-180" />
              </IconButton>
              <IconButton label="Следующий">
                <ArrowRightIcon className="size-5" />
              </IconButton>
              <IconButton label="Смотреть урок" tone="electric">
                <PlayIcon className="size-4" />
              </IconButton>
              <IconButton label="Мой прогресс" tone="turf">
                <GrowthIcon className="size-5" />
              </IconButton>
            </div>
            <a href="#" className="bx-link">
              Подробнее
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </Frame>

        <Frame
          n="18"
          name="Состояния: отправка и готово"
          why="Одна кнопка в трёх положениях: покой, отправка, готово. Готово зелёное, а не синее: цвет меняется вместе со смыслом, иначе успех неотличим от ожидания. Ширина не гуляет. Нажмите."
          tags={['форма, оплата', 'слайды 6, 8', 'нажмите']}
        >
          <StatefulButton />
        </Frame>

        <Frame
          n="19"
          name="Нижняя панель с миниатюрой"
          why="Приклеена к низу экрана и едет с ним: человек решился на середине страницы и нажимает сразу, а не листает до конца. Слева миниатюра, чтобы панель не выглядела баннером. Занимает 76px навсегда — либо она, либо кнопки внутри секций."
          tags={['на всю страницу', 'вместо кнопок в секциях', 'position: fixed']}
        >
          <StickyBar />
        </Frame>
      </div>

      <footer className="mx-auto mt-14 max-w-[1500px] border-t border-white/12 pt-6 text-[13px] leading-relaxed text-white/40">
        Выбирать лучше связкой, а не по одной: на слайде почти всегда есть второе
        действие, и оно должно быть заметно тише. Рабочие пары — 02 или 09 как главная и
        08 или 11 как вторичная; 10 и 04 на тарифы; 12 на связь; 17 везде, где нужно
        сказать тихо. Громкие (05, 15, 16) и нижняя панель (19) существуют в единственном
        экземпляре на всю страницу: две такие — и обе перестают работать.
      </footer>
    </div>
  )
}

/* ── Палитра ────────────────────────────────────────────────────────────── */

const PALETTE = [
  {
    name: 'Электрик',
    role: 'то, что стоит сейчас. Главное действие',
    label: 'К программе',
    className: 'bx-tone-electric',
  },
  {
    name: 'Небесный',
    role: 'акцент страницы #6AA0FF. Мягче, для вторичных',
    label: 'Подробнее',
    className: 'bx-tone-sky',
  },
  {
    name: 'Газон',
    role: 'зелёный поля. Набор, старт, «идёт запись»',
    label: 'Записаться',
    className: 'bx-tone-turf',
  },
  {
    name: 'Лайм-неон',
    role: 'самый громкий. Одна кнопка на лендинг',
    label: 'Забрать место',
    className: 'bx-tone-lime',
  },
  {
    name: 'Золото',
    role: 'верхний тариф. Тёмная подпись, не белая',
    label: 'Личный разбор',
    className: 'bx-tone-gold',
  },
  {
    name: 'Индиго',
    role: 'разборы и аналитика. Тише электрика',
    label: 'Разбор матча',
    className: 'bx-tone-violet',
  },
  {
    name: 'Циан',
    role: 'связь, мессенджеры, «написать»',
    label: 'Написать',
    className: 'bx-tone-cyan',
  },
  {
    name: 'Графит',
    role: 'нейтральная. Отказ, «позже», «все вопросы»',
    label: 'Все вопросы',
    className: 'bx-tone-graphite',
  },
]

/* ── Составные кнопки ───────────────────────────────────────────────────── */

function TileButton({
  tone,
  icon,
  title,
  note,
}: {
  tone: 'electric' | 'turf' | 'violet'
  icon: ReactNode
  title: string
  note: string
}) {
  return (
    <button type="button" className={`bx-tile bx-tile-${tone} w-full`}>
      <span className="bx-tile-icon">{icon}</span>
      <span className="min-w-0 flex-1 text-left">
        <span className="bx-tile-title">{title}</span>
        <span className="bx-tile-note">{note}</span>
      </span>
      <ArrowRightIcon className="size-4 shrink-0 text-white/30" />
    </button>
  )
}

function IconButton({
  label,
  tone,
  children,
}: {
  label: string
  tone?: 'electric' | 'turf'
  children: ReactNode
}) {
  return (
    <button type="button" aria-label={label} className={`bx-icon ${tone ? `bx-icon-${tone}` : ''}`}>
      {children}
    </button>
  )
}

/**
 * Кнопка с состояниями. `aria-busy` на время отправки и `aria-live` на
 * подписи: озвучка должна сообщить о смене состояния, иначе для незрячего
 * нажатие проходит бесследно.
 */
function StatefulButton() {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const run = () => {
    if (state !== 'idle') return
    setState('sending')
    window.setTimeout(() => setState('done'), 1400)
    window.setTimeout(() => setState('idle'), 3800)
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={run}
        aria-busy={state === 'sending'}
        disabled={state !== 'idle'}
        className={`bx bx-fill w-full ${state === 'done' ? 'bx-tone-turf' : 'bx-tone-electric'}`}
      >
        {state === 'sending' && <span className="bx-spinner" aria-hidden="true" />}
        {state === 'done' && <CheckIcon className="size-5 shrink-0" />}
        <span aria-live="polite">
          {state === 'idle' && 'Отправить заявку'}
          {state === 'sending' && 'Отправляем'}
          {state === 'done' && 'Готово'}
        </span>
      </button>
      <p className="text-center text-[11.5px] text-white/35">Нажмите — состояния сменятся сами</p>
    </div>
  )
}

/**
 * Нижняя панель. На живой странице это была бы `fixed`-раскладка по окну;
 * здесь она абсолютная внутри рамки — иначе в макетной вылезла бы поверх всей
 * страницы вариантов.
 */
function StickyBar() {
  return (
    <div className="relative h-[220px] overflow-hidden rounded-lg">
      <div className="space-y-2.5 pb-24">
        <div className="h-3 w-3/4 rounded bg-white/8" />
        <div className="h-3 w-full rounded bg-white/6" />
        <div className="h-3 w-5/6 rounded bg-white/6" />
        <div className="h-3 w-2/3 rounded bg-white/6" />
      </div>

      <div className="absolute inset-x-0 bottom-0">
        {/* Затемнение над панелью: без него содержимое упирается в её край
            резкой линией и панель выглядит наклеенной поверх. */}
        <div className="pointer-events-none h-10 bg-[linear-gradient(180deg,transparent,rgba(8,13,18,.92))]" />
        <div className="flex items-center gap-3 border-t border-white/10 bg-[#080d12]/95 p-3 backdrop-blur-md">
          <img
            src={academyPhoto}
            alt=""
            aria-hidden="true"
            className="size-12 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[13px] font-bold leading-tight">Стандарт</p>
            <p className="text-[11.5px] leading-tight text-white/50">29 900 ₽ · 6 модулей</p>
          </div>
          <button type="button" className="bx bx-fill bx-tone-electric shrink-0">
            <span>Оплатить</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/** Подложка под стеклянную кнопку — настоящий кадр из ассетов проекта. */
function PhotoBed({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,14,.2),rgba(5,9,14,.72))]"
      />
      <div className="relative p-4 pt-24">{children}</div>
    </div>
  )
}

/* ── Оболочка макетной ──────────────────────────────────────────────────── */

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
      <p className="mb-6 max-w-[72ch] text-[13.5px] leading-relaxed text-white/55">{why}</p>

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

function Preview({
  width,
  caption,
  children,
}: {
  width: number
  caption: string
  children: ReactNode
}) {
  return (
    <div style={{ width }} className="shrink-0">
      <p className="mb-2 text-[11px] uppercase tracking-[.1em] text-white/35">{caption}</p>
      {/* Тот же фон и те же боковые поля, что у секций на живой странице. */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0c141d] px-5 py-8">
        {children}
      </div>
    </div>
  )
}

/**
 * Стили кнопок — одним блоком, а не утилитами Tailwind.
 *
 * Причина: половина вариантов держится на псевдоэлементах, keyframes и
 * составных фонах (перфорация билета, полосы газона, градиентная рамка через
 * два слоя background-origin). В утилитах это превращается в нечитаемые
 * строки на пол-экрана, а часть вообще не выражается. Блок живёт здесь, а не
 * в `index.css`, потому что страница макетная: в прод уедет только выбранный
 * вариант, переписанный руками.
 */
function ButtonCss() {
  return (
    <style>{`
.bx {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 8px;
  font-family: "Bebas Neue Cyrillic", "Bahnschrift", sans-serif;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  transition: transform 160ms cubic-bezier(.23,1,.32,1), box-shadow 220ms ease,
    background-color 220ms ease, color 220ms ease, border-color 220ms ease;
}
.bx:active { transform: scale(.985); }
.bx:disabled { cursor: default; }

/* ── Палитра: один рисунок заливки, разные цвета ─────────────────────── */
.bx-fill {
  color: #fff;
  background-image: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
  background-size: 100% 1px;
  background-position: top;
  background-repeat: no-repeat;
}
.bx-tone-electric { background-color: #1e5bff; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), 0 8px 22px rgba(30,91,255,.34); }
.bx-tone-sky      { background-color: #4b87e8; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), 0 8px 22px rgba(75,135,232,.28); }
.bx-tone-turf     { background-color: #17914f; box-shadow: inset 0 0 0 1px rgba(255,255,255,.2), 0 8px 22px rgba(23,145,79,.3); }
.bx-tone-lime     { background-color: #b6ff3d; color: #10240a; box-shadow: inset 0 0 0 1px rgba(255,255,255,.5), 0 8px 26px rgba(182,255,61,.34); }
.bx-tone-gold     { background-color: #e0ac47; color: #24190a; box-shadow: inset 0 0 0 1px rgba(255,255,255,.42), 0 8px 22px rgba(224,172,71,.3); }
.bx-tone-violet   { background-color: #6f5cf0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), 0 8px 22px rgba(111,92,240,.3); }
.bx-tone-cyan     { background-color: #17a8bd; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), 0 8px 22px rgba(23,168,189,.28); }
.bx-tone-graphite { background-color: #1c2634; color: rgba(255,255,255,.9); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }

@media (hover: hover) and (pointer: fine) {
  .bx-tone-electric:hover { background-color: #2f6bff; }
  .bx-tone-sky:hover      { background-color: #5e95ee; }
  .bx-tone-turf:hover     { background-color: #1ea55b; }
  .bx-tone-lime:hover     { background-color: #c4ff5c; }
  .bx-tone-gold:hover     { background-color: #ecbb5c; }
  .bx-tone-violet:hover   { background-color: #7f6dff; }
  .bx-tone-cyan:hover     { background-color: #1cbcd3; }
  .bx-tone-graphite:hover { background-color: #243043; }
}

/* ── 02. Фотография в заливке ────────────────────────────────────────── */
.bx-photo { color: #fff; background: #0a1119; box-shadow: inset 0 0 0 1px rgba(255,255,255,.16), 0 8px 22px rgba(0,0,0,.4); }
.bx-photo-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: 60% 56%; filter: brightness(1.28) saturate(1.1);
  transform: scale(1.06);
  transition: transform 600ms cubic-bezier(.32,.72,0,1);
}
/* Синий множитель поверх кадра: без него подпись тонет в светлом газоне, а
   кнопка перестаёт читаться кнопкой — становится картинкой. */
.bx-photo-veil {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(10,32,92,.92) 0%, rgba(16,52,132,.62) 52%, rgba(22,70,168,.34) 100%);
}
@media (hover: hover) and (pointer: fine) {
  .bx-photo:hover .bx-photo-img { transform: scale(1.14); }
}

/* ── 03. Разметка поля ───────────────────────────────────────────────── */
.bx-turf {
  color: #fff;
  background:
    repeating-linear-gradient(115deg, rgba(255,255,255,.07) 0 18px, transparent 18px 36px),
    linear-gradient(180deg, #1aa059, #10653a);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.2), 0 8px 22px rgba(16,101,58,.38);
}
/* Белая линия штрафной понизу — деталь, ради которой кнопка и зелёная. */
.bx-turf::after {
  content: ""; position: absolute; left: 12px; right: 12px; bottom: 7px;
  height: 1px; background: rgba(255,255,255,.34);
}

/* ── 04. Золото ──────────────────────────────────────────────────────── */
.bx-gold {
  color: #24190a;
  background: linear-gradient(100deg, #b8842c 0%, #e8c169 26%, #fff0c0 44%, #e8c169 62%, #c08f33 100%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.5), 0 8px 24px rgba(200,150,60,.3);
}
/* Блик проезжает поперёк раз в 4.5 секунды — металл должен ловить свет. */
.bx-gold::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
  transform: skewX(-18deg);
  animation: bx-sheen 4.5s ease-in-out infinite;
}
@keyframes bx-sheen { 0%, 62% { left: -60%; } 100% { left: 130%; } }

/* ── 05. Неон ────────────────────────────────────────────────────────── */
.bx-neon {
  color: #d4ff7a;
  background: rgba(182,255,61,.04);
  border: 1px solid rgba(182,255,61,.55);
  box-shadow: 0 0 0 1px rgba(182,255,61,.12), 0 0 22px rgba(182,255,61,.16), inset 0 0 18px rgba(182,255,61,.07);
  text-shadow: 0 0 12px rgba(182,255,61,.45);
}
@media (hover: hover) and (pointer: fine) {
  .bx-neon:hover {
    background: rgba(182,255,61,.13);
    border-color: rgba(182,255,61,.9);
    box-shadow: 0 0 0 1px rgba(182,255,61,.3), 0 0 34px rgba(182,255,61,.34), inset 0 0 26px rgba(182,255,61,.14);
  }
}

/* ── 06. Стекло ──────────────────────────────────────────────────────── */
.bx-glass {
  color: #fff;
  background: rgba(255,255,255,.13);
  border: 1px solid rgba(255,255,255,.32);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 10px 30px rgba(0,0,0,.35);
}
@media (hover: hover) and (pointer: fine) { .bx-glass:hover { background: rgba(255,255,255,.2); } }

/* ── 07. Толщина ─────────────────────────────────────────────────────── */
.bx-solid3d {
  color: #fff;
  background: linear-gradient(180deg, #3d72ff, #1e5bff);
  box-shadow: 0 4px 0 #0f3399, inset 0 1px 0 rgba(255,255,255,.4);
  transition: transform 90ms ease, box-shadow 90ms ease;
}
.bx-solid3d:active { transform: translateY(3px); box-shadow: 0 1px 0 #0f3399, inset 0 1px 0 rgba(255,255,255,.4); }

/* ── 08. Заливка-развёртка ───────────────────────────────────────────── */
.bx-sweep { color: rgba(255,255,255,.9); background: transparent; border: 1px solid rgba(255,255,255,.24); }
.bx-sweep::before {
  content: ""; position: absolute; inset: 0;
  background: #b6ff3d;
  transform: scaleX(0); transform-origin: left;
  transition: transform 380ms cubic-bezier(.32,.72,0,1);
}
@media (hover: hover) and (pointer: fine) {
  .bx-sweep:hover { color: #10240a; border-color: #b6ff3d; }
  .bx-sweep:hover::before { transform: scaleX(1); }
}

/* ── 09. Едущая стрелка ──────────────────────────────────────────────── */
.bx-arrow-box { position: relative; display: block; width: 20px; height: 20px; overflow: hidden; flex: 0 0 auto; }
.bx-arrow-box > svg { position: absolute; inset: 0; transition: transform 320ms cubic-bezier(.32,.72,0,1); }
.bx-arrow-b { transform: translateX(-140%); }
@media (hover: hover) and (pointer: fine) {
  .bx-arrow:hover .bx-arrow-a { transform: translateX(140%); }
  .bx-arrow:hover .bx-arrow-b { transform: translateX(0); }
}

/* ── 10. Билет ───────────────────────────────────────────────────────── */
.bx-ticket {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  min-height: 68px; padding: 0 18px;
  border-radius: 10px;
  text-align: left;
  transition: transform 160ms cubic-bezier(.23,1,.32,1), filter 220ms ease;
}
.bx-ticket:active { transform: scale(.99); }
@media (hover: hover) and (pointer: fine) { .bx-ticket:hover { filter: brightness(1.07); } }
.bx-ticket-blue { color: #fff; background: linear-gradient(100deg, #1e5bff, #2f6bff); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2), 0 8px 22px rgba(30,91,255,.3); }
.bx-ticket-gold { color: #24190a; background: linear-gradient(100deg, #c08f33, #e8c169 55%, #d3a54a); box-shadow: inset 0 0 0 1px rgba(255,255,255,.45), 0 8px 22px rgba(200,150,60,.28); }
.bx-ticket-main { flex: 1 1 auto; min-width: 0; }
.bx-ticket-label { display: block; font-family: "Bebas Neue Cyrillic", "Bahnschrift", sans-serif; font-size: 21px; line-height: 1; letter-spacing: 1px; text-transform: uppercase; }
.bx-ticket-note { display: block; margin-top: 5px; font-size: 11.5px; line-height: 1.2; opacity: .74; }
/* Перфорация: пунктирная линия между действием и ценой плюс два выреза по
   краям — круги цветом фона секции. Рисуются фоном, картинки не нужно. */
.bx-ticket-cut {
  flex: 0 0 auto; width: 1px; align-self: stretch; margin: 12px 4px;
  background-image: linear-gradient(currentColor 0 4px, transparent 4px 9px);
  background-size: 1px 9px;
  opacity: .62;
}
.bx-ticket::before, .bx-ticket::after {
  content: ""; position: absolute; width: 14px; height: 14px; border-radius: 50%;
  background: #0c141d; right: 92px;
}
.bx-ticket::before { top: -7px; }
.bx-ticket::after { bottom: -7px; }
.bx-ticket-price { flex: 0 0 auto; font-family: "Onest", sans-serif; font-size: 15px; font-weight: 700; }

/* ── 11. Градиентная рамка ───────────────────────────────────────────── */
.bx-gradborder {
  color: #fff;
  border: 1px solid transparent;
  background:
    linear-gradient(#0e1620, #0e1620) padding-box,
    linear-gradient(100deg, #1e5bff, #6AA0FF 45%, #b6ff3d) border-box;
}
@media (hover: hover) and (pointer: fine) {
  .bx-gradborder:hover {
    background:
      linear-gradient(#16202c, #16202c) padding-box,
      linear-gradient(100deg, #1e5bff, #6AA0FF 45%, #b6ff3d) border-box;
  }
}

/* ── 12. С портретом ─────────────────────────────────────────────────── */
.bx-person {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  min-height: 68px; padding: 8px 14px 8px 8px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(100deg, #14202e, #0d1620);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 8px 22px rgba(0,0,0,.32);
  transition: transform 160ms cubic-bezier(.23,1,.32,1), background 220ms ease;
}
.bx-person:active { transform: scale(.99); }
/* Не <img> с object-position, а фон с зумом. Исходник почти квадратный
   (1337×1176), лицо занимает в нём кусок примерно 250×300 в точке 66% × 28%.
   При object-fit: cover квадратная рамка обрезает по высоте, запас по
   горизонтали остаётся всего 7px — сдвинуть кадр на лицо нечем, в вырез
   попадали прожекторы. background-size: 390% увеличивает снимок вчетверо,
   и точка 72% × 19% ставит лицо в центр выреза. */
.bx-person-face {
  width: 52px; height: 52px; border-radius: 10px; flex: 0 0 auto;
  background-size: 390% auto;
  background-position: 72% 19%;
  background-repeat: no-repeat;
}
.bx-person-text { flex: 1 1 auto; min-width: 0; text-align: left; }
.bx-person-title { display: block; font-family: "Bebas Neue Cyrillic", "Bahnschrift", sans-serif; font-size: 20px; line-height: 1; letter-spacing: 1px; text-transform: uppercase; }
.bx-person-note { display: block; margin-top: 4px; font-size: 11.5px; line-height: 1.25; color: rgba(255,255,255,.5); }
@media (hover: hover) and (pointer: fine) { .bx-person:hover { background: linear-gradient(100deg, #1a2939, #121d29); } }

/* ── 13. Плиты ───────────────────────────────────────────────────────── */
.bx-tile {
  display: flex; align-items: center; gap: 14px;
  min-height: 68px; padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.12);
  background: #0a1119;
  transition: background-color 160ms ease, border-color 160ms ease;
}
.bx-tile:active { background: rgba(255,255,255,.05); }
.bx-tile-icon { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; flex: 0 0 auto; }
.bx-tile-electric .bx-tile-icon { background: rgba(30,91,255,.18); color: #6AA0FF; }
.bx-tile-turf .bx-tile-icon { background: rgba(23,145,79,.2); color: #4ade80; }
.bx-tile-violet .bx-tile-icon { background: rgba(111,92,240,.2); color: #a99bff; }
@media (hover: hover) and (pointer: fine) {
  .bx-tile-electric:hover { border-color: rgba(106,160,255,.4); }
  .bx-tile-turf:hover { border-color: rgba(74,222,128,.35); }
  .bx-tile-violet:hover { border-color: rgba(169,155,255,.35); }
}
.bx-tile-title { display: block; font-family: "Onest", sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; line-height: 1.15; letter-spacing: .01em; }
.bx-tile-note { display: block; margin-top: 3px; font-size: 11.5px; line-height: 1.2; color: rgba(255,255,255,.5); }

/* ── 14. WhatsApp ────────────────────────────────────────────────────── */
.bx-whatsapp { color: #052e16; background: linear-gradient(180deg, #2ee06f, #1fb757); box-shadow: inset 0 0 0 1px rgba(255,255,255,.34), 0 8px 22px rgba(37,211,102,.28); }
@media (hover: hover) and (pointer: fine) { .bx-whatsapp:hover { background: linear-gradient(180deg, #3aeb7b, #23c561); } }

/* ── 15. Бейдж и живая точка ─────────────────────────────────────────── */
/* Бейдж лежит внутри верхней кромки, а не выступает за неё: у .bx стоит
   overflow: hidden ради заливок, и всё, что вылезет наружу, срежется. */
.bx-badge {
  position: absolute; top: 0; right: 0;
  padding: 3px 9px 4px;
  border-bottom-left-radius: 8px;
  background: #b6ff3d; color: #10240a;
  font-family: "Onest", sans-serif; font-size: 10px; font-weight: 800;
  letter-spacing: .02em; text-transform: uppercase; line-height: 1;
}
.bx-dot { width: 8px; height: 8px; border-radius: 50%; background: #b6ff3d; flex: 0 0 auto; animation: bx-pulse 1.8s ease-in-out infinite; }
@keyframes bx-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(182,255,61,.6); }
  50% { opacity: .65; box-shadow: 0 0 0 6px rgba(182,255,61,0); }
}

/* ── 16. Прогресс в заливке ──────────────────────────────────────────── */
.bx-progress { color: #fff; background: #16283f; box-shadow: inset 0 0 0 1px rgba(255,255,255,.16); }
.bx-progress-bar {
  position: absolute; top: 0; bottom: 0; left: 0; width: var(--fill, 50%);
  background: linear-gradient(90deg, #1e5bff, #4b87e8);
  box-shadow: 2px 0 12px rgba(75,135,232,.6);
}

/* ── 17. Иконочные и ссылка ──────────────────────────────────────────── */
.bx-icon {
  display: flex; align-items: center; justify-content: center;
  width: 52px; height: 52px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.04); color: rgba(255,255,255,.8);
  transition: transform 160ms cubic-bezier(.23,1,.32,1), background-color 200ms ease, box-shadow 200ms ease;
}
.bx-icon:active { transform: scale(.94); }
.bx-icon-electric { border-color: transparent; background: #1e5bff; color: #fff; box-shadow: 0 8px 22px rgba(30,91,255,.36); }
.bx-icon-turf { border-color: transparent; background: #17914f; color: #fff; box-shadow: 0 8px 22px rgba(23,145,79,.32); }
.bx-link {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 44px;
  font-family: "Onest", sans-serif; font-size: 13px; font-weight: 600;
  color: #6AA0FF;
  transition: gap 200ms cubic-bezier(.32,.72,0,1), color 200ms ease;
}
@media (hover: hover) and (pointer: fine) { .bx-link:hover { gap: 12px; color: #8fbaff; } }

/* ── 18. Спиннер ─────────────────────────────────────────────────────── */
.bx-spinner {
  width: 16px; height: 16px; border-radius: 50%; flex: 0 0 auto;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: bx-spin .8s linear infinite;
}
@keyframes bx-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .bx, .bx-ticket, .bx-icon, .bx-link, .bx-person, .bx-photo-img,
  .bx-sweep::before, .bx-arrow-box > svg { transition: none; }
  .bx-dot, .bx-spinner { animation: none; }
  .bx-gold::after { display: none; }
}
`}</style>
  )
}
