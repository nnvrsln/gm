import type { CSSProperties, ReactNode } from 'react'
import coachBand from '../assets/coach-band.webp'
import { QUOTE } from '../data/quote'

/**
 * Макетная слайда 9 «Финальная цитата»: три подачи. Отдельная точка входа
 * (quote.html → src/quote.tsx), в прод-сборку не попадает.
 *
 * ── Что задано и не обсуждается ──────────────────────────────────────────
 *   1. Текст цитаты и подпись — дословно, из `data/quote.ts`. Владелец взял
 *      их с работающего gadjiev.pro и передал 01.09; ТЗ по этому слайду не
 *      даёт ничего, кроме строки «мотивационная цитата и жизнеутверждающее
 *      фото» (Q20);
 *   2. кадр — `coach-band.webp`, названный владельцем там же. Другие кадры
 *      не примеряем: ассеты в этом проекте не подменяем.
 *
 * Значит, выбирать надо не содержимое, а роль секции на странице: чем
 * заканчивается лендинг — тихой подписью под вопросами, вторым «досье» вслед
 * за слайдом 3 или отдельным закрывающим кадром.
 *
 * ── Решения, общие для всех трёх ─────────────────────────────────────────
 *
 * **Заголовка у секции нет.** В ТЗ его нет, и он бы мешал: цитата — прямая
 * речь, а надпись «ЦИТАТА» над ней объясняет то, что и так видно по кавычкам
 * и подписи. Единственный текст секции — сама цитата и подпись.
 *
 * **Кавычки рисует вёрстка, в тексте их нет.** Иначе они попадут в копипаст
 * и в микроразметку, когда она появится.
 *
 * **Имя набрано Bebas-капслоком, роль под ним — строчными.** Тот же приём,
 * что у регалий слайда 3: капслок несёт голос, пояснение под ним тише.
 *
 * **Кадр везде декоративный** (`alt=""`): всё, что на нём есть, сказано
 * рядом текстом. Края растворяются в тон страницы — требование владельца к
 * слайдам 2 и 3, здесь оно то же.
 *
 * Оговорка про рамки макетной: это блоки, а не окно браузера, медиазапросы
 * по ширине вьюпорта внутри них не срабатывают.
 */

// Bebas инлайновым стилем: имя шрифта с пробелами Tailwind как
// arbitrary-значение не разбирает. Та же грабля во всех макетных.
const BEBAS: CSSProperties = { fontFamily: '"Bebas Neue Cyrillic", "Bahnschrift", sans-serif' }

/** Синий акцент страницы. */
const ACCENT = '#6AA0FF'

/* ─────────────────────────────────────────────────────────────────────────
   01. Манифест
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Цитата — не абзац рядом с фотографией, а главный шрифт секции.
 *
 * Приём взят из подсказки ui-ux-pro-max по паре «Bold Typography Mobile»:
 * type-as-hero, крупный display-кегль для прямой речи и мелкая метка для
 * подписи. Первая фраза («Профессия тренера — творческая.») набрана Bebas
 * той же заливкой, что заголовки секций, — на этой странице так выглядит
 * только заголовок, поэтому фраза читается как заявление, а не как текст в
 * рамке. Остаток цитаты идёт обычным Onest под ней: набирать капслоком 215
 * знаков нельзя, длинный текст в верхнем регистре читается вдвое медленнее.
 *
 * Кадр здесь не иллюстрация, а атмосфера: приглушён до 0.55 и накрыт синим
 * пятном — фигура остаётся узнаваемой, но не спорит с текстом за внимание.
 * Дуотон синим взят не с потолка: `#1E5BFF` — тот же цвет, что в акценте
 * страницы и в нити FAQ.
 *
 * Контраст: белый по затемнённому кадру даёт больше 7:1 — вдвое выше
 * минимума 4.5:1 из чеклиста доступности.
 */
