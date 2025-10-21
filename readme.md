# String Analyzer API

A backend API built with Node.js, Express, and Prisma ORM, designed to analyze strings and store their computed properties such as length, palindrome check, word count, and more. It also supports natural language filtering, allowing users to query analyzed strings using human-readable phrases.

---

## Features

- **String Analysis** – Analyze and persist string properties
- **Duplicate Prevention** – Prevent re-analyzing already stored strings
- **Filtering & Querying** – Retrieve strings by length, palindrome status, or content
- **Natural Language Querying** – Query strings using phrases like:
  - _"all single word palindromic strings"_
  - _"strings longer than 10 characters"_
  - _"palindromic strings containing the letter z"_
- **RESTful Endpoints** – Clean and predictable structure
- **Error Handling** – Proper status codes (400, 404, 409, 422)

---

## Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – Web framework
- **Prisma ORM** – Database ORM
- **SQLite / PostgreSQL** – Database (any Prisma-supported DB works)
- **TypeScript** – Type-safe backend development

---

## Project Structure

```
backend-wizards-stage1/
│
├── src/
│   ├── controllers/
│   │   └── analyzeStringController.ts
│   ├── routes/
│   │   └── analyzeStringApi.ts
│   ├── utils/
│   │   └── nplParser.ts
│   ├── interfaces/
│   │   └── interface.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── package.json
├── .env
└── README.md
```

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/backend-wizards-stage1.git
cd backend-wizards-stage1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# For SQLite
DATABASE_URL="file:./dev.db"

# Or for PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/stringdb"

PORT=3000
```

### 4. Initialize Database

```bash
npx prisma migrate dev --name init
```

### 5. Start the Server

```bash
npm run dev
```

Server runs on: **http://localhost:3000**

---

## API Documentation

### 1. Create & Analyze String

**Endpoint:** `POST /strings`

#### Request

```json
{
  "value": "string to analyze"
}
```

#### Success Response (201 Created)

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```

#### Error Codes

- `400` – Missing or invalid value
- `409` – String already exists
- `422` – Invalid data type

---

### 2. Get Specific String

**Endpoint:** `GET /strings/{string_value}`

#### Success Response (200 OK)

```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 2,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "r": 3,
      "e": 3,
      "q": 1
    }
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```

#### Error

- `404` – String not found

---

### 3. Get All Strings (Filterable)

**Endpoint:** `GET /strings`

#### Query Parameters

- `is_palindrome` (boolean)
- `min_length` (number)
- `max_length` (number)
- `word_count` (number)
- `contains_character` (string)

#### Example Request

```
GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a
```

#### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "example string",
      "properties": { ... },
      "created_at": "2025-10-21T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

#### Error

- `400` – Invalid query parameters

---

### 4. Natural Language Filtering

**Endpoint:** `GET /strings/filter-by-natural-language`

#### Query Parameters

- `query` (string) – Natural language query

#### Example Queries

| Natural Language Query | Interpreted Filters |
|------------------------|---------------------|
| all single word palindromic strings | `{ word_count: 1, is_palindrome: true }` |
| strings longer than 10 characters | `{ min_length: 11 }` |
| strings containing the letter z | `{ contains_character: 'z' }` |
| palindromic strings that contain the first vowel | `{ is_palindrome: true, contains_character: 'a' }` |

#### Example Request

```
GET /strings/filter-by-natural-language?query=all single word palindromic strings
```

#### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "kayak",
      "properties": { ... },
      "created_at": "2025-10-21T10:00:00Z"
    }
  ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

#### Error Codes

- `400` – Unable to parse natural language query
- `422` – Conflicting filters (e.g., min_length > max_length)
- `404` – No results found

---

### 5. Delete String

**Endpoint:** `DELETE /strings/{string_value}`

#### Success Response (204 No Content)

_Empty response body_

#### Error

- `404` – String not found

---

## Testing the API

You can test the API using:

- **Postman**
- **cURL**
- **Thunder Client** (VSCode extension)

### Example cURL Request

```bash
curl -X POST http://localhost:3000/strings \
     -H "Content-Type: application/json" \
     -d '{"value": "kayak"}'
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Prisma database connection URL | `file:./dev.db` or `postgresql://user:pass@localhost:5432/db` |
| `PORT` | Application port | `3000` |

---

## Prisma Schema Example

```prisma
model PostAnalyzedString {
  id                      String   @id @default(cuid())
  value                   String   @unique
  length                  Int
  is_palindrome           Boolean
  unique_characters       Int
  word_count              Int
  sha256_hash             String   @unique
  character_frequency_map Json
  created_at              DateTime @default(now())
  updated_at              DateTime @updatedAt

  @@index([is_palindrome])
  @@index([length])
  @@index([word_count])
  @@index([sha256_hash])
}
```

---

## Deployment

Used Railway for hosting
---

**Built with ❤️ using Node.js, Express, and Prisma**