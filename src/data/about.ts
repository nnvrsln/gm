import type { ComponentType, SVGProps } from 'react'
import { FootballIcon, GrowthIcon, SoccerFieldIcon } from '../components/icons'

export type AboutCard = {
  title: string
  detail: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const ABOUT_CARDS: AboutCard[] = [
  {
    title: 'Актуальная методология',
    detail: 'Современные подходы к тренировочному процессу и игре',
    icon: SoccerFieldIcon,
  },
  {
    title: 'Практика и реальные кейсы',
    detail: 'Разбор реальных матчей и ситуаций из опыта Гаджи Гаджиева',
    icon: FootballIcon,
  },
  {
    title: 'Системное развитие',
    detail: 'Пошаговое развитие тренерского мышления и компетенций',
    icon: GrowthIcon,
  },
]
