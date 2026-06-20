import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const categories = [
  { name: 'Конференции', slug: 'conferences', icon: 'Mic2', description: 'IT, бизнес и научные конференции' },
  { name: 'Концерты', slug: 'concerts', icon: 'Music', description: 'Музыкальные выступления и шоу' },
  { name: 'Свадьбы', slug: 'weddings', icon: 'Heart', description: 'Свадебные торжества и выставки' },
  { name: 'Корпоративы', slug: 'corporates', icon: 'Briefcase', description: 'Тимбилдинги и корпоративные мероприятия' },
  { name: 'Мастер-классы', slug: 'masterclasses', icon: 'Palette', description: 'Обучающие мастер-классы' },
  { name: 'Выставки', slug: 'exhibitions', icon: 'Frame', description: 'Выставки современного искусства' },
  { name: 'Спорт', slug: 'sport', icon: 'Trophy', description: 'Спортивные события' },
  { name: 'Образование', slug: 'education', icon: 'GraduationCap', description: 'Курсы, лекции, семинары' },
  { name: 'Фестивали', slug: 'festivals', icon: 'PartyPopper', description: 'Фестивали, ярмарки, городские праздники' },
]

const events = [
  {
    title: 'TechConf 2026',
    slug: 'techconf-2026',
    shortDescription: 'Крупнейшая IT-конференция года с топовыми спикерами',
    description: 'TechConf 2026 — это главное событие года для разработчиков, product-менеджеров и предпринимателей. На конференции выступят более 20 спикеров из ведущих технологических компаний. Программа включает доклады по AI, веб-разработке, DevOps и управлению продуктом.',
    startDate: '2026-03-15T10:00:00.000Z',
    endDate: '2026-03-15T18:00:00.000Z',
    city: 'Москва',
    venueName: 'Крокус Экспо',
    address: 'ул. Международная, 16',
    isOnline: false,
    isFree: false,
    categorySlug: 'conferences',
    maxAttendees: 500,
    ageRestriction: '18+',
    isFeatured: true,
    imageBaseName: 'techfuture-2026',
  },
  {
    title: 'Джазовый вечер',
    slug: 'jazz-evening',
    shortDescription: 'Живая джазовая музыка в уютной атмосфере',
    description: 'Вечер живой джазовой музыки с участием известных музыкантов. В программе: классический джаз, блюз и импровизации. Бар, уютная атмосфера и отличная компания.',
    startDate: '2026-03-20T19:00:00.000Z',
    endDate: '2026-03-20T22:00:00.000Z',
    city: 'Санкт-Петербург',
    venueName: 'Клуб "Космонавт"',
    address: 'ул. Бронницкая, 24',
    isOnline: false,
    isFree: false,
    categorySlug: 'concerts',
    maxAttendees: 300,
    ageRestriction: '18+',
    isFeatured: true,
    imageBaseName: 'jazz-evening-garden',
  },
  {
    title: 'Мастер-класс по керамике',
    slug: 'ceramics-masterclass',
    shortDescription: 'Создание керамики своими руками',
    description: 'Научитесь лепить из глины и создавать уникальные керамические изделия под руководством профессионального мастера. Все материалы включены. Вы заберёте домой готовую работу.',
    startDate: '2026-03-25T14:00:00.000Z',
    endDate: '2026-03-25T17:00:00.000Z',
    city: 'Москва',
    venueName: 'Студия "Глина"',
    address: 'ул. Мясницкая, 15',
    isOnline: false,
    isFree: false,
    categorySlug: 'masterclasses',
    maxAttendees: 20,
    ageRestriction: '12+',
    isFeatured: false,
    imageBaseName: 'pasta-making-masterclass',
  },
  {
    title: 'Корпоративный тимбилдинг',
    slug: 'teambuilding-corporate',
    shortDescription: 'Активности на свежем воздухе для команд',
    description: 'Проведите незабываемый день с командой на природе. Программа включает спортивные эстафеты, квесты, мастер-классы и банкет. Идеально для укрепления корпоративной культуры.',
    startDate: '2026-04-01T11:00:00.000Z',
    endDate: '2026-04-01T18:00:00.000Z',
    city: 'Подмосковье',
    venueName: 'База отдыха "Лесная"',
    address: 'Ленинградское шоссе, 45 км',
    isOnline: false,
    isFree: false,
    categorySlug: 'corporates',
    maxAttendees: 100,
    ageRestriction: '18+',
    isFeatured: false,
    imageBaseName: 'forest-teambuilding',
  },
  {
    title: 'Выставка современного искусства',
    slug: 'modern-art-exhibition',
    shortDescription: 'Работы современных художников',
    description: 'Большая выставка работ современных художников из России и зарубежья. В экспозиции: живопись, скульптура, инсталляции и цифровое искусство. Экскурсии каждый час.',
    startDate: '2026-04-05T10:00:00.000Z',
    endDate: '2026-04-05T20:00:00.000Z',
    city: 'Москва',
    venueName: 'Третьяковская галерея',
    address: 'Лаврушинский пер., 10',
    isOnline: false,
    isFree: false,
    categorySlug: 'exhibitions',
    maxAttendees: 1000,
    ageRestriction: '0+',
    isFeatured: true,
    imageBaseName: 'new-horizons-art-exhibition',
  },
  {
    title: 'Свадебная выставка "Love Story"',
    slug: 'wedding-exhibition',
    shortDescription: 'Всё для идеальной свадьбы',
    description: 'Крупнейшая выставка свадебных услуг: площадки, декор, фотографы, ведущие, кейтеринг. Специальные предложения от участников, розыгрыши призов и fashion show.',
    startDate: '2026-04-12T11:00:00.000Z',
    endDate: '2026-04-12T18:00:00.000Z',
    city: 'Санкт-Петербург',
    venueName: 'Экспофорум',
    address: 'Петербургское шоссе, 64/1',
    isOnline: false,
    isFree: false,
    categorySlug: 'weddings',
    maxAttendees: 800,
    ageRestriction: '0+',
    isFeatured: false,
    imageBaseName: 'wedding-expo-2026',
  },
  {
    title: 'Марафон "Забег весны"',
    slug: 'spring-marathon',
    shortDescription: 'Ежегодный городской полумарафон',
    description: 'Присоединяйтесь к главному весеннему забегу города. Дистанции: 5 км, 10 км и 21,1 км. Для всех возрастов и уровней подготовки. Медали всем финишёрам.',
    startDate: '2026-04-18T09:00:00.000Z',
    endDate: '2026-04-18T14:00:00.000Z',
    city: 'Москва',
    venueName: 'Парк Горького',
    address: 'Крымский вал, 9',
    isOnline: false,
    isFree: false,
    categorySlug: 'sport',
    maxAttendees: 2000,
    ageRestriction: '6+',
    isFeatured: true,
    imageBaseName: 'run-moscow-marathon',
  },
  {
    title: 'Онлайн-курс по AI',
    slug: 'ai-online-course',
    shortDescription: 'Практический курс по искусственному интеллекту',
    description: 'Интенсив по работе с нейросетями: от ChatGPT до генерации изображений. 4 занятия, домашние задания и сертификат по окончании.',
    startDate: '2026-04-22T18:00:00.000Z',
    endDate: '2026-04-22T20:00:00.000Z',
    city: 'Онлайн',
    venueName: 'Zoom',
    address: '',
    isOnline: true,
    onlineUrl: 'https://zoom.us/j/example',
    isFree: false,
    categorySlug: 'education',
    maxAttendees: 100,
    ageRestriction: '16+',
    isFeatured: false,
    imageBaseName: 'data-science-intensive',
  },
  {
    title: 'Бесплатная лекция о космосе',
    slug: 'space-lecture',
    shortDescription: 'Увлекательная лекция о Вселенной',
    description: 'Открытая лекция астрофизика о последних открытиях в изучении космоса. Подходит для всей семьи. Вход свободный по регистрации.',
    startDate: '2026-04-25T16:00:00.000Z',
    endDate: '2026-04-25T17:30:00.000Z',
    city: 'Москва',
    venueName: 'Планетарий',
    address: 'Садовая-Кудринская ул., 5',
    isOnline: false,
    isFree: true,
    categorySlug: 'education',
    maxAttendees: 200,
    ageRestriction: '0+',
    isFeatured: false,
    imageBaseName: 'sustainability-forum',
  },
  {
    title: 'Фестиваль уличной еды',
    slug: 'street-food-festival',
    shortDescription: 'Лучшие фуд-траки города',
    description: 'Большой фестиваль уличной еды с участием лучших ресторанов и фуд-траков. Живая музыка, развлечения для детей и множество вкусной еды.',
    startDate: '2026-05-01T12:00:00.000Z',
    endDate: '2026-05-01T22:00:00.000Z',
    city: 'Санкт-Петербург',
    venueName: 'Парк 300-летия',
    address: 'Кондратьевский пр., 75',
    isOnline: false,
    isFree: true,
    categorySlug: 'festivals',
    maxAttendees: 5000,
    ageRestriction: '0+',
    isFeatured: true,
    imageBaseName: 'street-food-festival',
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.bookingItem.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.eventImage.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.event.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await hash('admin123', 10)
  const userPassword = await hash('user123', 10)
  const organizerPassword = await hash('organizer123', 10)

  const admin = await prisma.user.create({
    data: { email: 'admin@myeventspro.ru', password: adminPassword, name: 'Администратор', role: 'ADMIN' },
  })

  const user = await prisma.user.create({
    data: { email: 'user@myeventspro.ru', password: userPassword, name: 'Иван Петров', role: 'USER' },
  })

  const organizer = await prisma.user.create({
    data: { email: 'organizer@myeventspro.ru', password: organizerPassword, name: 'Event Studio', role: 'ORGANIZER' },
  })

  console.log('✅ Users created')

  for (const cat of categories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        image: `/images/placeholders/event.svg`,
      },
    })
  }

  console.log('✅ Categories created')

  for (const event of events) {
    const category = await prisma.category.findUnique({ where: { slug: event.categorySlug } })
    if (!category) continue

    const basePrice = event.isFree ? 0 : Math.floor(Math.random() * 4000) + 500

    await prisma.event.create({
      data: {
        organizerId: organizer.id,
        categoryId: category.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        shortDescription: event.shortDescription,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        locationType: event.isOnline ? 'online' : 'offline',
        venueName: event.venueName,
        address: event.address,
        city: event.city,
        isOnline: event.isOnline,
        onlineUrl: event.onlineUrl,
        isFree: event.isFree,
        status: 'PUBLISHED',
        isFeatured: event.isFeatured,
        maxAttendees: event.maxAttendees,
        ageRestriction: event.ageRestriction,
        images: {
          create: [
            {
              url: event.imageBaseName
                ? `/images/events/${event.imageBaseName}-0.jpg`
                : `/images/placeholders/event.svg`,
              altText: event.title,
              isMain: true,
              sortOrder: 0,
            },
          ],
        },
        tickets: {
          create: event.isFree
            ? [{ name: 'Бесплатный вход', description: 'Регистрация обязательна', price: 0, quantityTotal: event.maxAttendees || 100, isActive: true }]
            : [
                { name: 'Стандарт', description: 'Стандартный билет', price: basePrice, quantityTotal: Math.floor((event.maxAttendees || 100) * 0.7), isActive: true },
                { name: 'VIP', description: 'VIP доступ', price: basePrice * 2, quantityTotal: Math.floor((event.maxAttendees || 100) * 0.2), isActive: true },
              ],
        },
      },
    })
  }

  await prisma.promoCode.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      type: 'PERCENT',
      value: 20,
      minAmount: 1000,
      maxDiscount: 1000,
      validFrom: new Date(),
      validUntil: new Date('2026-12-31'),
      usageLimit: 100,
    },
  })

  console.log('✅ Events and tickets created')
  console.log('🎉 Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
