import type { ComponentType, SVGProps } from 'react'
import {
  CertificateIcon,
  ConstructorIcon,
  FeedbackIcon,
  LockedChatIcon,
  PlatformIcon,
  PortfolioIcon,
  ReviewIcon,
  ScoutIcon,
  SoccerFieldIcon,
  TeamIcon,
} from '../components/icons'

export type LearningItem = {
  key: string
  title: string
  text: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  partner?: boolean
}

export const LEARNING_ITEMS: LearningItem[] = [
  {
    key: 'platform',
    title: 'Онлайн-платформа',
    text: 'уроки в записи на удобной образовательной платформе в доступе 24/7',
    icon: PlatformIcon,
  },
  {
    key: 'feedback',
    title: 'Обратная связь',
    text: 'качественная и развёрнутая обратная связь в чатах и при проверке домашних заданий',
    icon: FeedbackIcon,
  },
  {
    key: 'practice',
    title: 'Практика',
    text: 'вы сразу будете переносить полученные знания на поле и проверите их в работе со своей командой',
    icon: SoccerFieldIcon,
  },
  {
    key: 'team',
    title: 'Команда',
    text: 'с вами будут работать профессионалы с подтверждёнными результатами в футболе',
    icon: TeamIcon,
  },
  {
    key: 'nanofootball',
    title: 'NANOFOOTBALL',
    text: 'получите бесплатный доступ к цифровой среде для планирования тренировочного процесса с упражнениями, видео, анимацией, конструктором тренировок, календарём и статистикой',
    icon: ConstructorIcon,
    partner: true,
  },
  {
    key: 'scoutway',
    title: 'SCOUTWAY',
    text: 'получите бесплатный доступ к платформе для футбольных скаутов и спортивных клубов, которая предназначена для поиска, анализа и управления информацией об игроках',
    icon: ScoutIcon,
    partner: true,
  },
  {
    key: 'reviews',
    title: 'Разборы тренировок',
    text: 'каждая группа вместе с Гаджи Муслимовичем будет анализировать, насколько удалось выполнить поставленную цель, какой результат получить, а также разбирать отдельные упражнения',
    icon: ReviewIcon,
  },
  {
    key: 'certificate',
    title: 'Сертификат',
    text: 'каждый участник получит именной сертификат, подтверждающий прохождение программы и освоение методов футбольной подготовки',
    icon: CertificateIcon,
  },
  {
    key: 'portfolio',
    title: 'Тренерское портфолио',
    text: 'к концу обучения у вас будет готовое тренерское портфолио, которое можно использовать при трудоустройстве, общении с руководителями клубов и презентации собственной методики',
    icon: PortfolioIcon,
  },
  {
    key: 'community',
    title: 'Закрытое тренерское сообщество',
    text: 'каждый участник получит доступ в закрытый канал для футбольных тренеров, где можно задавать вопросы, обсуждать игровые и тренировочные ситуации, делиться опытом и вместе с коллегами находить практические решения даже после завершения обучения',
    icon: LockedChatIcon,
  },
]

export function learningItem(key: string): LearningItem {
  const found = LEARNING_ITEMS.find((item) => item.key === key)
  if (!found) throw new Error(`Нет пункта обучения с ключом «${key}»`)
  return found
}

export function pickLearning(...keys: string[]): LearningItem[] {
  return keys.map(learningItem)
}

export const LEARNING_TZ_SCREENS: LearningItem[][] = [
  pickLearning('platform', 'feedback', 'practice'),
  pickLearning('team'),
  pickLearning('nanofootball', 'scoutway', 'reviews'),
  pickLearning('certificate', 'portfolio', 'community'),
]

export type LearningCategory = {
  id: string
  label: string
  color: string
  keys: string[]
}

export const CATEGORIES: LearningCategory[] = [
  {
    id: 'process',
    label: 'Как проходит обучение',
    color: '#6AA0FF',
    keys: ['platform', 'team', 'feedback', 'practice', 'reviews'],
  },
  {
    id: 'free',
    label: 'Что получаете бесплатно',
    color: '#3FE0B0',
    keys: ['nanofootball', 'scoutway'],
  },
  {
    id: 'after',
    label: 'Что остаётся после',
    color: '#FFC14A',
    keys: ['certificate', 'portfolio', 'community'],
  },
]
