import { useRef, useState } from 'react'
import courseBg from '../assets/course-bg.webp'
import { AUDIENCE } from '../data/audience'
import { AudienceItem } from './AudienceItem'
import { ArrowRightIcon } from './icons'

/**
 * Слайд 2 ТЗ «Для кого?» целиком: заголовок на фотографии стадиона и лента
 * из четырёх сегментов-постеров под ним.
 *
 * Раньше слайд был разрезан на две секции: AboutSection несла обложку с
 * заголовком, эта — ленту. Обложка занимала 288px, из которых заголовок
 * съедал 48, а остальные 240 были пустым тёмным стадионом — на телефоне
 * почти треть экрана без единого слова. Теперь секция одна: снимок стадиона
 * лежит фоном всего блока и уходит под ленту, а не заканчивается пустой
 * полосой над ней. AboutSection осталась в репозитории, но со страницы
 * снята — как CoachSection и LeadSection.
 *
 * Почему лента, а не список. Четыре первых раскладки были вертикальными
 * списками, и все четыре владелец отверг. Здесь секция не растёт от числа
 * сегментов: сколько бы их ни было, блок занимает один экран.
 */
export function AudienceSection() {
  const track = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  // Шаг ленты меряется по самим карточкам, а не как scrollWidth / длина:
  // в scrollWidth входят поля px-5, и расчётный шаг выходил 281px против
  // настоящих 280 — к последней карточке ошибка набегала на два десятка
  // пикселей и точка перещёлкивалась не вовремя.
  const cardStep = () => {
    const el = track.current
    if (!el || el.children.length < 2) return 280
    const first = el.children[0].getBoundingClientRect().left
    const second = el.children[1].getBoundingClientRect().left
    return second - first
  }

  // Активная точка считается по позиции прокрутки, а не по нажатию: листают
  // и пальцем тоже, и индикатор должен идти за лентой, а не за состоянием
  // кнопки.
  const onScroll = () => {
    const el = track.current
    if (!el) return
    setActive(Math.min(AUDIENCE.length - 1, Math.round(el.scrollLeft / cardStep())))
  }

  // Прокрутка к карточке по нажатию. Целевая позиция считается от реального
  // положения карточки, а не умножением шага: так она встаёт к левому полю
  // ровно, без накопленной ошибки.
  const goTo = (index: number) => {
    const el = track.current
    const card = el?.children[index] as HTMLElement | undefined
    if (!el || !card) return
    // Индекс ставится сразу, не дожидаясь события прокрутки. Событие
    // приходит на следующем такте, и при быстрых нажатиях `active` отставал:
    // третий клик по «вперёд» считал текущей вторую карточку и никуда не
    // вёл. Замер: 0 → 280 → 560 → 560.
    setActive(index)
    const shift = card.getBoundingClientRect().left - el.getBoundingClientRect().left
    // Присваивание scrollLeft, а не scrollTo({behavior:'smooth'}).
    // Плавная прокрутка и snap-mandatory дерутся за ленту: анимация идёт
    // кадрами, прилипание на каждом кадре тянет назад к ближайшей точке, и
    // лента не уезжает дальше 15px. Замер: клик по «вперёд» давал scrollLeft
    // 15 вместо 280, три клика подряд — 0. Мгновенное присваивание встаёт
    // ровно и держится. Свайп пальцем анимируется сам и от этого не страдает.
    // 20px — поле px-5 у ленты: без него карточка встаёт впритык к краю.
    el.scrollLeft = el.scrollLeft + shift - 20
  }

  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      // z-10 обязателен: общий свет CourseBackdrop лежит слоем z-[3] поверх
      // потока, и его тональная база непрозрачна — без подъёма секция
      // оказывается под ней. Замер по пикселям кнопки, когда подъёма не
      // было: зелёный 151 вместо 176 и белый текст 199 вместо 244, весь блок
      // под синей вуалью. Так же и по той же причине сделано в «Программе» и
      // в «Авторе обучения».
      // Тон секции сплошной и не гаснет к низу. Пробовали погасить — стало
      // хуже: тональная база CourseBackdrop стартует ровно этим же #0c141d на
      // границе секций (см. комментарий там), то есть цвета стыкуются цвет в
      // цвет. Погасив тон, мы открыли под ним bg-pitch, и на границе появился
      // скачок 7 → 19, который до того был не виден вовсе.
      className="section-rhythm relative z-10 overflow-hidden bg-[#0c141d] px-5"
    >
      {/* Кадр прижат вправо и увеличен до 140%: так прожектор попадает в
          правый верх, а газон дотягивается до верхних карточек ленты. При
          430px это 602px ширины и 451px высоты — снимок кончается уже внутри
          ленты, и стадион виден в зазорах между постерами. Ради этого секцию
          и слили: раньше он обрезался высотой обложки на 288px.
          data-stadium читает CourseBackdrop — по высоте этого снимка он
          понимает, где кончается фотография и можно зажигать общий свет. */}
      <img
        src={courseBg}
        alt=""
        aria-hidden="true"
        data-stadium
        className="photo-sharp-up pointer-events-none absolute right-0 top-[-124px] z-0 w-[140%] max-w-none select-none brightness-[1.44] saturate-[1.14]"
      />
      {/* Размытая копия перехватывает верх: стадион проявляется из темноты
          сначала расфокусированным и только потом наводится на резкость. */}
      <img
        src={courseBg}
        alt=""
        aria-hidden="true"
        className="photo-blur-up pointer-events-none absolute right-0 top-[-124px] z-0 w-[140%] max-w-none select-none brightness-[1.44] saturate-[1.14]"
      />
      {/* Диагональная шторка. Плотность подобрана так, чтобы стадион
          читался: снимок поднят brightness 1.44, шторка держится на .74
          слева и почти отпускает кадр справа. Ниже опускаться нельзя —
          заголовок идёт прямо по каркасу ворот.
          Тон — почти нейтральный rgba(5,8,11), тот же, что в герое. Раньше
          здесь стоял rgba(0,18,29): в канале синего +29 против +11 в
          красном, и весь кадр уходил в бирюзу. По той же причине saturate
          держится низким (1.14): множитель тянул не зелень газона, а синеву
          в тенях трибун. */}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(100deg,rgba(5,8,11,.74)_0%,rgba(5,8,11,.26)_54%,rgba(5,8,11,.02)_100%)] [mask-image:linear-gradient(180deg,#000_0%,#000_32%,rgba(0,0,0,.34)_66%,rgba(0,0,0,.18)_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_32%,rgba(0,0,0,.34)_66%,rgba(0,0,0,.18)_100%)]" />

      {/* Стык с героем. Герой гаснет в чёрный снизу, секция проявляется из
          того же чёрного сверху — границы как таковой нет. Лежит под
          контентом (z-[2] против z-10), поэтому заголовок не притухает. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-20 bg-[linear-gradient(180deg,#000206_0%,rgba(0,2,6,.55)_42%,transparent_100%)]" />

      {/* Шторка под лентой: карточки начинаются на 80px, и к этой отметке
          снимок должен успеть сесть на тон секции — иначе постеры лежат на
          освещённом газоне и их собственные рамки теряются. Стопы в пикселях
          от верха, не в процентах: высота секции на узких экранах гуляет, а
          зона перехода должна стоять на месте. Маска по горизонтали
          отпускает шторку справа — нижний правый угол кадра с освещённым
          газоном единственное живое зелёное пятно, гасить его целиком
          нельзя.

          Книзу шторка отпускается обратно в прозрачность к 430px — там уже
          кончился снимок, гасить нечего. Раньше последний стоп стоял на
          180px, и ниже него шторка держала плотность .74 до самого низа
          секции: низ гас до (6,10,15) при собственном фоне (12,20,29), и на
          стыке с программой была видна ступенька. Пока общий свет лежал
          поверх секции, он её замазывал; после подъёма секции над слоем она
          вылезла. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,transparent_0px,transparent_40px,rgba(5,8,11,.28)_72px,rgba(5,8,11,.6)_112px,rgba(5,8,11,.74)_180px,rgba(5,8,11,.74)_300px,transparent_430px)] [mask-image:linear-gradient(90deg,#000_0%,#000_62%,rgba(0,0,0,.72)_88%,rgba(0,0,0,.55)_100%)] [-webkit-mask-image:linear-gradient(90deg,#000_0%,#000_62%,rgba(0,0,0,.72)_88%,rgba(0,0,0,.55)_100%)]" />

      <div className="relative z-10">
        {/* Заголовок лежит прямо на стадионе, отдельной обложки-полосы под
            ним больше нет. Раньше здесь стоял блок с min-h (188 → 136 → 88px),
            и отступ до ленты получался остаточным — 58px, число ниоткуда.
            Теперь высоту задаёт сам заголовок, а расстояние до карточек —
            обычный mt-6 у ленты, как в «Программе» перед списком модулей и
            как было в макетной /audience.html.

            ТЗ (docs/tz/01-SPEC.md, слайд 2): «Убираем "для кого этот курс?" и
            "этот курс для вас, если вы?", пишем просто: ДЛЯ КОГО?» — поэтому
            ни надзаголовка, ни второй строки. */}
        <h2 id="audience-title" className="section-title text-[32px] uppercase leading-[.94] tracking-title">
          Для кого?
        </h2>

        {/* -mx-5 выпускает ленту к краям экрана, px-5 возвращает поля первой
            и последней карточке. Прокрутка живёт внутри ленты — страница по
            горизонтали не едет, это обязательное условие проекта.
            tabIndex нужен по доступности: прокручиваемая область должна
            управляться и с клавиатуры, а не только пальцем. */}
        <ul
          ref={track}
          onScroll={onScroll}
          tabIndex={0}
          role="group"
          aria-label="Аудитории курса, листайте вбок"
          className="mt-6 -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-pl-5 px-5 pb-1 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#6AA0FF]/60 [&::-webkit-scrollbar]:hidden"
        >
          {AUDIENCE.map((card) => (
            <AudienceItem key={card.num} card={card} />
          ))}
        </ul>

        {/* Управление лентой. Раньше здесь стояли точки-`span` с
            aria-hidden: считалось, что листают только пальцем. На деле зона
            нажатия была 20×6px и не реагировала ни на что, а мышью
            горизонтальную прокрутку без shift+колеса не сдвинуть вовсе —
            лента выглядела мёртвой. Теперь и стрелки, и точки — настоящие
            кнопки с тач-целью 44px по app-чеклисту ui-ux-pro-max. */}
        <div className="mt-4 flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Предыдущая аудитория"
            className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
          >
            <ArrowRightIcon className="size-5 rotate-180" />
          </button>

          <div className="flex items-center gap-1">
            {AUDIENCE.map((card, index) => (
              <button
                key={card.num}
                type="button"
                onClick={() => goTo(index)}
                aria-label={card.title}
                aria-current={index === active}
                // Кнопка 44px по высоте и 24 по ширине, а видимая точка
                // внутри — отклик не двигает соседей, меняется только сама
                // точка.
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === active ? 'w-5 bg-[#6AA0FF]' : 'w-1.5 bg-white/25'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === AUDIENCE.length - 1}
            aria-label="Следующая аудитория"
            className="flex size-11 items-center justify-center rounded-full text-white/70 transition-opacity duration-150 active:opacity-60 disabled:opacity-25"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>

        {/* ТЗ: «Кнопку делаем одну, яркую: К ПРОГРАММЕ (по ней человека
            должно переносить на 4-ый слайд)». id="program" уже стоит на
            ProgramSection. Кнопка во всю ширину — соседа у неё нет.

            Подача — вариант 03 с макетной /buttons.html: газон с полосами от
            газонокосилки и линией штрафной (.btn-hero-turf) вместо плоского
            синего. Иконка на макетной была свистком, здесь стрелка: свисток
            говорит «запись в группу», а эта кнопка по ТЗ переносит на четвёртый
            слайд — направление, а не действие. */}
        <div className="mt-8 flex">
          <a href="#program" className="btn-hero btn-hero-turf w-full">
            К программе
            <ArrowRightIcon className="size-5 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  )
}
