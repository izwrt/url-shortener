# System Design: URL Shortener

## 1. High-Level Design (HLD)

### 1.1 Functional Requirements

* **Shortening:** The system must take a long URL and generate a unique, random 6-character alias.
* **Redirection:** When a user visits the short alias, the system must issue an HTTP 301 redirect to the original long URL.
* **Authentication:** Users must be logged in to generate short links.
* **UX Flow:** Unauthenticated users can paste a link on the homepage, but clicking "Shorten" will prompt them to log in/sign up before the link is generated.
* **Analytics:** The system must track the total number of clicks for each short link.
* **Management:** Users can delete their own shortened URLs from their dashboard.
* **Isolation:** If two different users submit the exact same long URL, they must receive different short aliases so their analytics remain separate.

### 1.2 Non-Functional Requirements

* **High Availability:** The redirection service must be extremely fast and highly available.
* **Unpredictability:** Short codes must be randomly generated to prevent competitors from scraping sequential links.

### 1.3 System Architecture

* **Frontend:** React (Vite) + TypeScript
* **Backend:** Node.js + Express
* **Database:** PostgreSQL (Running locally via Docker Compose. Relational DB is chosen to enforce strict schemas and foreign key relationships between Users and URLs).
* **ORM:** Drizzle ORM
* **Containerization:** Docker

### 1.4 Core Data Flow (The Redirect)

1. Client makes `GET /:shortCode` request to the Express server.
2. Server queries PostgreSQL for the `shortCode`.
3. If found, server increments the `clicks` counter by 1.
4. Server responds with `HTTP 301 Moved Permanently` and the `longUrl` in the Location header.
5. Client browser automatically redirects to the destination.

## 1.5 Security Policy

1. Password Policy: Based on modern NIST-aligned guidance, the system prioritizes password length over forced complexity.
2. Standard: Minimum length of 12 characters, no forced special character requirements (to discourage predictable patterns), and a server-side check against known leaked password databases.
3. Oauth sign using google.

## 2. Low-Level Design (LLD)

### 2.1 Database Schema (PostgreSQL)

**Table: `users`**

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the user |
| `firstName` | VARCHAR | Not Null | User's display first name |
| `lastName` | VARCHAR | Nullable | User's display last name |
| `email` | VARCHAR | Not Null, Unique | User's email address |
| `password` | TEXT | Not Null | Hashed password |
| `salt` | TEXT | Not Null | Random salt used for hashing |
| `createdAt` | TIMESTAMP | Default NOW() | Account creation date |

**Table: `urls`**

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique identifier for the URL record |
| `shortCode` | VARCHAR(7) | Not Null, Unique | The generated random alias (e.g., 'x7B9aQ') |
| `longUrl` | TEXT | Not Null | The original destination URL |
| `userId` | UUID | Not Null, Foreign Key | Links to `users.id` (Owner of the URL) |
| `clicks` | INTEGER | Not Null, Default 0 | Analytics counter for visits |
| `createdAt` | TIMESTAMP | Default NOW() | When the short link was generated |

### 2.2 API Contracts

#### 1. Create Short URL

* **Method:** `POST`
* **Endpoint:** `/api/urls`
* **Auth Required:** Yes (JWT)
* **Request Body:**

    ```json
    {
      "longUrl": "https://www.example.com/very/long/path"
    }
    ```

* **Response (201 Created):**

    ```json
    {
      "id": "uuid-123",
      "shortCode": "x7B9aQ",
      "longUrl": "https://www.example.com/very/long/path",
      "clicks": 0
    }
    ```

#### 2. Get User's URLs (Dashboard)

* **Method:** `GET`
* **Endpoint:** `/api/urls`
* **Auth Required:** Yes (JWT)
* **Request Body:** None
* **Response (200 OK):**

    ```json
    [
      {
        "id": "uuid-123",
        "shortCode": "x7B9aQ",
        "longUrl": "https://www.example.com/very/long/path",
        "clicks": 42,
        "createdAt": "2026-06-15T10:00:00Z"
      }
    ]
    ```

#### 3. Redirect to Long URL

* **Method:** `GET`
* **Endpoint:** `/:shortCode`
* **Auth Required:** No (Public)
* **Request Body:** None
* **Response (301 Moved Permanently):**
  * *Headers:* `Location: <longUrl>`
  * *Action:* Increments `clicks` counter in DB by 1 before redirecting.

#### 4. Delete Short URL

* **Method:** `DELETE`
* **Endpoint:** `/api/urls/:id`
* **Auth Required:** Yes (JWT)
* **Request Body:** None
* **Response (200 OK):**

    ```json
    {
      "message": "URL successfully deleted"
    }
    ```

  * *Security Check:* The server must verify that the `userId` of the URL matches the `id` of the currently authenticated user before deleting.
  * *Password: Must be a string, min 12 characters, max 64 characters. (Validation enforced via Zod; rejects common/breached passwords).

### 2.3 Core Algorithms

**Short Code Generation & Collision Handling:**

1. Receive `longUrl` from authenticated user.
2. Generate a random 7-character alphanumeric string using the `nanoid` library.
3. Attempt to `INSERT` into the `urls` table.
4. If the database throws a `Unique Constraint Violation` (meaning the code already exists), catch the error, generate a new code, and retry the insert.
5. Return the successful `shortCode` to the user.
