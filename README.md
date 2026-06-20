# 🎉 MyEventsPro / EventHub

[![Site](https://img.shields.io/badge/🌐_Сайт-myeventspro.ru-22c55e?style=for-the-badge)](https://myeventspro.ru)
[![Status](https://img.shields.io/badge/✅_Статус-в_работе-22c55e?style=for-the-badge)](https://myeventspro.ru)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Курсовая работа**  
> *Тема: Разработка веб-приложения для управления мероприятиями*

**🚀 Сайт доступен по адресу:** [https://myeventspro.ru](https://myeventspro.ru)

Современное full-stack веб-приложение для поиска, создания и бронирования мероприятий. Платформа объединяет гостей и организаторов: пользователи могут находить события по категориям, городам и формату, а организаторы — создавать мероприятия и управлять билетами.
---

## ✨ Возможности

### 👤 Клиентская часть
- 🏠 Главная страница с категориями, рекомендуемыми и ближайшими событиями
- 📋 Каталог с фильтрами по категории, городу, формату (очно/онлайн/гибрид) и цене
- 🔍 Поиск мероприятий
- 📊 Сортировка по дате, цене, рейтингу и популярности
- 🎫 Карточка мероприятия с галереей, описанием, билетами и организатором
- 🛒 Временный выбор билетов с последующим бронированием
- 👤 Личный кабинет с бронированиями, избранным и выбранными билетами
- 📱 Адаптивный дизайн (mobile-first)

### 🛠️ Для организаторов
- ➕ Создание мероприятий с несколькими типами билетов
- 📂 Управление событиями через личный кабинет

### 🔐 Администрирование
- 📊 Статистика по мероприятиям, категориям и пользователям
- 📝 Публикация/скрытие мероприятий
- 👥 Список пользователей

---

## 🛠 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend + Backend** | Next.js 14 (App Router), TypeScript |
| **Стили** | Tailwind CSS |
| **База данных** | SQLite (Prisma ORM) |
| **Аутентификация** | JWT-токены (jose) |
| **State management** | Zustand |

---

## 📁 Структура проекта

```
.
├── app/                    # Страницы и API routes (Next.js App Router)
│   ├── api/               # REST API endpoints
│   │   ├── auth/          # Авторизация (login, register, logout)
│   │   ├── events/        # Мероприятия
│   │   ├── categories/    # Категории
│   │   ├── bookings/      # Бронирования и избранное
│   │   ├── admin/         # Административные endpoints
│   │   └── users/         # Профиль пользователя
│   ├── admin/             # Админ-панель
│   ├── catalog/           # Каталог мероприятий
│   ├── event/[slug]/      # Страница мероприятия
│   ├── create-event/      # Создание мероприятия
│   ├── profile/           # Личный кабинет
│   ├── about/             # О нас
│   └── page.tsx           # Главная страница
├── components/            # React-компоненты
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   ├── EventGrid.tsx
│   └── BookTicketButton.tsx
├── lib/                   # Утилиты (Prisma, auth, slugify)
├── prisma/                # Схема БД и seed-данные
│   ├── schema.prisma
│   └── seed.ts
├── store/                 # Zustand store (выбор билетов)
├── types/                 # TypeScript типы
├── public/                # Статические файлы и фото мероприятий
│   └── images/
│       ├── events/        # AI-изображения мероприятий
│       └── placeholders/  # Заглушки
└── README.md
```

---

## 🎭 Мероприятия

В проекте **14 мероприятий** в **10 категориях**:
- 🎤 Конференции
- 🎸 Концерты
- 💍 Свадьбы
- 🏢 Корпоративы
- 🎨 Мастер-классы
- 🖼️ Выставки
- 🏆 Спорт
- 📚 Образование
- 🎉 Фестивали
- 🤝 Нетворкинг

---

📄 Документация
Все документы находятся в папке docs/.

---

## 👤 Тестовые пользователи

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@myeventspro.ru | admin123 |
| Организатор | organizer@myeventspro.ru | organizer123 |
| Пользователь | user@myeventspro.ru | user123 |

---

*2026 © MyEventsPro*
