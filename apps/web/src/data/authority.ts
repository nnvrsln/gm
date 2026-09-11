import dyukov from '../assets/authority-dyukov.webp'
import simonyan from '../assets/authority-simonyan.webp'
import berdyev from '../assets/authority-berdyev.webp'
import gazzaev from '../assets/authority-gazzaev.webp'

export type AuthorityQuote = {
  quote: string
  name: string
  photo: string
  photoSource: string
  photoAuthor: string
  role: string
}
export const AUTHORITY_TITLE = 'Признание коллег'
export const AUTHORITY_QUOTES: AuthorityQuote[] = [
  {
    quote:
      'Имя Гаджи Гаджиева хорошо известно и в научных кругах, а его разработки и методики серьёзно повлияли на развитие футбола в нашей стране. Во многом благодаря Гаджи Муслимовичу на футбольную карту России вернулось махачкалинское «Динамо», под его руководством стремительно поднявшееся в элитный дивизион.',
    name: 'Александр Дюков',
    photo: dyukov,
    photoSource: 'https://commons.wikimedia.org/wiki/File:Alexander_Valeryevich_Dyukov_(2018).jpg',
    photoAuthor: 'Gazprom Neft',
    role: 'президент Российского футбольного союза',
  },
  {
    quote:
      'Деятельность Гаджи Муслимовича невозможно оценивать только результатами матчей. Он — один из тех редких людей, кто соединяет в себе науку и практику, опыт и мудрость, кто хранит традиции футбола и передает их будущему.',
    name: 'Никита Симонян',
    photo: simonyan,
    photoSource: 'https://commons.wikimedia.org/wiki/File:Nikita_Simonyan_2017.jpg',
    photoAuthor: 'Кирилл Венедиктов',
    role: 'легендарный советский футболист, тренер и спортивный функционер',
  },
  {
    quote:
      'Гаджи Муслимовича от большинства российских тренеров всегда отличало глубокое знание предмета, а в плане физической подготовки команд он является, пожалуй, лучшим тренером в России.',
    name: 'Курбан Бердыев',
    photo: berdyev,
    photoSource: 'https://commons.wikimedia.org/wiki/File:Kurban_Berdyev_2018.jpg',
    photoAuthor: 'Светлана Бекетова',
    role: 'двукратный чемпион России, обладатель Кубка и Суперкубка страны',
  },
  {
    quote:
      'Гаджи Муслимович — это целая эпоха в истории отечественного футбола! Много лет он входил в тренерский штаб сборных команд СССР и России. Огромная заслуга Гаджиева в победе нашей сборной на олимпиаде 1988 года в Сеуле. Где бы не работал Гаджи, его команды всегда отличали высокая организация, отменная физическая готовность, тактическая выучка, командный дух и характер.',
    name: 'Валерий Газзаев',
    photo: gazzaev,
    photoSource: 'https://commons.wikimedia.org/wiki/File:Valery_Gazzaev_2019.jpg',
    photoAuthor: 'Антон Зайцев',
    role: 'многократный чемпион и обладатель кубка России и кубка УЕФА',
  },
]