function V1Manifesto() {
  return (
    <section aria-label="Цитата автора обучения" className="relative -mx-5 grid overflow-hidden">
      {/* Распорка задаёт высоту отношением к собственной ширине: при жёсткой
          высоте кадр на узком экране зумится (грабля «Автора обучения»). */}
      <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[430/415]" />

      <div className="pointer-events-none absolute inset-0">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[62%_46%] opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_86%_at_78%_34%,rgba(30,91,255,.22),transparent_62%)]" />
        {/* Горизонтальная шторка держит читаемость текста, вертикальная
            стыкует блок с соседями. Раздельно, потому что у них разные
            задачи: первая обязана давать 4.5:1 в левой половине, вторая —
            попадать в тон страницы на границах. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.92)_0%,rgba(5,8,11,.86)_46%,rgba(5,8,11,.6)_62%,rgba(5,8,11,.24)_78%,rgba(5,8,11,.1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.22)_20%,rgba(5,8,11,.3)_66%,#05080b_100%)]" />
      </div>

      {/* relative обязателен: слой кадра абсолютный, а абсолютные элементы
          рисуются поверх непозиционированного содержимого. Без него текст
          уезжает ПОД шторки — в подаче 03 он пропадал целиком. */}
      <div className="relative col-start-1 row-start-1 flex flex-col justify-center px-5 py-12">
        <figure>
          <blockquote>
            <span className="section-title block text-[31px] uppercase leading-[.98] tracking-title">
              {QUOTE.lead}
            </span>
            {/* Остаток цитаты держится в 78% ширины: строка длиннее 60 знаков
                на телефоне теряет начало следующей. */}
            <span className="mt-4 block w-[74%] text-[15px] leading-[1.52] text-white/92">{QUOTE.rest}</span>
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3">
            <span aria-hidden="true" style={{ backgroundColor: ACCENT }} className="h-px w-7 rounded-full" />
            <span className="text-[11px] uppercase leading-none tracking-[.2em] text-white/78">
              {QUOTE.author}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   02. Врезка с обтеканием
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Журнальный приём в чистом виде: снимок врезан в текст, и текст его
 * обтекает. Из стиля `editorial-grid-magazine` (ui-ux-pro-max) сюда взяты
 * буквица, обтекание врезки и печатные линейки вместо рамок.
 *
 * Почему это решает то, обо что спотыкались все прошлые подачи. Колонка
 * рядом с фотографией была узкой на всю высоту блока — цитата из 215 знаков
 * шла в ней десятью строками. При обтекании узкими остаются только первые
 * четыре строки, дальше текст идёт во всю ширину: снимок отдаёт место, как
 * только он кончился.
 *
 * Врезка — квадрат 150×170 с кадрированием по лицу, у него скругление 14px
 * и волосяная рамка: врезка в журнале всегда имеет край, иначе это фон.
 * Кавычка работает буквицей — `float` рядом с первым словом, как `::first-
 * letter` в печатной вёрстке.
 *
 * Подпись стоит на печатной линейке: слева имя Bebas, справа роль мелким
 * разрядкой — типичный byline, а не «подпись под фото».
 *
 * **Выбрана владельцем 01.09 и перенесена в боевую** —
 * `src/components/QuoteSection.tsx`. Здесь остался вид на момент выбора; в
 * боевой версии подача подогнана к FAQ над собой (владелец: «вообще не
 * метчится с блоком „Часто задаваемые вопросы“, как будто просто вкинули
 * блок»): рамка и скругление у врезки сняты, края растворяются масками,
 * сверху добавлена волосяная линия FAQ, слева — синяя нить раскрытого
 * вопроса, имя набрано как вопрос. Правду про боевую смотреть там.
 */
function V2Inset() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      {/* Врезка объявлена до текста: обтекание работает только если элемент
          с float стоит в потоке раньше обтекающего текста. */}
      <figure className="float-right mb-3 ml-4 w-[38%] overflow-hidden rounded-[14px] border border-white/12">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="aspect-[150/172] w-full select-none object-cover object-[70%_38%]"
        />
      </figure>

      <blockquote className="text-[16px] leading-[1.56] text-white/88">
        <span
          aria-hidden="true"
          style={{ ...BEBAS, color: ACCENT }}
          className="float-left mr-2 mt-[3px] text-[46px] leading-[.68]"
        >
          «
        </span>
        {QUOTE.text}
      </blockquote>

      {/* Линейка byline. clear-both закрывает обтекание: без него подпись
          заезжает под врезку, если текст кончился раньше её. */}
      <div className="clear-both mt-6 flex items-baseline justify-between gap-3 border-t border-white/12 pt-3">
        <span style={BEBAS} className="text-[17px] uppercase leading-none tracking-[1px] text-white">
          {QUOTE.author}
        </span>
        <span className="shrink-0 text-[10px] uppercase leading-none tracking-[.2em] text-white/45">
          {QUOTE.role}
        </span>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   03. Финальный кадр
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Кадр во весь блок и лицо крупно, цитата — титром по низу.
 *
 * Отличие от всех прошлых подач в том, что фотография здесь не делит место
 * с текстом: она занимает блок целиком, а текст лежит на её нижней трети,
 * где плотный градиент. Так заканчивают фильм — кадр и титр, — и для
 * последней секции страницы это честнее, чем ещё один блок с колонками.
 *
 * Кадрирование по лицу: отношение 430/560 заставляет широкую полосу
 * покрывать бокс по высоте, масштаб 1.096, голова выходит 142px — крупнее,
 * чем в любой другой подаче. Якорь 75% ставит лицо на 55% ширины, то есть
 * чуть правее центра, а взгляд оказывается направлен в текст.
 *
 * Градиент под текстом плотный (0.92 у самого низа): по чеклисту
 * доступности белый текст на фотографии обязан держать 4.5:1 в худшей
 * точке, а худшая точка здесь — светлая кромка газона.
 */
