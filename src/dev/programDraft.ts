import analysisRender from '../assets/course-analysis.webp'
import casesRender from '../assets/course-cases.webp'
import equipmentRender from '../assets/course-equipment.webp'
import growthRender from '../assets/course-growth.webp'
import methodologyRender from '../assets/course-methodology.webp'
import progressRender from '../assets/course-progress.webp'

/**
 * Черновая программа курса — только для макетной `/program.html`.
 *
 * Это прежнее содержимое `src/data/program.ts`: шесть модулей, написанных по
 * логике тренерского курса, а не со слов Гаджиева. 31.08 боевые данные
 * заменены дословными текстами ТЗ (слайд 4), а черновик оставлен здесь,
 * чтобы страница с десятью раскладками продолжала открываться и собираться.
 * Ни на что в проде он не влияет: Vite собирает один index.html.
 *
 * Новых раскладок на нём не примеряем — если понадобится, страницу надо
 * переводить на настоящие данные из `src/data/program.ts`.
 */
export type DraftLesson = {
  index: string
  title: string
  duration: string
  kind?: 'Практика' | 'Разбор матча' | 'Шаблон'
}

export type DraftModule = {
  num: string
  title: string
  summary: string
  lessons: DraftLesson[]
  duration: string
  image: string
  cover?: string
}

export const PROGRAM_DRAFT: DraftModule[] = [
  {
    num: '01',
    title: 'Философия игры',
    summary: 'Во что играет команда и почему именно так',
    duration: '1 ч 12 мин',
    image: methodologyRender,
    lessons: [
      { index: '1.1', title: 'Зачем тренеру своя модель игры', duration: '11 мин' },
      { index: '1.2', title: 'Четыре фазы игры и принципы в каждой', duration: '16 мин' },
      { index: '1.3', title: 'Как модель определяет требования к игрокам', duration: '14 мин' },
      { index: '1.4', title: 'Разбор: модель игры «Анжи» образца 2012 года', duration: '18 мин', kind: 'Разбор матча' },
      { index: '1.5', title: 'Формулируем свою модель', duration: '13 мин', kind: 'Практика' },
    ],
  },
  {
    num: '02',
    title: 'Планирование сезона',
    summary: 'Периодизация: от годового цикла до тренировочной недели',
    duration: '1 ч 34 мин',
    image: growthRender,
    lessons: [
      { index: '2.1', title: 'Годовой цикл и точки контроля формы', duration: '15 мин' },
      { index: '2.2', title: 'Предсезонка: что успеть и чем пожертвовать', duration: '17 мин' },
      { index: '2.3', title: 'Микроцикл под календарь матчей', duration: '19 мин' },
      { index: '2.4', title: 'Нагрузка и восстановление в реальном расписании', duration: '16 мин' },
      { index: '2.5', title: 'Две игры в неделю: как перестроить план', duration: '14 мин' },
      { index: '2.6', title: 'Шаблон недельного плана', duration: '13 мин', kind: 'Шаблон' },
    ],
  },
  {
    num: '03',
    title: 'Тренировка',
    summary: 'Занятие, которое переносится в игру, а не остаётся упражнением',
    duration: '2 ч 04 мин',
    image: equipmentRender,
    lessons: [
      { index: '3.1', title: 'Задача занятия вместо набора упражнений', duration: '14 мин' },
      { index: '3.2', title: 'Как собрать упражнение под принцип игры', duration: '18 мин' },
      { index: '3.3', title: 'Размер площадки, число игроков, правила', duration: '16 мин' },
      { index: '3.4', title: 'Управление интенсивностью внутри занятия', duration: '17 мин' },
      { index: '3.5', title: 'Что и как говорить по ходу упражнения', duration: '15 мин' },
      { index: '3.6', title: 'Работа с юношами: чем отличается', duration: '16 мин' },
      { index: '3.7', title: 'Собираем занятие с нуля', duration: '28 мин', kind: 'Практика' },
    ],
  },
  {
    num: '04',
    title: 'Управление матчем',
    summary: 'Решения до игры, в перерыве и по ходу',
    duration: '1 ч 21 мин',
    image: casesRender,
    lessons: [
      { index: '4.1', title: 'Установка, которую команда запомнит', duration: '15 мин' },
      { index: '4.2', title: 'Что читать в первые двадцать минут', duration: '17 мин' },
      { index: '4.3', title: 'Перерыв: три сообщения, не тридцать', duration: '13 мин' },
      { index: '4.4', title: 'Замены: момент важнее фамилии', duration: '16 мин' },
      { index: '4.5', title: 'Разбор: как перевернуть проигранный тайм', duration: '20 мин', kind: 'Разбор матча' },
    ],
  },
  {
    num: '05',
    title: 'Разбор и аналитика',
    summary: 'Видео и данные как рабочий инструмент, а не отчёт',
    duration: '1 ч 47 мин',
    image: analysisRender,
    lessons: [
      { index: '5.1', title: 'Что смотреть в записи и в каком порядке', duration: '16 мин' },
      { index: '5.2', title: 'Показатели, которые влияют на решения', duration: '18 мин' },
      { index: '5.3', title: 'Разведка соперника за два дня', duration: '15 мин' },
      { index: '5.4', title: 'Разбор с командой: не превращаем в лекцию', duration: '14 мин' },
      { index: '5.5', title: 'Индивидуальный разбор с игроком', duration: '16 мин' },
      { index: '5.6', title: 'Собираем нарезку эпизодов', duration: '28 мин', kind: 'Практика' },
    ],
  },
  {
    num: '06',
    title: 'Команда и люди',
    summary: 'Группа, конфликты, доверие и работа со штабом',
    duration: '1 ч 29 мин',
    image: progressRender,
    lessons: [
      { index: '6.1', title: 'Роли в раздевалке и как их видеть', duration: '17 мин' },
      { index: '6.2', title: 'Разговор с игроком, который не играет', duration: '15 мин' },
      { index: '6.3', title: 'Конфликт: гасить или использовать', duration: '16 мин' },
      { index: '6.4', title: 'Штаб: что делегировать, что оставить себе', duration: '14 мин' },
      { index: '6.5', title: 'Отношения с руководством клуба', duration: '13 мин' },
      { index: '6.6', title: 'Разговор перед решающим матчем', duration: '14 мин', kind: 'Практика' },
    ],
  },
]
