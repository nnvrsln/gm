// Цены берутся прямым путём к файлу, а не через '@gm/shared'. Источник тот
// же самый — правило «цены живут в одном месте» не нарушено, — но этот
// модуль подключает `vite.config.ts`, а конфиг грузит Node, и он не умеет
// резолвить реэкспорты воркспейс-пакета без расширений. С прямым путём
// модуль бандлит esbuild, и сборка конфига не падает.
import {
  RESERVE_AMOUNT,
  TARIFF_NAMES,
  TARIFF_ORDER,
  TARIFF_PRICES,
} from '../../../../packages/shared/src/pricing'
import { FAQ } from '../data/faq'

/**
 * Микроразметка Schema.org для страницы курса.
 *
 * ── Почему это собирается кодом, а не лежит в index.html руками ──────────
 * В разметке те же цены, те же вопросы FAQ и те же тарифы, что на странице.
 * Если написать их второй раз в HTML, они разъедутся при первой же правке
 * заказчика — а он правит тексты регулярно. Здесь всё берётся из тех же
 * модулей, что кормят саму страницу: `@gm/shared` для цен и `data/faq.ts`
 * для вопросов.
 *
 * ── Почему в HTML, а не в React ──────────────────────────────────────────
 * Страница — SPA, содержимое рисует JS. Google исполняет JS, но не все
 * роботы это делают, и разметка, вставленная React'ом, для части из них
 * невидима. Поэтому результат этой функции подставляется в `index.html` на
 * этапе сборки — плагином в `vite.config.ts`. В исходном HTML разметка
 * лежит уже готовой.
 *
 * ── Что размечено ────────────────────────────────────────────────────────
 * `Course` — сам курс с ценами трёх тарифов;
 * `Person` — Гаджиев как автор, с регалиями из слайда 3;
 * `FAQPage` — семь вопросов слайда 8. Именно она даёт расширенный сниппет в
 *   выдаче: вопросы раскрываются прямо в результатах поиска.
 *
 * ⚠️ `Organization` намеренно нет: у продавца пока нет реквизитов (Q24,
 * `SELLER` в `data/legal.ts` пуст), а размечать организацию без ИНН и
 * адреса — обещать поиску данные, которых нет.
 */

/** Дата старта из ответа 1 FAQ. Год не указан заказчиком — см. Q21. */
const COURSE_START = '2026-11-01'

/**
 * Название и описание. Собраны из дословных строк заказчика: имя академии
 * с первого экрана и продуктовое обещание оттуда же. Ничего не сочинено,
 * только сокращено до длины, которую показывает поиск.
 */
export const SITE_NAME = 'Онлайн-академия футбольных тренеров Гаджи Гаджиева'
export const SITE_DESCRIPTION =
  'Практическая система подготовки от Гаджиева Гаджи Муслимовича: управление нагрузкой, ' +
  'подбор упражнений, развитие индивидуального мастерства и моделирование игры. ' +
  'Старт 1 ноября, обучение два месяца.'

function courseOffers(siteUrl: string) {
  return TARIFF_ORDER.map((id) => ({
    '@type': 'Offer',
    name: TARIFF_NAMES[id],
    price: TARIFF_PRICES[id],
    priceCurrency: 'RUB',
    category: 'Paid',
    url: `${siteUrl}/#tariffs`,
    availability: 'https://schema.org/PreOrder',
  }))
}

export function buildJsonLd(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: base + '/',
    inLanguage: 'ru',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: base + '/',
    },
    // Автор курса. Регалии — дословно из слайда 3, они же в data/achievements.ts.
    author: {
      '@type': 'Person',
      name: 'Гаджиев Гаджи Муслимович',
      jobTitle: 'Футбольный тренер, кандидат педагогических наук',
      url: base + '/#coach',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'P2M',
      startDate: COURSE_START,
      inLanguage: 'ru',
    },
    offers: courseOffers(base),
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return [course, faq]
}

/** Готовые теги `<script>` для вставки в `<head>` при сборке. */
export function jsonLdScripts(siteUrl: string) {
  return buildJsonLd(siteUrl)
    .map(
      (block) =>
        '    <script type="application/ld+json">' +
        // Экранируем только то, чем можно закрыть <script> изнутри строки.
        JSON.stringify(block).replace(/</g, '\\u003c') +
        '</script>',
    )
    .join('\n')
}

/** Бронь показывается в разметке отдельно — это не тариф, а частичная оплата. */
export const RESERVE_PRICE = RESERVE_AMOUNT
