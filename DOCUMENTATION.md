# FoodOptimizer Frontend — документация по `src/`

> **Ветка: `master`**, коммит `24627c9` (38 коммитов, последний — 18.09.2026).
> ⚠️ В репозитории две ветки: `main` (ветка по умолчанию на GitHub) содержит один устаревший «Initial commit», актуальный код — в `master`. См. раздел 2.
> Стек: React 19, TypeScript 5.9 (strict), Vite 8, React Router 7, TanStack Query 5, Zustand 5, SCSS Modules, lucide-react.
> Архитектура: Feature-Sliced Design (FSD) с отклонениями (см. раздел 11).

---

## Глобальные задачи на месяц;
- [ ] исправить ошибки, см 11  
- [ ] переписать модели данных по заказам в соответсвии с ответами от бэка  
- [ ] освоить и применить nginx

## Оглавление

1. [Быстрый указатель: «хочу изменить X — иду в Y»](#1-быстрый-указатель)
2. [О проекте, ветки и запуск](#2-о-проекте-ветки-и-запуск)
3. [Карта файлов](#3-карта-файлов)
4. [Архитектура и правила импортов](#4-архитектура-и-правила-импортов)
5. [Поток данных](#5-поток-данных)
6. [Справочник по файлам](#6-справочник-по-файлам)
7. [Состояние (Zustand): фильтры и тема](#7-состояние-zustand)
8. [API-контракт](#8-api-контракт)
9. [Стили и тема](#9-стили-и-тема)
10. [Рецепты: как добавить / изменить](#10-рецепты)
11. [Аудит: найденные проблемы](#11-аудит-найденные-проблемы)
12. [Чек-лист ручной проверки](#12-чек-лист-ручной-проверки)

---

## 1. Быстрый указатель

| Что хочу сделать | Куда идти |
|---|---|
| Текст/кнопка/карточки на главной | `pages/mainPage/MainPage.tsx` → `MainPage.module.scss` |
| Пункты меню, логотип, шапка | `widgets/Header/ui/Header.tsx` → `Header.module.scss` |
| Текст окна «О проекте» | `widgets/AboutModal/ui/aboutModal.tsx` (массив `FEATURES`, версия в футере) |
| Сделать новое модальное окно | компонент `Modal` в `shared/UI/modal/modal.tsx` (см. рецепт 10.7) |
| Добавить/изменить маршрут | `app/App.tsx` |
| Город / ресторан / адрес | UI: `features/searchFilters/ui/LocationSection.tsx`; загрузка и обработчики: `pages/filtersPage/FiltersPage.tsx` |
| Бюджет, число людей, число вариантов | `features/searchFilters/ui/BudgetSection.tsx` |
| Режим сытности / категории / исключения | `features/searchFilters/ui/PreferenceSection.tsx` |
| Добавить категорию блюда или режим | `features/searchFilters/model/SearchFilters.ts` **и** `features/searchDishes/lib/PreferencesToAPI.ts` |
| Значения фильтров по умолчанию | `features/searchFilters/model/search.store.ts` (`primaryState`) |
| Добавить шаг в мастер фильтров | `pages/filtersPage/FiltersPage.tsx` (`FILTER_ORDER`, `FILTER_LABELS`, блок рендера) |
| Список вариантов заказа | `pages/orderPage/OrderPage.tsx`, карточка — `entities/order/UI/Order.tsx` |
| Страница одного заказа | `pages/orderItemPage/OrderItemPage.tsx` |
| Тело запроса на оптимизацию | `OrderPage.tsx` / `OrderItemPage.tsx` (`reqBody`) + `features/searchDishes/lib/PreferencesToAPI.ts` |
| Типы заказа и позиции | `entities/order/model/types.ts`, `entities/orderItem/model/types.ts` |
| Тема (светлая/тёмная): логика | `shared/lib/theme/theme.ts`, `useThemeStore.ts` |
| Тема: **цвета** | `app/styles/global.scss` (блоки `[data-theme]`) |
| Кнопка «назад» | `shared/UI/backBtn/backBtn.tsx` |
| Кнопка-сердечко | `shared/UI/likeBtn/likeBtn.tsx` (пока заглушка) |
| Адаптив на JS (ширина окна) | хук `shared/lib/hooks/useWindowWidth.tsx` |
| Адрес бэкенда | `.env` (`VITE_API_URL`) или переменная окружения в Vercel |
| HTTP-обёртка, обработка ошибок сети | `shared/api/httpClient.ts` |
| Новый запрос к API | `entities/<сущность>/api/` (рецепт 10.5) |
| Цвета, шрифты, радиусы, размеры текста | `app/styles/global.scss` |
| Стили фильтров (селекты, чипы, слайдер, счётчики) | `features/searchFilters/styles/Filters.module.scss` |
| Раскладка страницы фильтров | `pages/filtersPage/FiltersPage.module.scss` |
| Брейкпоинт адаптива | CSS: везде `@media (min-width: 1100px)` (11 мест: `grep -rn "min-width: 1100px" src`); JS: `> 1100` / `< 1100` в 3 файлах (`backBtn`, `Order`, `OrderItemPage`) и **`> 800`** в `FiltersPage.tsx` |
| Шрифты / картинки | `shared/assets/`; шрифты подключаются в `global.scss` (`@font-face`) |
| Правила линтера / форматирования | `eslint.config.js`, `.prettierrc` |

---

## 2. О проекте, ветки и запуск

**Что делает приложение:** пользователь выбирает город → ресторан → адрес, задаёт бюджет, число людей и предпочтения каждого (режим сытности, желаемые/исключённые категории); бэкенд возвращает варианты заказа; пользователь листает варианты и открывает один из них.

**Ветки (важно):**

| Ветка | Состояние |
|---|---|
| `master` | актуальная: 38 коммитов, заказы, тема, модалка. **Её деплоит Vercel.** |
| `main` | **ветка по умолчанию на GitHub**, но содержит один «Initial commit» — устаревший снимок |

Из-за этого при переходе через профиль GitHub открывается старый код. Решение: *Settings → Branches → Default branch* → выбрать `master` (или влить `master` в `main` и деплоить `main`).

**Команды** (`package.json`):

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер Vite |
| `npm run build` | сборка в `dist/` (**без проверки типов и без линта**) |
| `npm run lint` / `lint:fix` | ESLint (только `*.ts, *.tsx`) — **сейчас падает с 1 ошибкой** (см. п. 11) |
| `npm run format` | Prettier по всему проекту |
| `npx tsc --noEmit` | проверка типов (скрипта нет) |

**Переменные окружения:** `VITE_API_URL` — базовый URL API, **обязательно с `/` на конце** (`httpClient` склеивает строки: `BASE_URL + endpoint`). Значения из переменных окружения хостинга (Vercel) перекрывают `.env`.

**Алиас импортов:** `@/` → `src/`.

---

## 3. Карта файлов

```
src/
├── main.tsx                          Точка входа: global.scss + <App/> в StrictMode
├── global.d.ts                       Декларации модулей: *.module.scss, картинки
├── vite-env.d.ts                     Типы Vite
│
├── app/
│   ├── App.tsx                       QueryClientProvider + BrowserRouter + Header + Routes
│   └── styles/global.scss            Палитры двух тем, токены, reset, @font-face
│
├── pages/
│   ├── mainPage/                     «/» — лендинг (MainPage.tsx, .module.scss, assets/icons)
│   ├── filtersPage/                  «/filters» — мастер из 3 шагов (FiltersPage.tsx, .module.scss)
│   ├── orderPage/                    «/dishlist» — список вариантов заказа (OrderPage.tsx, .module.scss)
│   └── orderItemPage/                «/dishlist/:id» — один заказ (OrderItemPage.tsx, .module.scss)
│
├── widgets/
│   ├── Header/ui/                    Header.tsx, Header.module.scss — шапка, меню, тема, вызов модалки
│   └── AboutModal/ui/                aboutModal.tsx, .module.scss — содержимое окна «О проекте»
│
├── features/
│   ├── searchFilters/                Сценарий «настроить фильтры»
│   │   ├── api/getAllCities.ts       GET Cities
│   │   ├── model/SearchFilters.ts    Типы, списки категорий и режимов
│   │   ├── model/search.store.ts     Zustand-стор фильтров
│   │   ├── styles/Filters.module.scss
│   │   └── ui/                       LocationSection, BudgetSection, PreferenceSection
│   └── searchDishes/                 Сценарий «получить варианты заказа»
│       ├── api/getAllDishes.ts       POST Orders/optimize → Order[]
│       ├── api/queryParams.ts        queryOptions
│       └── lib/PreferencesToAPI.ts   Маппинг рус → API
│
├── entities/
│   ├── restaurant/                   api/getRestaurants.ts, api/queryParams.ts, model/types.ts
│   ├── order/                        model/types.ts (Order); UI/Order.tsx (карточка); UI/OrderStyles.module.scss
│   └── orderItem/                    model/types.ts (OrderItem); UI/OrderItemComponent.tsx (НЕ ИСПОЛЬЗУЕТСЯ);
│                                     UI/OrderItem.module.scss (ПУСТОЙ, 0 байт)
│
└── shared/
    ├── api/httpClient.ts             Обёртка над fetch
    ├── lib/
    │   ├── hooks/useWindowWidth.tsx  Ширина окна (для JS-адаптива)
    │   ├── theme/theme.ts            applyTheme / initialTheme (localStorage + data-theme)
    │   ├── theme/useThemeStore.ts    Zustand-стор темы
    │   └── getErrorMessage/GetErrorMessage.ts   НЕ ИСПОЛЬЗУЕТСЯ
    ├── UI/
    │   ├── backBtn/                  backBtn.tsx + BackBtn.module.scss
    │   ├── likeBtn/                  likeBtn.tsx + likeBtn.module.scss
    │   └── modal/                    modal.tsx + modal.module.scss (bottom-sheet / центрированное окно)
    └── assets/                       fonts/ (Inter, Inter Italic, Manrope), icons/Logo.png
```

---

## 4. Архитектура и правила импортов

FSD: `app → pages → widgets → features → entities → shared`. Слой импортирует только из слоёв **ниже**. Срезы одного слоя друг на друга не ссылаются.

Фактические зависимости:

```
app/App ──► pages/*, widgets/Header
widgets/Header ──► widgets/AboutModal ⚠(widget → widget), shared/lib/theme, shared/assets
widgets/AboutModal ──► shared/UI/modal
pages/filtersPage ──► features/searchFilters, entities/restaurant, shared/UI/backBtn, shared/lib/hooks
pages/orderPage ──► entities/order, features/searchDishes, features/searchFilters/model, shared/UI/backBtn
pages/orderItemPage ──► entities/order(types), features/*, shared/UI/{backBtn,likeBtn}, shared/lib/hooks
features/searchDishes ──► entities/order(types), features/searchFilters/model ⚠(feature → feature)
entities/order/UI ──► shared/UI/likeBtn, shared/lib/hooks
entities/order/model ⇄ entities/orderItem/model ⚠(entity ↔ entity, циклическая зависимость типов)
entities/*, features/* ──► shared/api
```

Сегменты внутри среза: `ui/` (`UI/` в entities и shared), `model/`, `api/`, `lib/`, `styles/`.

Соглашения (`.prettierrc`, ESLint): 4 пробела, одинарные кавычки, `;`, trailing comma `all`, ширина 100; импорты сортирует `simple-import-sort`.

---

## 5. Поток данных

```
FiltersPage                                                   OrderPage / OrderItemPage
───────────                                                   ─────────────────────────
useQuery ['cities'] ── GET Cities
      │
LocationSection (город) ──update({cityName})──► Zustand: useFilterStore.filters
      │                                              ▲
useQuery ['restaurants', city] ── GET Brands?city=…  │
      │ Restaurant[] (с locations[])                 │
LocationSection (ресторан, адрес)                    │
   └ update({address, addressId ← location.id})      │
BudgetSection ── update({budget,count}) / setPersonCount(n)
PreferenceSection ── toggleInPerson → update({generalPreferences})
                                                     │
                       reqBody = { restaurantId: filters.addressId, budget,
                                   peoplePreferences: map(PreferencesToAPI),
                                   variantsCount: filters.count }
                                                     │
                       useQuery ['dishes', reqBody] ── POST Orders/optimize → Order[]
                                                     │
                       ⚠ на экране: mockOrders (захардкожены в самих страницах);
                         реальные данные используются только для счётчика
                         «Найдено N вариантов»
```

Тема живёт отдельно: `useThemeStore` → `data-theme` на `<html>` + `localStorage['theme']`.

Ключевые моменты:
- Ресторан выбирается **по имени**, адрес — **по строке адреса**; `addressId` находится поиском по загруженным данным и уходит на бэк как `restaurantId`.
- Запрос блюд включён только при непустом `addressId`.
- Русские значения UI (`'Основное блюдо'`, `'Легко'`) → API (`'MainDish'`, `'Light'`) в `PreferencesToAPI.ts`.
- Выбранный заказ хранится в URL: клик по карточке → `setSearchParams({orderId}, {replace:true})` + `navigate('/dishlist/<id>')`. Судя по коду, задумано так: запись `/dishlist?orderId=…` остаётся в истории, и при возврате «назад» карточка подсвечена. Приём неочевидный — стоит оставить комментарий.

---

## 6. Справочник по файлам

### 6.1 `app/App.tsx`
`QueryClient` без настроек. Маршруты:

| Путь | Компонент |
|---|---|
| `/` | `MainPage` |
| `/filters` | `FiltersPage` |
| `/dishlist` | `OrderPage` |
| `/dishlist/:id` | `OrderItemPage` |

Маршрута `*` (404) нет. Состояния темы в `App` больше нет — оно в `useThemeStore`.

### 6.2 `pages/filtersPage/FiltersPage.tsx`
Оркестратор мастера.

| Элемент | Что делает |
|---|---|
| `FILTER_ORDER` = `['location','budget','preferences']`, `FILTER_LABELS` | Порядок и подписи шагов |
| `useQuery(['cities'])`, `useQuery(restaurantQueryParams)` | Загрузка городов и ресторанов города |
| `getAllRests / getAddresses / getAddressIdOnName` | Поиск локаций и id |
| `validateLocation()` | Проверка обязательных полей шага 1 |
| `goToNextFilter / goToPrevFilter` | Навигация; последний шаг → `navigate('/dishlist')`; «назад» с первого шага → `navigate(-1)` |
| `toggleInPerson` | Переключение значения в предпочтениях человека `index` |
| `generalPreferences` | Адаптер стора → пропсы `PreferenceSection` |
| `width = useWindowWidth()` | **`width > 800`** → рендерится один вариант шапки страницы (с обёрткой `.filtersAdditionalSub`), иначе — второй (два почти одинаковых блока JSX) |
| `data-index` на подписях прогресс-бара | используется в стилях для нумерованного бейджа (`content: attr(data-index)`) |
| `errorBox` | Только ошибка загрузки **городов** |

Валидируется **только шаг 1**.

### 6.3 `features/searchFilters/ui/LocationSection.tsx`
Три зависимых `<select>`. Пропсы: `city / restaurant / address` (`{options, value, setValue}`), `citiesLoad`, `restaurantsLoad`, `error` (объект ошибок валидации). Смена города сбрасывает ресторан и адрес; смена ресторана — адрес.

### 6.4 `features/searchFilters/ui/BudgetSection.tsx`
Слайдер бюджета (`min=100`, `max=10000`, `step=100`) и два счётчика (число людей 1…20, число вариантов 1…20).
**Кнопки −/+ работают по удержанию:** `onMouseDown/onTouchStart` запускают `startHold` (первый шаг через 50 мс, дальше каждые 200 мс через `setTimeout`), `onMouseUp/onMouseLeave/onTouchEnd/onTouchCancel` вызывают `stopHold`. Актуальные значения читаются через `ref` (`personCountRef`, `countRef`). На границе диапазона кнопка получает `disabled`. `onClick` у кнопок **нет**.

### 6.5 `features/searchFilters/ui/PreferenceSection.tsx`
По блоку на каждого человека: чекбоксы режимов, категорий, сворачиваемый блок «Исключить категории». Локальный state `personCount` (сколько людей показано) и `excludedOpen`. В блоке «Исключить» чекбокс `disabled`, если категория уже выбрана как желаемая, а также если исключены все категории кроме одной.

### 6.6 `features/searchFilters/model/SearchFilters.ts`
Единый источник доменных значений: `OptimizeMode` (`'Легко' | 'Средне' | 'Сытно'`) и `modes`; `Category` (6 значений) и `categories`; интерфейсы `preferencesData` (предпочтения одного человека) и `SearchFilters`.

### 6.7 `features/searchDishes/*`
- `getAllDishes(data: object): Promise<Order[]>` → `POST Orders/optimize`.
- `dishesQueryParams({filters, isEnabled})` → ключ `['dishes', filters]`.
- `PreferencesToAPI` — `Record`-маппинги `CategoryToAPI`, `ModeToAPI` (TypeScript не даст забыть новую категорию).

### 6.8 `entities/restaurant/*`
`Location {id, address, isOpen}`, `Restaurant {id, name, locations[]}`; `getRestaurants(city)` → `GET Brands?city=…`; `restaurantQueryParams` → `['restaurants', city]`.

### 6.9 `entities/order/*`
- `types.ts`: `Order {id, name, totalPrice, totalCalories, restaurantName, OrderItems: OrderItem[]}`.
- `UI/Order.tsx` (`OrderComponent`): карточка варианта. Пропсы `isCurrentOrder`, `orderInfo`, `onClick(id)`. Внутри `LikeBtn`. **Порядок блока цены относительно сердечка меняется через JS** (`width > 1100` / `width < 1100`).
- `UI/OrderStyles.module.scss`: см. раздел 9.

### 6.10 `entities/orderItem/*`
`OrderItem {itemName, itemPrice, calories, discountType: number|null, efficientItemPrice, manual}`. `OrderItemComponent` (список позиций заказа) — **нигде не подключён**, а его файл стилей пуст (0 байт), поэтому классы `OrderItemCard / title / orderItemList / orderItem` не определены.

### 6.11 `pages/orderPage/OrderPage.tsx`
Собирает `reqBody` из стора, вызывает `useQuery(dishesQueryParams)`. Выводит заголовок, `BackBtn` («Назад к фильтрам»), счётчик `Найдено {allDishes?.length} вариантов` и список карточек. **Список строится из `mockOrders` — массива на 158 строк, объявленного прямо в файле.** Клик по карточке: `onOrderClick`.

### 6.12 `pages/orderItemPage/OrderItemPage.tsx`
Читает `:id`, ищет заказ в **собственной копии `mockOrders`** (идентична копии в `OrderPage`), показывает `BackBtn`, название заказа (заголовок дублируется в JSX и выбирается по `width`), `LikeBtn`. Список позиций не выводится. Запрос блюд выполняется, но его результат не используется.

### 6.13 `shared/UI/*`
- `BackBtn({title})` — `<h1>` со стрелкой, по клику `navigate(-1)`; текст `title` показывается только при `width > 1100`.
- `LikeBtn` — кнопка-сердечко, при клике только `stopPropagation` (состояния «в избранном» нет).
- `Modal({isOpen, onClose, title, children})` — портал в `document.body`; закрытие по Esc и по клику на оверлей; блокирует прокрутку `body`; анимация 300 мс (`ANIMATION_DURATION`) через состояния `shouldRender` / `isClosing`. На мобильных — «шторка» снизу, с 1100 px — окно по центру.

### 6.14 `shared/lib/*`
- `useWindowWidth()` — возвращает `window.innerWidth`, подписан на `resize`.
- `theme.ts`: `applyTheme(theme)` → `data-theme` на `<html>`; `initialTheme()` → читает `localStorage['theme']`, по умолчанию `'dark'`.
- `useThemeStore` — см. раздел 7.
- `getErrorMessage` — не используется.

### 6.15 `shared/api/httpClient.ts`
Класс со статическими `get / post / put / delete`. `get`: при `!response.ok` бросает `Error('Не удалось загрузить данные... Попробуйте позже.')` **только для статусов 500, 501, 502** — для остальных ошибочных статусов исключение не бросается (см. п. 11). `post / put / delete`: бросают `Error('HTTP <status>')` при любом `!ok`. Параметр `init` в `get` — строка query без `?`.

### 6.16 `widgets/Header/ui/Header.tsx`
Логотип, меню (Главная — `Link`; «О проекте» — открывает `AboutModal`; «Избранное» — пока ничего не делает), бургер мобильного меню, кнопка темы (`useThemeStore`), сама `AboutModal`.

### 6.17 `widgets/AboutModal/ui/aboutModal.tsx`
Содержимое модального окна: вводный текст, список `FEATURES` (иконка, заголовок, текст), футер с версией `0.1.0` (захардкожена).

---

## 7. Состояние (Zustand)

### 7.1 `useFilterStore` — `features/searchFilters/model/search.store.ts`

Начальные значения (`primaryState`):

| Поле | По умолчанию |
|---|---|
| `cityName`, `restaurantName`, `address`, `addressId` | `''` |
| `budget` | `2000` |
| `count` (число вариантов) | `10` |
| `personCount` | `1` |
| `generalPreferences` | массив из одного пустого `preferencesData` |

| Действие | Что делает |
|---|---|
| `update(partial)` | Поверхностно сливает часть полей в `filters` |
| `reset()` | Возвращает `primaryState` (нигде не вызывается) |
| `setPersonCount(n)` | Меняет `personCount` и синхронно дополняет/обрезает `generalPreferences` до `n` |
| `togglePreferences(i, key, value)` | Не используется — логика продублирована в `FiltersPage.toggleInPerson` |

Стор **не персистентный**: после перезагрузки страницы фильтры теряются.

### 7.2 `useThemeStore` — `shared/lib/theme/useThemeStore.ts`
`currentTheme: 'light' | 'dark'` (начальное значение — результат `initialTheme()`, вызывается при создании стора) и `toggleTheme()` — переключает, применяет `data-theme` на `<html>` и пишет в `localStorage['theme']`.

---

## 8. API-контракт

Базовый URL: `VITE_API_URL` (в `.env` сейчас `http://localhost:5001/api/`).

| Метод | Путь | Вход | Выход (как типизировано) |
|---|---|---|---|
| GET | `Cities` | — | `string[]` |
| GET | `Brands?city=<city>` | `city` | `Restaurant[]` → `{id, name, locations: [{id, address, isOpen}]}` |
| POST | `Orders/optimize` | см. ниже | `Order[]` |

Тело `POST Orders/optimize`:

```jsonc
{
  "restaurantId": "<location.id>",          // из filters.addressId
  "budget": 2000,
  "peoplePreferences": [                    // по объекту на человека
    {
      "desiredCategories":  ["MainDish"],   // MainDish | SideDish | Drinks | Sauces | Breakfast | Dessert
      "excludedCategories": ["Dessert"],
      "satiationLevels":    ["Light"]       // Light | Medium | Heavy
    }
  ],
  "variantsCount": 10
}
```

Ожидаемая форма элемента ответа (по типам фронта):

```ts
Order { id, name, totalPrice, totalCalories, restaurantName,
        OrderItems: [{ itemName, itemPrice, calories, discountType: number|null, efficientItemPrice, manual }] }
```

⚠ Поле `OrderItems` — с заглавной буквы, тогда как остальные поля (и ответ `Brands`) в camelCase. Если бэкенд отдаёт `orderItems`, при подключении реальных данных `order.OrderItems.map` упадёт. Сверить с реальным JSON.

Ключи TanStack Query: `['cities']`, `['restaurants', city]`, `['dishes', reqBody]`.

| UI | API |
|---|---|
| Основное блюдо / Гарнир / Напиток / Соус / Завтрак / Десерт | `MainDish` / `SideDish` / `Drinks` / `Sauces` / `Breakfast` / `Dessert` |
| Легко / Средне / Сытно | `Light` / `Medium` / `Heavy` |

---

## 9. Стили и тема

### 9.1 Подход
- **CSS Modules** (`*.module.scss`), классы как `styles.className`; типы — в `global.d.ts`.
- **Токены** — CSS-переменные в `app/styles/global.scss`.
- **Mobile-first, единый брейкпоинт `min-width: 1100px`** во всех SCSS. В JS используются `> 1100`, `< 1100` и (в `FiltersPage`) `> 800` — см. п. 11.

### 9.2 Тема
Атрибут `data-theme="light|dark"` на `<html>` выбирает палитру:

```scss
:root, [data-theme="dark"]  { --color-bg: #0f1117; … }   // тёмная (по умолчанию)
[data-theme="light"]        { --color-bg: #f7f8fa; … }   // светлая
:root { --font-…, --text-…, --weight-…, --radius-…, --transition-… }  // общие токены
```

Чтобы сделать новый цвет темизируемым — добавить переменную в **оба** блока палитр. Прямые значения цвета вне `global.scss` встречаются в трёх местах: `#fff` (`FiltersPage.module.scss:46`), `rgba` затемнения оверлея и тени в `modal.module.scss`.

### 9.3 Токены

| Группа | Токены |
|---|---|
| Цвета (в двух палитрах) | `--color-bg`, `--color-card-bg`, `--color-control-bg`, `--color-main-green`, `--color-green-hover`*, `--color-green-lighter`, `--color-main-text`, `--color-option-text`, `--color-disabled-text`, `--color-rating`*, `--color-error-text` |
| Шрифты | `--font-main` (Inter), `--font-heading` (Manrope) |
| Размеры текста | `--text-xs/sm/md/lg/xl/3xl`, `--text-2xl`* |
| Насыщенность | `--weight-regular/bold`, `--weight-medium`*, `--weight-semibold`*, `--weight-extrabold`* |
| Скругления | `--radius-small` 10px, `--radius-medium` 15px, `--radius-large` 20px |
| Анимации | `--transition-fast` 0.2s, `--transition-norm` 0.3s (используются только в `modal.module.scss`) |

\* не используется. Всего 30 токенов, 6 не используются.

### 9.4 Карта классов

| Файл | Классы |
|---|---|
| `features/searchFilters/styles/Filters.module.scss` | `filterSection` (карточка секции), `filterLabel`, `filterSelect`, `fieldError`, `modeChose`, `categoryChose`, `filterOption` (чип: скрытый чекбокс + `span`, есть `:disabled + span`), `excludedCategoryChose`, `personBlock / personHeader / personTitle`, `removePersonBtn`, `addPersonBtn`, `budgetInput / budgetRangeLabels / budgetLabel`, `peopleCount` (счётчик −/число/+ с `:disabled`-состоянием) |
| `pages/filtersPage/FiltersPage.module.scss` | `filtersAdditionalInfo`, `filtersAdditionalSub`, `filtersProgressBar / Group / Label / LabelActive / Divider`, `filtersMain`, `filterContent`, `prevFilterButton`, `filtersNextButton`, `errorBox` |
| `pages/mainPage/MainPage.module.scss` | `mainTitleSection`, `mainTitle`, `mainText`, `mainButton` (+ `mainButtonContent`), `mainFeatures`, `mainFeatureCard` |
| `pages/orderPage/OrderPage.module.scss` | `mainSection`, `AdditionalInfo` (вложенные `.backBtn`, `h1`, `.variantCounts`) |
| `pages/orderItemPage/OrderItemPage.module.scss` | `mainSection`, `AdditionalInfo` (вложенные `.backBtn`, `h1`), `likeBtnContainer` |
| `entities/order/UI/OrderStyles.module.scss` | `orderCard` (grid; `:has(.likeBtnContainer:active)` отключает «нажатие» карточки при клике на сердечко), `likeBtnContainer`, `activeCard`, `orderNumber`, `activeNumber`, `additionalInfo`, `totalPrice` |
| `entities/orderItem/UI/OrderItem.module.scss` | **пусто** |
| `widgets/Header/ui/Header.module.scss` | `header`, `headerLogo`, `headerNav`, `headerNavOpen`, `headerActions`, `headerNavButton`, `menu`, `menuItem`, `headerTheme` |
| `widgets/AboutModal/ui/aboutModal.module.scss` | `intro`, `featureList`, `featureItem`, `featureIcon`, `featureTitle`, `featureText`, `footer`, `footerLabel` |
| `shared/UI/modal/modal.module.scss` | `overlay`, `overlayClosing`, `sheet`, `sheetClosing`, `header`, `title`, `closeBtn`, `content`; анимации `fadeIn/fadeOut/slideUp/slideDown` |
| `shared/UI/backBtn/BackBtn.module.scss` | `filtersTitle` (название осталось от прежнего места — это стиль кнопки «назад») |
| `shared/UI/likeBtn/likeBtn.module.scss` | `likeBtn` |

### 9.5 Шрифты
`@font-face` в `global.scss`: Inter (normal, italic) и Manrope — variable TTF из `shared/assets/fonts/`. `h1–h6` → Manrope, остальное → Inter.

---

## 10. Рецепты

### 10.1 Добавить категорию блюда / режим сытности
1. `SearchFilters.ts` — значение в union `Category` **и** в массив `categories`.
2. `PreferencesToAPI.ts` — пара в `CategoryToAPI` (без этого TS выдаст ошибку).
`PreferenceSection` рисует чипы из массива сам. Режим — то же через `OptimizeMode` / `modes` / `ModeToAPI`.

### 10.2 Добавить новое поле в фильтры
1. `SearchFilters.ts` — поле в `SearchFilters` (или в `preferencesData`, если «на человека»).
2. `search.store.ts` — значение в `primaryState` (и в `emptyPreference`, если «на человека»).
3. Компонент секции (или поле в существующей) в `features/searchFilters/ui/`.
4. `FiltersPage.tsx` — прокинуть значение и `update({...})`.
5. `reqBody` в `OrderPage.tsx` **и** `OrderItemPage.tsx` (копии!) — добавить поле.

### 10.3 Добавить шаг в мастер
`FiltersPage.tsx`: ключ в `FILTER_ORDER`, подпись в `FILTER_LABELS`, блок `{currentFilter === '…' && <…/>}`; если обязательный — `validateX()` по образцу `validateLocation()` и вызов в `goToNextFilter`.

### 10.4 Добавить страницу
`pages/<имя>/<Имя>.tsx` + `.module.scss`; `<Route>` в `App.tsx`; пункт меню в `Header.tsx`.

### 10.5 Добавить запрос к API
1. Тип ответа в `entities/<x>/model/types.ts`.
2. `entities/<x>/api/getX.ts` через `httpClient`.
3. `entities/<x>/api/queryParams.ts` — `queryOptions({queryKey, queryFn, enabled})`.
4. В компоненте `useQuery(...)`, обработать `isLoading` / `error`.

### 10.6 Подключить реальные данные вместо моков
1. В `OrderPage.tsx` заменить `mockOrders.map(...)` на `allDishes?.map(...)`, добавить обработку `isLoading` / `error` / пустого результата.
2. В `OrderItemPage.tsx` найти заказ в `allDishes` (или в кэше Query) вместо `mockOrders`; подключить `OrderItemComponent` и наполнить `OrderItem.module.scss`.
3. Удалить обе копии `mockOrders`.
4. Сверить форму ответа (`OrderItems` vs `orderItems`).
5. Вынести сборку `reqBody` + `useQuery` в один хук (например, `features/searchDishes/model/useOptimizedOrders.ts`).

### 10.7 Показать своё модальное окно
```tsx
const [open, setOpen] = useState(false);
<Modal isOpen={open} onClose={() => setOpen(false)} title="Заголовок">…содержимое…</Modal>
```
По образцу — `widgets/AboutModal`.

### 10.8 Поменять / добавить цвет темы
`global.scss`: изменить значение переменной **в обоих** блоках (`:root, [data-theme="dark"]` и `[data-theme="light"]`).

### 10.9 Границы бюджета и лимиты счётчиков
`BudgetSection.tsx`: `min / max / step` слайдера, проверка `<= 10000` в `onChange`, подписи границ под слайдером, лимиты `20` и `1` (в `disabled` и в аргументах `startHold`). Числа не вынесены в константы — менять во всех местах сразу.

### 10.10 Адрес бэкенда
`.env` локально; для Vercel — переменная окружения `VITE_API_URL` (**со `/` на конце**, HTTPS). Перезапустить dev-сервер / пересобрать.

---

## 11. Аудит: найденные проблемы

**Автоматические проверки на `master`:**

| Проверка | Результат |
|---|---|
| `tsc --noEmit` | ✅ 0 ошибок |
| `vite build` | ✅ успешно (предупреждение про `vite-tsconfig-paths`) |
| `eslint .` | ❌ **1 ошибка + 1 предупреждение** (`shared/UI/modal/modal.tsx`) |
| `prettier --check .` | ❌ 14 файлов (12 SCSS, `index.html`, `tsconfig.json`) |

**Не проверялось:** запуск в браузере и работа с реальным бэкендом. Выводы о поведении — по чтению кода; про вёрстку — по расчёту.

### 🔴 Критичные

**1. `.env` закоммичен в git и указывает на `localhost`.**
`VITE_API_URL=http://localhost:5001/api/` (файл добавлен коммитом «делаю деплой»). Если в Vercel не задана переменная окружения — этот адрес попадёт в бандл, и браузер пользователя пойдёт на *его* localhost. Если сайт на HTTPS, а API на HTTP — запросы блокируются как mixed content. Комментарий `# .env.production` в файле не соответствует его имени (читается и в dev, и в prod).
Исправить: `.env.example` в репозиторий, `.env` в `.gitignore` (и убрать из индекса: `git rm --cached .env`), значение для продакшена — в настройках Vercel.

**2. `httpClient.get` не бросает ошибку для большинства статусов** (`httpClient.ts:7–14`).
`switch` внутри `if (!response.ok)` покрывает только 500/501/502 и не имеет `default`. Для 400, 401, 403, 404, 503, 504 исключения нет — код идёт дальше в `response.json()`: тело ошибки-JSON будет возвращено как данные типа `T`, а HTML-страница ошибки даст `SyntaxError`, текст которого показывается пользователю в `errorBox`. `post/put/delete` при этом бросают `HTTP <status>` — поведение неодинаковое.
Исправить: бросать для любого `!ok` (статус → сообщение, `default` → общее сообщение), одной функцией для всех методов.

**3. Страницы заказов показывают мок-данные.**
`OrderPage` рисует `mockOrders`, а реальный `allDishes` используется лишь для счётчика «Найдено N вариантов» — то есть на экране список из 4 заказов и число из ответа бэка, которые между собой не связаны. `OrderItemPage` содержит вторую, идентичную копию моков (по 158 строк в каждом файле), выводит только название и не показывает позиции; `OrderItemComponent` не подключён, а его `.module.scss` пуст (0 байт). `isLoading` и `error` нигде не отображаются. Если это уже задеплоено — пользователи видят демо-данные.

**4. `PreferenceSection`: рассинхрон со стором и «призрачные» люди.**
Локальный `personCount` живёт отдельно от `filters.personCount`:
- выбрал 3 человек на шаге «Бюджет», вернулся на «Категории» — виден один (локальный state сбросился);
- `removePerson(index)` делает `setPersonCount(index)` — скрывает **всех начиная с этого индекса**;
- данные скрытых людей остаются в сторе, и на бэк уходят **все** `filters.generalPreferences`.
Исправить: убрать локальный `personCount`, показывать весь `generalPreferences`, добавление/удаление — через стор.

**5. Логика «желаемые ↔ исключённые» односторонняя.**
В блоке «Исключить» категорию, выбранную желаемой, отключить нельзя (`disabled`) — это хорошо. Но обратного нет: в блоке «Выберите категории» чекбоксы не блокируются для уже исключённых. Порядок «сначала исключить, потом выбрать» даёт одну категорию сразу в `desiredCategories` и `excludedCategories`, и в запрос уходит противоречие. Нужно либо блокировать симметрично, либо снимать значение из противоположного списка при выборе.

**6. `addressId` типизирован как `string`, а по факту бывает `undefined`.**
`getAddressIdOnName(value)` возвращает `string | undefined` и передаётся в `update({ addressId })`; при смене города/ресторана вызывается `address.setValue('')`, и в стор попадает `undefined`. TS молчит, потому что `update` принимает `Partial<SearchFilters>`. Исправить: `?? ''`.

**7. Город не кодируется в URL.**
`getRestaurants.ts`: `'city=' + city`. Символы `&`, `#`, `+` в названии сломают запрос. Исправить: `new URLSearchParams({ city }).toString()`.

**8. Несовпадение имён полей `Order.OrderItems`.**
Единственное свойство в PascalCase среди camelCase-полей. Если бэкенд (по умолчанию ASP.NET) отдаёт `orderItems`, то при переходе с моков на реальные данные `order.OrderItems.map(...)` упадёт. Сверить с реальным JSON.

**9. Проверить на Vercel: SPA-fallback.**
`BrowserRouter` требует, чтобы сервер отдавал `index.html` для `/filters`, `/dishlist`, `/dishlist/1`. В репозитории нет `vercel.json`. Проверьте: обновить страницу (F5) на `/filters` и `/dishlist/1`. Если 404 — нужен `vercel.json` с `rewrites` на `/index.html`.

### 🟠 Серьёзные

**10. Адаптивность на JS вместо CSS.**
`useWindowWidth` используется в 4 файлах, чтобы переключать вёрстку:
- `FiltersPage.tsx` — два почти одинаковых блока шапки (~25 строк JSX дважды);
- `Order.tsx:32, 37` — блок цены рендерится в разных местах;
- `OrderItemPage.tsx:204, 208` — заголовок `<h1>` продублирован;
- `backBtn.tsx:18` — подпись показывается по ширине.
Последствия: ререндер на каждое событие `resize` (без debounce); **брейкпоинты рассогласованы** — в CSS 1100 px, а в `FiltersPage` в JS 800 px, поэтому на 801–1099 px JS считает окно «десктопом», а CSS — «мобильным»; **условия `> 1100` и `< 1100` не покрывают ровно 1100 px** — при такой ширине цена в карточке и заголовок на `OrderItemPage` не отображаются вообще (CSS при этом уже «десктопный»: `min-width: 1100px` включает 1100).
Исправить: CSS (`@media`, свойство `order`), а не условный рендер.

**11. `BackBtn` — это `<h1>`.**
На каждой странице с ним получается два `<h1>` (на `FiltersPage` и `OrderPage` рядом есть свой заголовок). На ширине ≤ 1100 px внутри только иконка — пустой заголовок без текстового названия; кликабельный `<h1>` недоступен с клавиатуры. Подпись «Назад на главную» на `FiltersPage` не соответствует действию `navigate(-1)` (возврат на *предыдущую* страницу, не обязательно главную; при прямом заходе — уход с сайта).
Исправить: `<button type="button" aria-label={title}>`.

**12. `BudgetSection`: кнопки −/+ после перехода на «удержание».**
- `onClick` удалён — **клавиатурой (Enter/Space) кнопки не работают**;
- первый шаг выполняется через 50 мс после нажатия: очень быстрый тап (< 50 мс) не меняет значение;
- когда значение доходит до границы, кнопка становится `disabled` *прямо во время удержания* — события `mouseup/mouseleave` на отключённом элементе могут не прийти, и таймер продолжит тикать (проверить в браузере); очистки таймера при размонтировании нет;
- один общий `intervalRef` на все четыре кнопки; обработчики продублированы 4 раза (~60 строк) — просится один компонент `<Stepper/>`;
- `MutableRefObject` объявлен устаревшим в React 19 (использовать `RefObject`); переменная называется `intervalRef`, но хранит `setTimeout`.

**13. Ошибка ESLint и проблемы `Modal`** (`modal.tsx`).
- `23:13` — `react-hooks/set-state-in-effect` (**error**): синхронный `setState` внутри эффекта; `npm run lint` падает.
- `36:8` — `exhaustive-deps` (warning): в эффекте используется `shouldRender`, но его нет в зависимостях.
- `onClose` передаётся из `Header` как новая функция при каждом рендере → эффект подписки на Esc пересоздаётся при каждом рендере.
- Нет фокус-ловушки, возврата фокуса на кнопку-инициатор и `aria-labelledby`; высота в `vh` (на мобильных лучше `dvh`).
- В `modal.module.scss` остался комментарий `// shared/ui/BottomSheet/BottomSheet.module.scss`.
Упростить анимацию закрытия: держать окно смонтированным до `onAnimationEnd`, без пары состояний в эффекте.

**14. Нарушения FSD.**
- `entities/orderItem/UI/OrderItemComponent.tsx` импортирует `Order` из `entities/order`, а `entities/order/model/types.ts` — `OrderItem` из `entities/orderItem`: entity ↔ entity, циклическая зависимость. Компоненту достаточно `OrderItem[]`.
- `features/searchDishes/lib/PreferencesToAPI.ts` → `features/searchFilters/model` (feature → feature).
- `widgets/Header` → `widgets/AboutModal` (widget → widget); проще собрать в `app` или подключить модалку в самой странице/шапке через слот.
- У срезов нет публичного API (`index.ts`) — везде глубокие импорты.
- Бизнес-логика в страницах: `FiltersPage` (`toggleInPerson`, адаптер предпочтений, поиск адресов); `reqBody` дважды в `OrderPage`/`OrderItemPage`.
- Города загружаются в `features/searchFilters/api`, рестораны — в `entities/restaurant`.
- Папки `UI` (в `shared` и `entities`) — по конвенции `ui`; смесь регистров: `Header`, `filtersPage`, `backBtn`/`BackBtn.module.scss`, `likeBtn`.

**15. Мёртвый и дублированный код.**
- `search.store.togglePreferences`, `search.store.reset`, `getErrorMessage`, `OrderItemComponent` — не используются;
- `OrderItem.module.scss` — пустой, `styles.OrderItemCard` и т. д. не определены;
- `mockOrders` — две идентичные копии по 158 строк;
- `import React from 'react'` без использования в `Order.tsx` и `likeBtn.tsx`;
- `isLoading`, `error` (и `allDishes` в `OrderItemPage`) объявлены и не используются — ESLint молчит из-за `no-unused-vars: off`;
- интерфейс `Field<T>` объявлен 4 раза с разной формой, `Preference` — дважды;
- `useWindowWidth.tsx` не содержит JSX — расширение должно быть `.ts`.

**16. `httpClient` — прочее.**
Класс только со статическими членами (проще объект/функции), имя класса в camelCase; копипаста fetch-логики; `this.#BASE_URL` в static-методах ломается при деструктуризации; не пробрасывается `AbortSignal` от TanStack Query; тело ошибки теряется; `as Promise<T>` после `await` лишнее; `.json()` упадёт на `204`; нет типа `ImportMetaEnv` для `VITE_API_URL` (при пустой переменной запросы уйдут на `undefinedCities`); `init` на самом деле — query-строка.

**17. Обработка ошибок.**
`errorBox` показывает только ошибку **городов**; ошибки ресторанов и блюд нигде не отображаются; `isErrorDismissed` не сбрасывается, и вторая ошибка после закрытия первой не появится. На `OrderPage` нет состояний загрузки/ошибки/пусто. В `LocationSection` условие `disabled={citiesLoad && !error}` (стр. 38) использует `error` — это объект ошибок валидации, который из `FiltersPage` всегда `{}` (истинное значение), поэтому условие никогда не срабатывает и `<select>` не блокируется на время загрузки; вероятно, имелась в виду ошибка загрузки городов.

**18. Тема — не хватает нескольких деталей.**
- Первый кадр: пока не выполнился JS, `data-theme` не задан, действует тёмная палитра — пользователь со светлой темой увидит вспышку тёмного фона. Лечится inline-скриптом в `index.html`.
- `localStorage` читается и пишется без `try/catch` (в приватном режиме Safari или при заблокированных данных выбросит исключение и уронит приложение при импорте стора).
- `initialTheme()` вызывается в инициализаторе стора — побочный эффект (запись в DOM) при импорте модуля.
- Не учитывается `prefers-color-scheme` (всегда стартует `dark`), не задан CSS-`color-scheme` (нативные элементы: скроллбары, выпадающие списки — не следуют теме), нет `<meta name="theme-color">`.
- Тип `themeType` в camelCase (должен быть `ThemeType`).
- Блоки палитр в `global.scss` записаны отступом в 2 пробела при `tabWidth: 4`; селектор `:root` встречается дважды.

**19. Роутинг.**
Нет `*`-маршрута. `/dishlist/:id` с неизвестным id даёт страницу с пустым заголовком (`order?.name` → `undefined`). Прямой заход на `/dishlist` или `/dishlist/:id` (например, после F5) — стор пуст, `addressId === ''`, запрос отключён, экран без данных и без редиректа на `/filters`.

**20. Тулинг.**
- ESLint падает (п. 13); `'@typescript-eslint/no-unused-vars': 'off'` скрывает мёртвый код;
- `eslint-plugin-prettier` и `eslint-config-prettier` установлены, но **не подключены** в `eslint.config.js`; `prettier --check` падает на 14 файлах (новые SCSS написаны с отступом 2 при `tabWidth: 4`);
- плагин `react` импортирован, ни одного его правила не включено;
- `npm run build` не вызывает `tsc` и `lint` — Vercel соберёт проект с любыми ошибками типов;
- Vite 8 предупреждает: `vite-tsconfig-paths` больше не нужен (`resolve.tsconfigPaths: true`);
- имя пакета `restaraunt_site` (опечатка); `README.md` — шаблон Vite; тестов нет; Stylelint нет.

**21. Типизация и именование.**
`getAllDishes(data: object)` и `dishesQueryParams({ filters: object })` — нужен тип `OptimizeRequest`; интерфейс `Location` перекрывает глобальный DOM-тип; `preferencesData` (тип в camelCase); функция `PreferencesToAPI` в PascalCase; `discountType: number | null` — значения (1, 2 в моках) нигде не описаны; тип `Order` смешивает API-модель и модель для UI.

**22. Стиль импортов.**
7 импортов с расширением `.js` для `.tsx`-файлов (`main.tsx`, `App.tsx`, `FiltersPage.tsx`) вперемешку с импортами без расширения — в том же `App.tsx`. В `Header.tsx` логотип импортируется относительным путём `../../../shared/...` вместо `@/shared/...`. Экспорты: `Modal`/`AboutModal` — именованные, остальные компоненты — `default`.

### 🟡 Доступность (a11y)

- **`global.scss:105, 113` — `outline: none` для `input`, `textarea`, `select` (в том числе при `:focus`)**: индикатор клавиатурного фокуса убран глобально (WCAG 2.4.7). В сочетании с тем, что нативные чекбоксы скрыты (`display: none`, `Filters.module.scss`), выбор режимов/категорий недоступен с клавиатуры.
- `Header.tsx:38–48` — «О проекте» и «Избранное» это `<a>` без `href` с `onClick`: не получают фокус, не активируются клавишей Enter; нужны `<button>`.
- `Order.tsx` — карточка заказа это `<div onClick>` без `role`/`tabIndex`/обработки клавиш.
- `LikeBtn` — нет `aria-label` и `aria-pressed`.
- `BackBtn` на ширине ≤ 1100 px — только иконка без доступного имени (см. п. 11).
- `Header.tsx` — `aria-label="Открыть меню"` всегда, даже при открытом; нет `aria-expanded`; `<nav>` без `aria-label`; `alt="Feature One/Two/Three"` на главной бессмысленны (иконки декоративные → `alt=""`).
- `BudgetSection` — `<label>` без `htmlFor`/`id`, слайдер без `aria-valuetext`.
- **Контраст** (WCAG AA — не ниже 4.5:1 для обычного текста):

| Тема | Пара | Контраст |
|---|---|---|
| тёмная | светлый текст на `--color-green-lighter` (кнопка «Далее») | **1.58** |
| тёмная | светлый текст на `--color-main-green` (главная кнопка, выбранные чипы, номер активного заказа) | **2.07** |
| тёмная | `#fff` на `--color-main-green` (бейдж шага, `FiltersPage.module.scss:46`) | 2.28 |
| светлая | тёмный текст на `--color-main-green` | 5.39 ✅ |
| светлая | тёмный текст на `--color-green-lighter` | 7.79 ✅ |
| светлая | `#fff` на `--color-main-green` (бейдж шага) | 3.30 |
| светлая | `--color-option-text` на `--color-bg` | 4.55 (на грани) |

  В тёмной теме на зелёные фоны нужен тёмный текст (`--color-bg`), как уже сделано в светлой.

### ⚪ Мелочи

- Валюта: в карточке заказа цена выводится как `{totalPrice} $` (`Order.tsx:32, 37`), тогда как везде в интерфейсе рубли.
- Опечатки: «Каллорийность» (`Order.tsx:30`), «загрука ресторанов» (`LocationSection.tsx`), «количество вариантов заказа» с маленькой буквы (`BudgetSection`).
- `BudgetSection`: левая подпись слайдера «500 ₽», а `min="100"`; значение бюджета выводится без «₽»; проверка `value >= 0 && value <= 10000` избыточна; числа 100/10000/20 не вынесены в константы.
- `OrderPage.tsx:213` — `mockOrders.map((key, item) => …)`: переменные названы наоборот (`key` — заказ, `item` — индекс), и индекс используется как `key`.
- `Header.tsx` — `setAboutModalOpen(!aboutModalOpen)` лучше в функциональной форме; переносы строки внутри шаблонной строки `className` (стр. 28–29); пустая строка внутри атрибутов кнопки (стр. 65).
- Версия «0.1.0» захардкожена в `aboutModal.tsx`, тогда как `package.json` — `0.0.0`.
- `FiltersPage.module.scss:157` — `margin: 0 350px` от 1100 px оставляет ~400 px под содержимое: уже лучше, чем при прежнем брейкпоинте 800, но всё ещё тесно на 1100–1300 px.
- Шрифты: Inter (обычный + italic) — ~1.8 МБ TTF; **italic нигде не используется**; нет `font-display: swap`. Лучше woff2 + subset (latin + cyrillic).
- 6 из 30 CSS-переменных не используются (`--color-green-hover`, `--color-rating`, `--text-2xl`, `--weight-medium/semibold/extrabold`).
- `.gitignore`: последняя строка `update.bat` без перевода строки. (Сам `update.bat` в истории безобидный — `git pull` и `docker compose` — и уже удалён.)
- `index.html`: `lang="en"` при русском контенте; нет favicon.
- `new QueryClient()` без настроек: список городов имеет смысл кэшировать (`staleTime`), сейчас он перезапрашивается при каждом фокусе окна.
- Нет `prefers-reduced-motion` для hover-анимаций.

### ✅ Что уже хорошо / исправлено относительно `main`

- Работающая светлая/тёмная тема с сохранением в `localStorage` (в `main` переключатель менял только иконку).
- Валидный `<meta name="description">` в `index.html`.
- Единый брейкпоинт 1100 px во всём CSS.
- `strict: true`, `tsc` и сборка чистые.
- Паттерн `queryOptions` + отдельные `queryParams.ts`, `enabled` для зависимых запросов.
- Zustand: подписка селекторами, иммутабельные обновления.
- `Record<Category, string>` — компилятор гарантирует полноту маппинга.
- `Modal`: портал, Esc, оверлей, блокировка прокрутки, `role="dialog"`, `aria-modal`.
- `disabled`-состояния у счётчиков и чипов.
- Токены в CSS-переменных, CSS Modules, mobile-first.

### Рекомендуемый порядок исправления
1. Пп. 1, 2, 4, 5, 6, 7 — реальные баги и деплой → 2. Пп. 3, 8, 19 — подключить реальные данные и роутинг → 3. Пп. 10, 11, 12 (адаптив на CSS, `BackBtn`, счётчики) → 4. Тулинг (п. 20: чинить ESLint, подключить Prettier, `tsc` в `build`) — чтобы проверки начали ловить то, что сейчас пропускают → 5. `Modal` (п. 13) и тема (п. 18) → 6. FSD-рефакторинг и `httpClient` (пп. 14–16) → 7. a11y и контраст → 8. Мелочи.

---

## 12. Чек-лист ручной проверки

**Деплой**
- [ ] `VITE_API_URL` в Vercel указывает на реальный HTTPS-бэкенд, а не на `localhost`.
- [ ] F5 на `/filters`, `/dishlist`, `/dishlist/1` не даёт 404.
- [ ] CORS на бэкенде разрешает домен фронта.
- [ ] GitHub → Settings → Branches: ветка по умолчанию — та, которую деплоит Vercel.

**Мастер фильтров**
- [ ] Список городов загружается; при недоступном бэке — красная плашка, её можно закрыть; проверить ответы 404 и 503 (не только 500).
- [ ] «Далее» на шаге 1 без выбора показывает 3 ошибки; смена города/ресторана сбрасывает нижние поля.
- [ ] Слайдер двигается по 100; счётчики: одиночный клик = ±1, удержание = быстрое изменение, клавиатура (Tab → Enter) работает (сейчас — нет), на границах кнопка блокируется, после отпускания на границе счёт не «бежит».
- [ ] 3 человека на шаге «Бюджет» → на шаге «Категории» видны все 3 (сейчас — нет).
- [ ] Категория, исключённая первой, не выбирается желаемой (сейчас можно).
- [ ] «Подтвердить» ведёт на `/dishlist`.

**Заказы**
- [ ] В Network: `POST Orders/optimize` — корректные `restaurantId`, `budget`, `peoplePreferences` (по числу людей), `variantsCount`; значения категорий английские.
- [ ] Число «Найдено N» совпадает с числом карточек (сейчас — нет: карточки из моков).
- [ ] Клик по карточке открывает `/dishlist/:id`; «назад» возвращает на список, карточка подсвечена.
- [ ] Прямой заход на `/dishlist` и `/dishlist/999` — понятный экран, а не пустой.

**Тема и адаптив**
- [ ] Переключение темы сохраняется после F5, нет вспышки тёмного фона при светлой теме.
- [ ] Ширины 375, 768, **800, 1000, 1099, 1100, 1101**, 1440: нет скачков вёрстки, на ровно 1100 px видны цена в карточке и заголовок заказа.
- [ ] Бургер-меню открывается/закрывается; «О проекте» открывает окно, закрывается по Esc, по оверлею и по крестику.
- [ ] Tab-навигация: виден фокус на всех интерактивных элементах.
