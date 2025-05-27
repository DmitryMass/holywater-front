# Документація по тестуванню

## Структура тестів

Тести організовані за наступною структурою:

```
src/
├── __tests__/
│   ├── setup.ts                    # Налаштування Jest
│   ├── __mocks__/
│   │   └── fileMock.js            # Мок для статичних файлів
│   ├── fixtures/                   # Тестові дані
│   │   └── screenConfigFixtures.ts
│   ├── utils/                      # Утиліти для тестування
│   │   └── testUtils.ts
│   ├── integration/                # Інтеграційні тести
│   │   ├── screenConfigCreation.test.ts
│   │   └── jsonValidation.test.ts
│   └── performance/                # Тести продуктивності
│       ├── largeJsonHandling.test.ts
│       └── jsonBenchmarks.test.ts
├── utils/__tests__/               # Тести утиліт
│   ├── screenConfigUtils.test.ts
│   ├── sectionUtils.test.ts
│   └── itemUtils.test.ts
├── hooks/__tests__/               # Тести хуків
│   ├── useScreenConfig.test.ts
│   └── useScreenConfigApi.test.ts
├── services/api/__tests__/        # Тести API сервісів
│   ├── screenConfigApi.test.ts
│   └── dataTransformation.test.ts
└── components/builder/__tests__/  # Тести компонентів
    ├── JsonPreview.test.tsx
    └── PropertyPanel.test.tsx
```

## Запуск тестів

### Основні команди

```bash
# Запуск всіх тестів
npm test

# Запуск тестів у режимі спостереження
npm run test:watch

# Запуск тестів з покриттям коду
npm run test:coverage

# Запуск тестів для CI/CD
npm run test:ci
```

### Запуск конкретних тестів

```bash
# Тести утиліт
npm test -- utils

# Тести хуків
npm test -- hooks

# Тести API
npm test -- services

# Тести компонентів
npm test -- components

# Конкретний тестовий файл
npm test -- screenConfigUtils.test.ts
```

## Тестові сценарії

### 1. Тестування JSON створення

#### Утиліти створення структур

- Створення базових ScreenConfig, Section, Item
- Валідація обов'язкових полів
- Серіалізація/десеріалізація JSON
- Обробка спеціальних символів

#### Хуки для роботи з JSON

- `useScreenConfig.getJsonRepresentation()`
- Оновлення JSON при змінах конфігурації
- Валідація структури JSON
- Обробка великих JSON структур

#### API сервіси

- Трансформація даних перед відправкою
- Серіалізація для HTTP запитів
- Десеріалізація відповідей сервера
- Обробка помилок API

### 2. Інтеграційні тести

#### Повний цикл створення конфігурації

- Створення ScreenConfig з нуля
- Додавання різних типів секцій та елементів
- Серіалізація фінальної структури
- Відправка на сервер (мокована)

#### Валідація JSON структур

- Перевірка обов'язкових полів
- Валідація типів даних
- Перевірка вкладених структур
- Валідація enum значень

### 3. Тести продуктивності

#### Великі JSON структури

- Серіалізація конфігурацій з 100+ секціями
- Десеріалізація великих JSON
- Тестування пам'яті

#### Бенчмарки

- Швидкість створення ScreenConfig
- Швидкість серіалізації JSON
- Порівняння різних підходів

## Мок дані

### Фікстури

```typescript
// Базова ScreenConfig
const mockScreenConfig: ScreenConfig = {
  _id: 'test-id',
  name: 'Test Configuration',
  sections: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  isActive: false,
  version: 1,
};

// Секція з елементами
const mockSection: Section = {
  id: 'section-1',
  type: 'banner',
  title: 'Test Section',
  items: [mockItem],
  settings: {
    backgroundColor: '#ffffff',
    padding: '15px',
  },
};
```

### Утиліти створення тестових даних

```typescript
// Створення мок ScreenConfig
const config = createMockScreenConfig({
  name: 'Custom Name',
  isActive: true,
});

// Створення мок Section
const section = createMockSection({
  type: 'grid',
  title: 'Grid Section',
});

// Створення мок Item
const item = createMockItem({
  type: 'product',
  content: { title: 'Product Title' },
});
```

## Налаштування

### Jest конфігурація

Основні налаштування в `jest.config.js`:

- **testEnvironment**: `jsdom` для React компонентів
- **preset**: `ts-jest` для TypeScript підтримки
- **moduleNameMapping**: Алісі шляхів (@/, @components/, тощо)
- **setupFilesAfterEnv**: Setup файл з мокуванням глобальних об'єктів
- **coverageThreshold**: Мінімум 70% покриття коду

### Setup файл

`src/__tests__/setup.ts` містить:

- Імпорт `@testing-library/jest-dom`
- Мокування `matchMedia`, `ResizeObserver`, `IntersectionObserver`
- Мокування `navigator.clipboard`
- Налаштування console методів для тестів

## Приклади використання

### Тестування JSON серіалізації

```typescript
it('повинен серіалізувати ScreenConfig в валідний JSON', () => {
  const config = createMockScreenConfig();
  const jsonString = JSON.stringify(config);

  expect(() => JSON.parse(jsonString)).not.toThrow();

  const parsedConfig = JSON.parse(jsonString);
  expect(parsedConfig).toEqual(config);
});
```

### Тестування хука з JSON операціями

```typescript
it('повинен оновлювати JSON після додавання секції', () => {
  const { result } = renderHook(() => useScreenConfig(mockConfig));

  act(() => {
    result.current.addSection('grid', 'New Section');
  });

  const jsonString = result.current.getJsonRepresentation();
  const parsedConfig = JSON.parse(jsonString);

  expect(parsedConfig.sections).toHaveLength(1);
  expect(parsedConfig.sections[0].type).toBe('grid');
});
```

### Тестування API з мокуванням

```typescript
it('повинен відправити валідний JSON на сервер', async () => {
  const mockAxios = jest.mocked(axios);
  mockAxios.post.mockResolvedValue({ data: { success: true } });

  const config = createMockScreenConfig();
  await createScreenConfig(config);

  expect(mockAxios.post).toHaveBeenCalledWith(
    '/screen-configs',
    expect.objectContaining({
      name: config.name,
      sections: config.sections,
    })
  );
});
```

## Критерії якості

### Покриття коду

- Мінімум 70% покриття для всіх метрик
- 100% покриття для критичних JSON операцій
- Покриття всіх edge cases

### Якість тестів

- Кожен тест перевіряє одну конкретну функціональність
- Використання описових назв тестів
- Proper setup та cleanup
- Мокування зовнішніх залежностей

### Продуктивність

- Тести виконуються швидко (< 10 секунд для всього набору)
- Ефективне використання пам'яті
- Паралельне виконання тестів

## Troubleshooting

### Поширені проблеми

1. **Помилки з алісами шляхів**

   - Перевірте `moduleNameMapping` в `jest.config.js`
   - Переконайтеся, що `tsconfig.json` містить правильні paths

2. **Проблеми з мокуванням**

   - Використовуйте `jest.mocked()` для типізованих моків
   - Очищайте моки між тестами з `clearMocks: true`

3. **Помилки з React компонентами**

   - Переконайтеся, що використовується `jsdom` environment
   - Імпортуйте `@testing-library/jest-dom` в setup файлі

4. **Проблеми з async операціями**
   - Використовуйте `act()` для оновлень стану
   - Дочекайтеся завершення async операцій з `await`
