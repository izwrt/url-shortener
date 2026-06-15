# System Design: URL Shortener

## 1. High-Level Design (HLD)

* **Shortening:** The system must take a long URL and generate a unique, random 6-character alias.
* **Redirection:** When a user visits the short alias, the system must issue an HTTP 301 redirect to the original long URL.
* **Authentication:** Users must be logged in to generate short links.
* **UX Flow:** Unauthenticated users can paste a link on the homepage, but clicking "Shorten" will prompt them to log in/sign up before the link is generated.
* **Analytics:** The system must track the total number of clicks for each short link.
* **Isolation:** If two different users submit the exact same long URL, they must receive different short aliases so their analytics remain separate.

### 1.2 Non-Functional Requirements

* **High Availability:** The redirection service must be extremely fast and highly available.
* **Unpredictability:** Short codes must be randomly generated to prevent competitors from scraping sequential links.

### 1.3 System Architecture

* **Frontend:** React (Vite) + TypeScript
* **Backend:** Node.js + Express
* **Database:** PostgreSQL (Relational DB is chosen to enforce strict schemas and foreign key relationships between Users and URLs).
* **ORM:** Drizzle ORM

### 1.4 Core Data Flow (The Redirect)

1. Client makes `GET /:shortCode` request to the Express server.
2. Server queries PostgreSQL for the `shortCode`.
3. If found, server increments the `clicks` counter by 1.
4. Server responds with `HTTP 301 Moved Permanently` and the `longUrl` in the Location header.
5. Client browser automatically redirects to the destination.
