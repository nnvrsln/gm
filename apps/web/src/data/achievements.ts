import achBest from '../assets/ach-best.webp'
import achCenter from '../assets/ach-center.webp'
import achOlympic from '../assets/ach-olympic.webp'
import achPhd from '../assets/ach-phd.webp'
import achRpl from '../assets/ach-rpl.webp'
import achUssr from '../assets/ach-ussr.webp'

export type Achievement = {
  title: string
  detail: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Тренер сборной СССР',
    detail: 'Работа с игроками ЦСКА, 1982–1984',
    icon: achUssr,
  },
  {
    title: 'Руководитель центра подготовки',
    detail: 'Сборных команд СССР, 1985–1986',
    icon: achCenter,
  },
  {
    title: 'Олимпийский чемпион',
    detail: 'Член тренерского штаба сборной СССР, Олимпиада-1988',
    icon: achOlympic,
  },
  {
    title: 'Главный тренер клубов РПЛ',
    detail: '«Анжи», «Крылья Советов», «Сатурн», «Волга», «Амкар»',
    icon: achRpl,
  },
  {
    title: 'Лучший тренер России',
    detail: 'Победитель премии в 2000 и 2007 годах',
    icon: achBest,
  },
  {
    title: 'Кандидат педагогических наук',
    detail: 'Теоретик и практик подготовки футболистов',
    icon: achPhd,
  },
]
