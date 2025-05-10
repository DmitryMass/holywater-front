# Структура API для билдера главного экрана

## Введение

В данном документе описывается структура API для взаимодействия фронтенда административной панели билдера с бэкендом. На текущем этапе API будет реализовано в виде заглушек (моков) на фронтенде, которые в дальнейшем будут заменены на реальные запросы к бэкенду.

## Базовые эндпоинты

### Конфигурации экрана

#### Получение списка конфигураций

```
GET /api/screen-configs
```

**Ответ:**

```json
{
  "success": true,
  "data": [
    {
      "id": "config1",
      "name": "Главный экран 1",
      "createdAt": "2023-06-15T10:30:00Z",
      "updatedAt": "2023-06-16T14:20:00Z"
    },
    {
      "id": "config2",
      "name": "Главный экран 2",
      "createdAt": "2023-06-17T09:15:00Z",
      "updatedAt": "2023-06-17T09:15:00Z"
    }
  ]
}
```

#### Получение конкретной конфигурации

```
GET /api/screen-configs/:id
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "id": "config1",
    "name": "Главный экран 1",
    "sections": [
      {
        "id": "section1",
        "type": "banner",
        "title": "Главный баннер",
        "items": [
          {
            "id": "item1",
            "type": "image",
            "content": {
              "title": "Акция",
              "subtitle": "Специальное предложение",
              "imageUrl": "https://example.com/banner-image.jpg",
              "actionUrl": "app://special-offer"
            }
          }
        ],
        "settings": {
          "backgroundColor": "#ffffff",
          "padding": "10px"
        }
      },
      {
        "id": "section2",
        "type": "horizontalList",
        "title": "Популярные товары",
        "items": [
          {
            "id": "item2",
            "type": "product",
            "content": {
              "title": "Продукт 1",
              "imageUrl": "https://example.com/product1.jpg",
              "actionUrl": "app://product/1"
            }
          },
          {
            "id": "item3",
            "type": "product",
            "content": {
              "title": "Продукт 2",
              "imageUrl": "https://example.com/product2.jpg",
              "actionUrl": "app://product/2"
            }
          }
        ],
        "settings": {
          "backgroundColor": "#f5f5f5",
          "padding": "15px"
        }
      }
    ],
    "createdAt": "2023-06-15T10:30:00Z",
    "updatedAt": "2023-06-16T14:20:00Z"
  }
}
```

#### Создание новой конфигурации

```
POST /api/screen-configs
```

**Тело запроса:**

```json
{
  "name": "Новый главный экран",
  "sections": []
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "id": "newConfigId",
    "name": "Новый главный экран",
    "sections": [],
    "createdAt": "2023-06-18T11:30:00Z",
    "updatedAt": "2023-06-18T11:30:00Z"
  }
}
```

#### Обновление существующей конфигурации

```
PUT /api/screen-configs/:id
```

**Тело запроса:**

```json
{
  "name": "Обновленный главный экран",
  "sections": [
    {
      "id": "section1",
      "type": "banner",
      "title": "Новый баннер",
      "items": [
        {
          "id": "item1",
          "type": "image",
          "content": {
            "title": "Новая акция",
            "subtitle": "Новое предложение",
            "imageUrl": "https://example.com/new-banner.jpg",
            "actionUrl": "app://new-offer"
          }
        }
      ],
      "settings": {
        "backgroundColor": "#f9f9f9",
        "padding": "12px"
      }
    }
  ]
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "id": "config1",
    "name": "Обновленный главный экран",
    "sections": [
      {
        "id": "section1",
        "type": "banner",
        "title": "Новый баннер",
        "items": [
          {
            "id": "item1",
            "type": "image",
            "content": {
              "title": "Новая акция",
              "subtitle": "Новое предложение",
              "imageUrl": "https://example.com/new-banner.jpg",
              "actionUrl": "app://new-offer"
            }
          }
        ],
        "settings": {
          "backgroundColor": "#f9f9f9",
          "padding": "12px"
        }
      }
    ],
    "createdAt": "2023-06-15T10:30:00Z",
    "updatedAt": "2023-06-18T12:45:00Z"
  }
}
```

#### Удаление конфигурации

```
DELETE /api/screen-configs/:id
```

**Ответ:**

```json
{
  "success": true,
  "message": "Конфигурация успешно удалена"
}
```

## Реализация заглушек API

Для текущего этапа разработки мы реализуем эти API в виде заглушек на фронтенде. Заглушки будут эмулировать работу с сервером, включая задержки и обработку ошибок.

### Пример реализации заглушки для получения списка конфигураций

```typescript
// src/services/api/mockApi.ts
import { ScreenConfig } from '../../types';

// Мок данных для хранения конфигураций
let mockConfigs: ScreenConfig[] = [
  {
    id: 'config1',
    name: 'Главный экран 1',
    sections: [
      // ... секции
    ],
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-16T14:20:00Z',
  },
  // ... другие конфигурации
];

// Имитация задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getScreenConfigs = async () => {
  try {
    // Имитация сетевой задержки
    await delay(300);

    return {
      success: true,
      data: mockConfigs.map((config) => ({
        id: config.id,
        name: config.name,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось получить список конфигураций',
    };
  }
};

// ... другие методы API
```

## Интеграция API с реальным бэкендом

В будущем, когда бэкенд будет реализован, мы заменим заглушки на реальные запросы API. Для этого мы будем использовать axios для выполнения HTTP-запросов.

### Пример реализации с реальным API

```typescript
// src/services/api/api.ts
import axios from 'axios';

import { ScreenConfig } from '../../types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getScreenConfigs = async () => {
  try {
    const response = await api.get('/screen-configs');
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: 'Не удалось получить список конфигураций',
    };
  }
};

// ... другие методы API
```

## Обработка ошибок

Все методы API должны включать обработку ошибок и возвращать согласованную структуру ответа. В случае ошибки, ответ должен содержать флаг `success: false` и сообщение об ошибке.

## Типы данных

### ScreenConfig

```typescript
interface ScreenConfig {
  id: string;
  name: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
```

### Section

```typescript
interface Section {
  id: string;
  type: 'banner' | 'verticalList' | 'horizontalList' | 'tabs' | 'grid';
  title?: string;
  items: Item[];
  settings?: SectionSettings;
}
```

### Item

```typescript
interface Item {
  id: string;
  type: 'image' | 'text' | 'button' | 'product' | 'category';
  content: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    actionUrl?: string;
    // Другие свойства в зависимости от типа
  };
}
```

### SectionSettings

```typescript
interface SectionSettings {
  backgroundColor?: string;
  padding?: string;
  // Другие возможные настройки
}
```