function V3FinalFrame() {
  return (
    <section aria-label="Цитата автора обучения" className="relative -mx-5 grid overflow-hidden">
      <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[430/560]" />

      <div className="pointer-events-none absolute inset-0">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[75%_50%]"
        />
        {/* Верх стыкует блок с секцией над ним, низ держит текст. */}
        <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.5)_58%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,transparent_0%,rgba(5,8,11,.72)_38%,rgba(5,8,11,.92)_70%,#05080b_100%)]" />
      </div>

      <div className="relative col-start-1 row-start-1 flex flex-col justify-end px-5 pb-9 pt-12">
        <figure>
          <span
            aria-hidden="true"
            style={{ ...BEBAS, color: ACCENT }}
            className="block text-[40px] leading-[.6] opacity-35"
          >
            «
          </span>
          <blockquote className="mt-3 text-[16px] leading-[1.5] text-white/90">{QUOTE.text}</blockquote>
          <figcaption className="mt-5 flex items-baseline gap-3">
            <span style={BEBAS} className="text-[17px] uppercase leading-none tracking-[1px] text-white">
              {QUOTE.author}
            </span>
            <span className="text-[10px] uppercase leading-none tracking-[.2em] text-white/45">{QUOTE.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Кадр фоном секции
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Кадр — фон всего блока, а не картинка внутри него. Геометрию «слева текст,
 * справа ГМ» держит сам снимок: на `coach-band.webp` левая половина — тёмные
 * трибуны, фигура стоит в правой. Ни колонок, ни рамок нет вовсе.
 *
 * ── Высота задана отношением, а не пикселями ─────────────────────────────
 * `aspect-[430/420]`: на проектной ширине это те же 420px, но на 360 блок
 * сам становится 352px высотой. Так и надо. Кадр покрывает бокс по высоте,
 * поэтому при фиксированной высоте на узком экране он зумится: замер на 360
 * с высотой 420 — фигура вырастает, лицо съезжает влево и текст упирается в
 * очки. Ровно эта грабля описана в «Авторе обучения»: там снимок-подложку
 * пришлось масштабировать по ширине экрана, а не по высоте секции.
 * Отношение решает то же самое, но без медиазапроса: окно кадра в исходнике
 * получается одинаковым (522px на 360 против 523 на 430), то есть
 * композиция на обеих ширинах одна и та же, просто мельче.
 *
 * Высота 420 на 430 выбрана под фигуру: масштаб 0.822, голова 107px — вдвое
 * крупнее, чем полосой во всю ширину (51px), и заметно крупнее, чем колонкой
 * (76px). Ниже 300 фигура мельчает, выше 480 блок занимает весь экран
 * телефона. Отношение — не жёсткая высота: если цитата не влезет, блок
 * вырастет, а не обрежет текст.
 *
 * ── Якорь 67%, и это не «примерно» ───────────────────────────────────────
 * При масштабе 0.822 кадр рисуется шириной 904px, из которых в экран влезают
 * 430: за краями остаётся 474px, и якорь делит их между левым и правым
 * срезом. Центр фигуры лежит на 755-й колонке исходника; чтобы он встал на
 * 70% ширины экрана, слева надо срезать 290 отрисованных пикселей — это
 * 67%. На 360 та же доля даёт фигуру на 71%: разница в один процент, из-за
 * которой не нужен медиазапрос. С прежними 74% (первый заход) фигура стояла
 * на 63% и лезла под текст — за это подачу и отклонили.
 *
 * ── Три слоя поверх кадра ────────────────────────────────────────────────
 *   1. Шторка слева держит колонку текста: полная плотность до 52% ширины,
 *      отпускает к 78%, где начинается лицо. Без неё текст ложится на
 *      подсвеченную кромку газона;
 *   2. верхняя стыкует блок с секцией над ним;
 *   3. нижняя гасит кадр в тон страницы. Обе в пикселях, не в процентах:
 *      в процентах растворение на 360 и на 430 выходит разной толщины.
 *
 * Текст выключен по центру колонки по вертикали (`items-center`): фигура на
 * снимке центрирована по высоте, и текст, прижатый к верху, читался бы
 * съехавшим относительно неё.
 */
function V1Backdrop() {
  return (
    <section aria-label="Цитата автора обучения" className="relative -mx-5 grid overflow-hidden">
      {/* Распорка задаёт высоту блока отношением к его же ширине и ничего не
          рисует. Она и текст лежат в одной ячейке сетки, поэтому высота
          блока — это максимум из двух: кадр держит минимум, а если цитата
          не влезет (узкий экран, крупный системный шрифт), блок вырастет.
          С `aspect` прямо на секции текст обрезался бы: `overflow-hidden`
          нужен кадру, а высота из отношения содержимому не уступает. */}
      <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[430/420]" />

      <div className="pointer-events-none absolute inset-0">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[58%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.95)_0%,rgba(5,8,11,.9)_38%,rgba(5,8,11,.66)_52%,rgba(5,8,11,.2)_66%,transparent_78%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.55)_54%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#05080b_0%,rgba(5,8,11,.6)_52%,transparent_100%)]" />
      </div>

      <div className="relative col-start-1 row-start-1 flex items-center px-5 py-10">
        <div className="relative col-start-1 row-start-1 flex items-center px-5 py-9">
          <figure className="relative w-[58%]">
            <span
              aria-hidden="true"
              style={{ ...BEBAS, color: ACCENT }}
              className="block text-[38px] leading-[.6] opacity-30"
            >
              «
            </span>
            <blockquote className="mt-2.5 text-[15px] leading-[1.5] text-white/88">{QUOTE.text}</blockquote>
            <figcaption className="mt-5">
              <span
                aria-hidden="true"
                style={{ backgroundColor: ACCENT }}
                className="block h-px w-7 rounded-full"
              />
              <span
                style={BEBAS}
                className="mt-2.5 block text-[16px] uppercase leading-[1.05] tracking-[1px] text-white"
              >
                {QUOTE.author}
              </span>
              <span className="mt-1 block text-[11.5px] leading-none text-white/48">{QUOTE.role}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   02. Кадр фоном карточки
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Тот же кадр фоном, но у блока есть края: скруглённый бокс с волосяной
 * рамкой внутри полей секции. Это разное чтение одной просьбы — «фон блока»
 * может значить и фон полосы во всю ширину, и фон карточки.
 *
 * Что меняется вместе с краями:
 *   — растворять верх и низ больше не нужно, границу держит скругление.
 *     Остаётся только шторка под текст;
 *   — кадр сужается на два поля секции (40px), срез по бокам растёт, и
 *     якорь смещается до 64%, чтобы фигура осталась на том же месте
 *     относительно текста;
 *   — отношение своё: `aspect-[390/400]`, потому что ширина карточки на
 *     проектных 430 — это 390px, ширина секции минус поля;
 *   — блок читается предметом на странице, а не её фоном. Рядом с тарифами,
 *     где карточек три, это довод против; рядом с FAQ, где нет ни одной
 *     рамки, — довод за.
 */
function V2BackdropCard() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      <div className="relative grid overflow-hidden rounded-2xl border border-white/10">
        {/* Та же распорка, что в подаче 01: высота из отношения к ширине
            карточки, но текст, если не влезет, её растянет. */}
        <div aria-hidden="true" className="col-start-1 row-start-1 aspect-[390/400]" />

        <div className="pointer-events-none absolute inset-0">
          <img
            src={coachBand}
            alt=""
            aria-hidden="true"
            className="h-full w-full select-none object-cover object-[56%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.95)_0%,rgba(5,8,11,.9)_38%,rgba(5,8,11,.66)_52%,rgba(5,8,11,.2)_66%,transparent_78%)]" />
        </div>

        <figure className="relative w-[58%]">
          <span
            aria-hidden="true"
            style={{ ...BEBAS, color: ACCENT }}
            className="block text-[38px] leading-[.6] opacity-30"
          >
            «
          </span>
          <blockquote className="mt-2.5 text-[15px] leading-[1.5] text-white/88">{QUOTE.text}</blockquote>
          <figcaption className="mt-5">
            <span aria-hidden="true" style={{ backgroundColor: ACCENT }} className="block h-px w-7 rounded-full" />
            <span
              style={BEBAS}
              className="mt-2.5 block text-[16px] uppercase leading-[1.05] tracking-[1px] text-white"
            >
              {QUOTE.author}
            </span>
            <span className="mt-1 block text-[11.5px] leading-none text-white/48">{QUOTE.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Предыдущий заход: кадр колонкой рядом с текстом
   ───────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────
   Колонки, портрет в вылет
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Геометрия, которую попросил владелец: слева текст, справа ГМ. Две колонки
 * рядом, а не кадр с текстом поверх.
 *
 * ── Как из широкой полосы получается портрет ─────────────────────────────
 * `coach-band.webp` — полоса 1100×511, фигура в её правой половине. В
 * колонке 46% ширины (198px на 430) при высоте 300px кадр покрывает бокс по
 * высоте: масштаб 0.587, в окно попадает 337px исходника из 1100. Якорь по
 * горизонтали 77% ставит в это окно ровно фигуру — центр её примерно на 755-й
 * колонке исходника. Голова выходит 76px против 51px, которые дала бы полоса
 * во всю ширину: колонка кадру не мешает, а помогает — пустой левый угол
 * снимка срезается целиком.
 *
 * ── Почему портрет уходит в вылет и растворяется ─────────────────────────
 * Колонка стоит вплотную к правому краю экрана (`-mr-5` снимает поле
 * секции). Кадр с рамкой в этом месте читался бы вклеенной картинкой, а
 * растворение — приём, которым на этой странице живут снимки слайдов 2 и 3.
 * Маска двухслойная: по левому краю 44px, чтобы между текстом и снимком не
 * было вертикального шва, и по низу 90px — снимок гаснет в фон, а не
 * обрывается линией. Величины в пикселях, не в процентах: в процентах
 * растворение на 360 и на 430 получается разной толщины (грабля из HANDOFF).
 *
 * ── Как колонки держат друг друга ────────────────────────────────────────
 * Текст сверху, подпись — в самом низу колонки (`mt-auto`), поэтому имя
 * встаёт вровень с нижним краем портрета на обеих ширинах: цитата на 430
 * занимает девять строк, на 360 — одиннадцать, и прижимать подпись к тексту
 * значило бы ловить эту разницу вручную.
 */
function V1Columns() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      <div className="flex items-stretch gap-4">
        <figure className="flex min-w-0 flex-1 flex-col">
          <span
            aria-hidden="true"
            style={{ ...BEBAS, color: ACCENT }}
            className="block text-[38px] leading-[.6] opacity-30"
          >
            «
          </span>
          <blockquote className="mt-2.5 text-[15px] leading-[1.5] text-white/88">{QUOTE.text}</blockquote>
          <figcaption className="mt-auto pt-5">
            <span aria-hidden="true" style={{ backgroundColor: ACCENT }} className="block h-px w-7 rounded-full" />
            <span
              style={BEBAS}
              className="mt-2.5 block text-[16px] uppercase leading-[1.05] tracking-[1px] text-white"
            >
              {QUOTE.author}
            </span>
            <span className="mt-1 block text-[11.5px] leading-none text-white/48">{QUOTE.role}</span>
          </figcaption>
        </figure>

        {/* Портрет в вылет к правому краю экрана. Ширина в процентах, высота в
            пикселях: колонка должна сужаться вместе с экраном, а кадр —
            оставаться того же роста, иначе на 360 голова уезжает в 60px. */}
        <div
          className="relative -mr-5 h-[300px] w-[46%] shrink-0 self-start overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent_0,#000_44px),linear-gradient(180deg,#000_0,#000_calc(100%_-_90px),transparent_100%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(90deg,transparent_0,#000_44px),linear-gradient(180deg,#000_0,#000_calc(100%_-_90px),transparent_100%)]"
        >
          <img
            src={coachBand}
            alt=""
            aria-hidden="true"
            className="h-full w-full select-none object-cover object-[77%_50%]"
          />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   02. Колонки, портрет карточкой
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Та же геометрия — слева текст, справа ГМ, — но кадр не растворяется, а
 * стоит карточкой: скруглённый бокс со своими краями и волосяной рамкой.
 *
 * Разница не в украшении. В подаче 01 снимок — часть фона страницы, и
 * граница у него условная; здесь он предмет на странице, вставленный в
 * текст, как фотография в статье. Отсюда и подпись: имя стоит под самим
 * кадром, а не под цитатой, — портрет подписан, как подписывают снимок.
 *
 * Кадр не в вылет, а внутри полей секции: у карточки должно быть поле
 * справа, иначе рамка обрывается о край экрана. Из-за этого колонка уже
 * (42% против 46), и в окно попадает меньше исходника — голова 70px против
 * 76. Плата за то, чтобы у снимка были края.
 */
function V2ColumnsCard() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      <div className="flex items-start gap-4">
        <figure className="min-w-0 flex-1">
          <span
            aria-hidden="true"
            style={{ ...BEBAS, color: ACCENT }}
            className="block text-[38px] leading-[.6] opacity-30"
          >
            «
          </span>
          <blockquote className="mt-2.5 text-[15px] leading-[1.5] text-white/88">{QUOTE.text}</blockquote>
        </figure>

        <figure className="w-[42%] shrink-0">
          {/* Волосяная рамка, а не тень: тень на этой странице занята
              карточкой ПРЕМИУМА в тарифах. */}
          <div className="relative h-[280px] overflow-hidden rounded-xl border border-white/10">
            <img
              src={coachBand}
              alt=""
              aria-hidden="true"
              className="h-full w-full select-none object-cover object-[77%_50%]"
            />
          </div>
          <figcaption className="mt-3">
            <span style={BEBAS} className="block text-[15px] uppercase leading-[1.08] tracking-[1px] text-white">
              {QUOTE.author}
            </span>
            <span className="mt-1 block text-[11.5px] leading-[1.2] text-white/48">{QUOTE.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Отклонены владельцем 01.09 — оставлены для сравнения
   ───────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────
   Кадр и слова
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Полоса с портретом сверху, цитата под ней.
 *
 * Кадр показан крупно (300px высоты): при естественном отношении полосы
 * 1100×511 на 430px ширины она даёт 200px, и голова получается 51px — на
 * таком кадре человека не узнать. Поэтому полоса выше отношения, кадр
 * масштабируется по высоте и срезается по бокам с якорем 68% — уходит пустой
 * левый угол, фигура остаётся целиком.
 *
 * Текст не лежит на фотографии вовсе: цитата длинная (215 знаков), и колонка
 * рядом с фигурой была бы вдвое уже. Здесь у неё вся ширина экрана.
 */
function V1Band() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      {/* Полоса во всю ширину: боковые поля секции снимаются -mx-5. */}
      <div className="relative -mx-5 h-[300px] overflow-hidden">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[68%_50%]"
        />
        {/* Края растворяются в тон страницы: сверху стык с секцией выше,
            снизу кадр отдаёт место тексту. Цвет — #05080b, фон страницы. */}
        <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.55)_52%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#05080b_0%,rgba(5,8,11,.6)_54%,transparent_100%)]" />
      </div>

      <figure className="relative -mt-4">
        {/* Кавычка стоит отдельной строкой над цитатой, а не в её первой
            строке: в строке она сдвигала бы первую строку относительно
            остальных. Поверх кадра её тоже класть нельзя — на подсвеченном
            газоне синий знак читается царапиной. */}
        <span
          aria-hidden="true"
          style={{ ...BEBAS, color: ACCENT }}
          className="block text-[42px] leading-[.6] opacity-30"
        >
          «
        </span>
        <blockquote className="relative mt-3 text-[17px] leading-[1.52] text-white/88">{QUOTE.text}</blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <span aria-hidden="true" style={{ backgroundColor: ACCENT }} className="h-px w-7 rounded-full" />
          <span>
            <span style={BEBAS} className="block text-[17px] uppercase leading-[1.05] tracking-[1px] text-white">
              {QUOTE.author}
            </span>
            <span className="mt-0.5 block text-[12px] leading-none text-white/48">{QUOTE.role}</span>
          </span>
        </figcaption>
      </figure>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   02. Слова на кадре
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Кадр подложкой всей секции, текст в его левой тёмной части — приём слайда
 * 3 «Досье на поле», который владелец уже выбрал для «Автора обучения».
 *
 * Геометрия у полосы та же, что у кадра в полный рост: слева трибуны, фигура
 * в правой половине. Кадр растягивается по высоте секции с якорем 74%,
 * поверх — горизонтальная шторка под колонку текста.
 *
 * Плата очевидна: колонка 62% ширины, цитата в ней идёт вдвое большим числом
 * строк, и секция получается высокой. Зато цитата и лицо смотрят из одного
 * кадра — страница заканчивается тем же человеком, с которого началась.
 */
function V2Overlay() {
  return (
    <section
      aria-label="Цитата автора обучения"
      // Минимальная высота — не украшение. Кадр растягивается по высоте
      // секции: на 180px, которые задаёт один текст, полоса 1100×511
      // срезается по бокам вчетверо, фигура выезжает на середину экрана и
      // ложится ровно под цитату. На 400px срез вдвое меньше, и фигура
      // остаётся в правой части, как в файле.
      className="relative -mx-5 flex min-h-[400px] items-center overflow-hidden px-5 py-9"
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[74%_50%]"
        />
        {/* Шторка держит полную плотность до 58% ширины — это колонка текста
            — и отпускает к 86%, где лицо. Ровно так же сделано в слайде 3. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.94)_0%,rgba(5,8,11,.88)_44%,rgba(5,8,11,.6)_58%,rgba(5,8,11,.16)_73%,transparent_86%)]" />
        {/* Верх и низ уходят в тон страницы, чтобы секция не читалась
            вклеенной картинкой. */}
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.5)_58%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#05080b_0%,rgba(5,8,11,.6)_54%,transparent_100%)]" />
      </div>

      <figure className="relative w-[62%]">
        <span
          aria-hidden="true"
          style={{ ...BEBAS, color: ACCENT }}
          className="block text-[40px] leading-[.6] opacity-35"
        >
          «
        </span>
        <blockquote className="mt-3 text-[15px] leading-[1.5] text-white/88">{QUOTE.text}</blockquote>
        <figcaption className="mt-5">
          <span style={BEBAS} className="block text-[16px] uppercase leading-[1.05] tracking-[1px] text-white">
            {QUOTE.author}
          </span>
          <span className="mt-1 block text-[11.5px] leading-none text-white/48">{QUOTE.role}</span>
        </figcaption>
      </figure>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   03. Закрывающий кадр
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Обратный порядок: сначала слова, под ними кадр, который гаснет в подвал.
 *
 * Это единственная подача, которая работает концовкой страницы, а не ещё
 * одним блоком: последнее, что видит человек, — не текст и не кнопка, а
 * фигура, растворяющаяся в тёмном низу. Тарифы и вопросы остались выше,
 * дочитывать больше нечего.
 *
 * Текст выключен по центру — в двух других подачах он прижат влево, как всё
 * на странице; здесь центровка отделяет прямую речь от остального текста.
 * Цитата ради этого набрана крупнее (18px): по центру короткие строки
 * читаются хуже, и кегль это компенсирует.
 */
function V3Closing() {
  return (
    <section aria-label="Цитата автора обучения" className="relative">
      <figure className="relative text-center">
        <span
          aria-hidden="true"
          style={{ ...BEBAS, color: ACCENT }}
          className="block text-[46px] leading-[.62] opacity-30"
        >
          «
        </span>
        <blockquote className="mt-4 text-[18px] leading-[1.48] text-white/90">{QUOTE.text}</blockquote>
        <figcaption className="mt-6">
          <span
            aria-hidden="true"
            style={{ backgroundImage: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }}
            className="mx-auto block h-px w-16"
          />
          <span style={BEBAS} className="mt-4 block text-[18px] uppercase leading-[1.05] tracking-[1px] text-white">
            {QUOTE.author}
          </span>
          <span className="mt-1 block text-[12px] leading-none text-white/48">{QUOTE.role}</span>
        </figcaption>
      </figure>

      {/* Кадр закрывает страницу: верх растворяется, низ гаснет в подвал.
          Полоса ниже, чем в подаче 01 (320px): она здесь последняя, и её
          нижняя треть уходит в темноту почти целиком. */}
      <div className="relative -mx-5 mt-8 h-[320px] overflow-hidden">
        <img
          src={coachBand}
          alt=""
          aria-hidden="true"
          className="h-full w-full select-none object-cover object-[68%_46%]"
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#05080b_0%,rgba(5,8,11,.6)_52%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#05080b_0%,rgba(5,8,11,.72)_46%,transparent_100%)]" />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Оболочка макетной
   ───────────────────────────────────────────────────────────────────────── */

export function QuoteLayouts() {
  return (
    <div className="min-h-screen bg-[#12171f] px-5 py-12 text-white">
      <header className="mx-auto mb-10 max-w-[1500px] border-b border-white/12 pb-7">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.02em]">
          Финальная цитата — третий заход, три разных блока
        </h1>
        <p className="mt-3 max-w-[80ch] text-[14px] leading-relaxed text-white/58">
          Прошлые два захода спорили об одном и том же: где стоит фотография относительно колонки
          текста. Здесь три разных ответа на вопрос, чем вообще является эта секция. Направление
          сверено со скиллом ui-ux-pro-max: стиль{' '}
          <code className="text-white/75">editorial-grid-magazine</code> (буквицы, врезки с
          обтеканием, печатные линейки вместо рамок) и приём «type as hero» из пары Bold Typography
          Mobile — крупный display-кегль для прямой речи, мелкая метка для подписи.
        </p>
        <p className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-white/40">
          Текст и кадр прежние и неприкосновенные: цитата с gadjiev.pro дословно,{' '}
          <code className="text-white/60">coach-band.webp</code>. В подаче 01 цитата разрезана по
          первой фразе — слова не тронуты, склейка посимвольно равна оригиналу. Контраст текста по
          кадру держится выше 4.5:1 (чеклист доступности), кадр везде декоративный, высоты заданы
          отношением к ширине блока, а не пикселями. Каждая подача на 430&nbsp;px и на 360&nbsp;px;
          рамки — это блоки, а не окно браузера.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-10">
        <Frame
          n="01"
          name="Манифест"
          why="Цитата перестаёт быть абзацем и становится главным шрифтом секции. Первая фраза набрана Bebas той же заливкой, что заголовки секций, — на этой странице так выглядит только заголовок, поэтому фраза читается заявлением. Остаток цитаты идёт обычным Onest под ней: 215 знаков капслоком набирать нельзя, длинный верхний регистр читается вдвое медленнее. Кадр здесь атмосфера, а не иллюстрация: приглушён до 0.55 и накрыт синим пятном акцента, фигура узнаётся, но не спорит с текстом. Плата: лица почти не видно — если секция задумана как «ещё раз показать ГМ», это не она."
          tags={['type as hero', 'кадр приглушён', 'первая фраза крупно']}
        >
          <V1Manifesto />
        </Frame>

        <Frame
          n="02"
          name="Врезка с обтеканием"
          why="Журнальный приём: снимок врезан в текст, и текст его обтекает. Этим снимается то, обо что спотыкались оба прошлых захода, — узкая колонка на всю высоту блока: узкими остаются только первые четыре строки, дальше цитата идёт во всю ширину. Кавычка работает буквицей, подпись стоит на печатной линейке — слева имя, справа роль разрядкой. Единственная подача, где нет ни одного пикселя текста поверх фотографии, то есть читаемость не зависит от того, что на кадре. Плата: обтекание — приём из статьи, а не из лендинга, и рядом с крупными секциями выше блок выглядит скромно."
          tags={['обтекание', 'буквица', 'текст не на фото']}
        >
          <V2Inset />
        </Frame>

        <Frame
          n="03"
          name="Финальный кадр"
          why="Фотография занимает блок целиком, лицо крупно (голова 142px — крупнее, чем в любой другой подаче), цитата лежит титром по низу, на плотном градиенте. Так заканчивают фильм: кадр и титр. Для последней секции страницы это честнее, чем ещё один блок с колонками, — дочитывать дальше нечего, и последнее, что видит человек, это взгляд ГМ. Якорь 75% ставит лицо чуть правее центра, взгляд направлен в текст. Плата: блок высокий (560px на 430), почти экран телефона, и весь текст лежит на фотографии."
          tags={['лицо крупно', 'титр по низу', 'высокий блок']}
        >
          <V3FinalFrame />
        </Frame>
      </div>

      <div className="mx-auto mt-14 max-w-[1500px] border-t border-white/12 pt-8">
        <h2 className="text-[20px] font-bold leading-none text-white/70">Предыдущие заходы</h2>
        <p className="mt-3 max-w-[80ch] text-[13px] leading-relaxed text-white/40">
          Второй заход — кадр фоном блока, во всю ширину и карточкой. До него — кадр колонкой рядом
          с текстом. Первый — текст и снимок друг над другом. Все отклонены владельцем, оставлены
          для сравнения, как отклонённые подачи FAQ на{' '}
          <code className="text-white/60">/faq.html</code>.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1500px] flex-col gap-10 opacity-60">
        <Frame
          n="—"
          name="Кадр фоном секции"
          why="Снимок фоном всей секции во всю ширину, текст в его левой тёмной части, края растворяются сверху и снизу. Высота задана отношением 430/420, чтобы кадр не зумился на узком экране."
          tags={['фон секции', 'голова 107px']}
        >
          <V1Backdrop />
        </Frame>

        <Frame
          n="—"
          name="Кадр фоном карточки"
          why="То же самое, но у блока есть края: скруглённый бокс с волосяной рамкой внутри полей секции."
          tags={['фон карточки', 'края и скругление']}
        >
          <V2BackdropCard />
        </Frame>

        <Frame
          n="—"
          name="Портрет в вылет (кадр колонкой)"
          why="Колонка с портретом вплотную к правому краю экрана, растворение масками: слева 44px, снизу 90px. Подпись прижата к низу текстовой колонки и встаёт вровень с нижним краем портрета. Отклонено вместе со вторым заходом: кадр здесь вставка рядом с текстом, а не фон блока."
          tags={['кадр колонкой', 'голова 76px']}
        >
          <V1Columns />
        </Frame>

        <Frame
          n="—"
          name="Портрет карточкой (кадр колонкой)"
          why="Та же колонка, но со своими краями и рамкой, подпись под самим кадром — снимок подписан, как фотография в статье. Колонка из-за поля справа уже (42% против 46), голова 70px против 76."
          tags={['кадр колонкой', 'подпись под кадром']}
        >
          <V2ColumnsCard />
        </Frame>

        <Frame
          n="—"
          name="Кадр и слова"
          why="Полоса с портретом сверху, цитата под ней во всю ширину экрана. Текст не лежит на фотографии вовсе — цитата в 215 знаков получает всю колонку и читается как обычный абзац страницы. Кадр показан крупно (300px): при естественном отношении полосы он дал бы 200px и голову в 51px, поэтому кадр масштабируется по высоте и срезается по бокам, уходит пустой левый угол. Плата: секция читается спокойным блоком, а не концовкой — после неё ждёшь, что страница продолжится."
          tags={['портрет крупно', 'текст во всю ширину', 'спокойно']}
        >
          <V1Band />
        </Frame>

        <Frame
          n="—"
          name="Слова на кадре"
          why="Приём слайда 3 «Досье на поле», который владелец уже выбрал для «Автора обучения»: кадр лежит подложкой всей секции, текст — в его левой тёмной части, шторка держит колонку. Цитата и лицо оказываются в одном кадре, страница заканчивается тем же человеком, с которого началась. Плата: колонка 62% ширины, и цитата идёт в ней вдвое большим числом строк — самая высокая из трёх подач. И это второе «досье» подряд по типу композиции, хотя между ними лежат четыре секции."
          tags={['подложкой', 'приём слайда 3', 'самая высокая']}
        >
          <V2Overlay />
        </Frame>

        <Frame
          n="—"
          name="Закрывающий кадр"
          why="Обратный порядок: сначала слова по центру, под ними кадр, который гаснет в подвал. Единственная подача, которая работает концовкой страницы, а не ещё одним блоком, — последнее, что видит человек, это фигура, растворяющаяся в темноте. Текст выключен по центру: на всей остальной странице он прижат влево, и центровка отделяет прямую речь от прочего текста. Плата: центровка требует крупного кегля (18px), а секция вместе с кадром занимает почти экран."
          tags={['текст по центру', 'кадр в подвал', 'концовка страницы']}
        >
          <V3Closing />
        </Frame>
      </div>
    </div>
  )
}

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
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#05080b] px-5 py-8">{children}</div>
    </div>
  )
}
