import {
  RESERVE_AMOUNT,
  TARIFF_NAMES,
  TARIFF_ORDER,
  TARIFF_PRICES,
} from '../../../../packages/shared/src/pricing'
import { FAQ } from '../data/faq'

const COURSE_START = '2026-11-01'

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

export function jsonLdScripts(siteUrl: string) {
  return buildJsonLd(siteUrl)
    .map(
      (block) =>
        '    <script type="application/ld+json">' +
        JSON.stringify(block).replace(/</g, '\\u003c') +
        '</script>',
    )
    .join('\n')
}

export const RESERVE_PRICE = RESERVE_AMOUNT
