# Refugio del Lago Camping Service API

Backend API for a full-stack campground and lakefront accommodation management system. The project supports public accommodation discovery, authenticated reservations, admin booking management, accommodation CRUD, booking status workflows, image-backed accommodations, availability validation, and automated tests for the core reservation rules.

Frontend repository: [campingServiceFront](https://github.com/agustinmota/campingServiceFront)

Backend repository: [campingService](https://github.com/agustinmota/campingService)

## Table of Contents

- [Project Summary](#project-summary)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Booking Status Flow](#booking-status-flow)
- [Access Control](#access-control)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database and Seed Data](#database-and-seed-data)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Recommended Demo Flow](#recommended-demo-flow)
- [Project Structure](#project-structure)
- [Frontend Integration](#frontend-integration)
- [Security Notes](#security-notes)
- [Known Technical Debt](#known-technical-debt)
- [Portfolio Roadmap](#portfolio-roadmap)

## Project Summary

Refugio del Lago is a reservation platform for cabins and campsites. The backend exposes a REST API used by a React/Vite frontend with Redux state management. The system is designed around a real accommodation workflow:

- Guests can browse cabins and campsites.
- Users can create an account and make reservations.
- Admins can manage accommodations, bookings, booking statuses, and operational analytics.
- The backend validates capacity and date conflicts before a booking is created.
- Booking statuses allow admins to move stays through a realistic operation flow.

The goal of this project is to demonstrate a practical full-stack application with business rules, authentication, relational data, admin tooling, frontend/backend separation, and test coverage for critical reservation behavior.

## Main Features

### Public User Experience

- Browse cabins and campsites.
- View accommodation photos, capacity, price, and descriptions.
- Search available stays by:
  - Check-in date
  - Check-out date
  - Accommodation type
  - Number of guests
- Create a user account.
- Log in and reserve an accommodation.
- View personal bookings from the public home page.

### Admin Experience

- Admin-only dashboard.
- Accommodation management for cabins and campsites.
- Create, edit, and delete accommodations.
- Upload accommodation photos through the frontend.
- Manage booking status flow.
- Filter bookings by:
  - Status
  - Holder name
  - Accommodation
  - Date
- Calendar view with booking status colors.
- Analytics summary with:
  - Monthly revenue
  - Occupancy rate
  - Guests this month
  - Projected revenue
  - Booking status breakdown
  - Top accommodations by revenue

### Backend Rules

- JWT authentication.
- JWT sessions expire after 1 hour.
- Role-based admin authorization.
- Reservation capacity validation.
- Date-overlap validation.
- Cancelled and checked-out bookings do not block future availability.
- Error responses expose the actual backend error message to simplify debugging during development.

## Tech Stack

### Backend

- Node.js
- Express
- Sequelize
- MySQL
- JSON Web Tokens
- bcryptjs
- date-fns
- Node built-in test runner

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Lucide React icons

## Architecture

The project is split into two repositories:

```text
campingService
  Backend API, database models, controllers, middleware, tests

campingServiceFront
  React/Vite frontend, Redux state, admin UI, public booking UI
```

High-level request flow:

```text
React frontend
  -> Axios API client
  -> Express routes
  -> Middleware validation / authentication / authorization
  -> Controllers
  -> Sequelize models
  -> MySQL database
```

## Domain Model

The API uses an accommodation abstraction so cabins and campsites can share reservation behavior while keeping their own pricing rules.

### Accommodation

Represents the base reservable unit.

Fields:

- `id`
- `type`: `cabin` or `campsite`
- `identifier`

### Cabin

Cabin-specific data.

Fields:

- `id`
- `identifier`
- `maxCapacity`
- `pricePerDay`
- `description`
- `imageUrl`

Pricing rule:

```text
total = number of nights * price per day
```

### Campsite

Campsite-specific data.

Fields:

- `id`
- `identifier`
- `maxCapacity`
- `pricePerPerson`
- `description`
- `imageUrl`

Pricing rule:

```text
total = number of nights * number of guests * price per person
```

### Guest

Represents the holder of a booking.

Fields:

- `id`
- `firstName`
- `lastName`
- `document`
- `phone`

### User

Represents an authenticated account.

Fields:

- `id`
- `username`
- `email`
- `password`
- `role`: `user` or `admin`

### Booking

Represents a reservation.

Fields:

- `id`
- `checkIn`
- `checkOut`
- `amountOfPeople`
- `totalAmount`
- `status`
- `guestId`
- `accommodationId`
- `userId`

## Booking Status Flow

Bookings support the following statuses:

```text
pending -> confirmed -> checked_in -> checked_out
                      -> cancelled
```

Supported values:

- `pending`
- `confirmed`
- `checked_in`
- `checked_out`
- `cancelled`

Availability rules:

- `pending`, `confirmed`, and `checked_in` block availability.
- `checked_out` and `cancelled` do not block availability.

New bookings are created with:

```text
status = pending
```

Admins can update booking statuses through:

```http
PUT /booking/status/:id
```

## Access Control

The backend uses JWT authentication and role-based authorization.

### Public Routes

- Create user
- Login
- List cabins
- List campsites
- Search available cabins
- Search available campsites
- View individual accommodation data

### Authenticated User Routes

- Create booking
- View own bookings

### Admin Routes

- List all bookings
- Update booking status
- Create/edit/delete cabins
- Create/edit/delete campsites
- List users
- Delete users
- Manage admin-only resources

## Getting Started

### Prerequisites

Install:

- Node.js 20 or newer recommended
- npm
- MySQL

### Clone the Backend

```bash
git clone https://github.com/agustinmota/campingService.git
cd campingService
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file in the backend root:

```env
PORT=3000
DB_NAME=camping_service
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=replace_this_with_a_secure_secret
```

### Create the Database

Create a MySQL database matching `DB_NAME`.

Example:

```sql
CREATE DATABASE camping_service;
```

### Start the Backend

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default API URL:

```text
http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port. Defaults to `3000`. |
| `DB_NAME` | Yes | MySQL database name. |
| `DB_USER` | Yes | MySQL username. |
| `DB_PASSWORD` | Yes | MySQL password. |
| `DB_HOST` | Yes | MySQL host, usually `localhost`. |
| `DB_DIALECT` | Yes | Sequelize dialect. Use `mysql`. |
| `JWT_SECRET` | Yes | Secret used to sign JWT access tokens. |

## Database and Seed Data

The project currently initializes Sequelize models and seed data when the backend starts.

Seeded data includes:

- Admin user
- Sample guests
- 5 cabins
- 7 campsites
- English descriptions
- Accommodation photos

Default admin credentials:

```text
Email: admin@e.com
Password: 1234
```

Important:

- This demo admin password is only for local development.
- Change it before deploying the app publicly.

## API Reference

Base URL:

```text
http://localhost:3000
```

### Authentication

#### Login

```http
POST /tokens/login
```

Body:

```json
{
  "email": "admin@e.com",
  "password": "1234"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@e.com",
    "role": "admin"
  }
}
```

Session duration:

```text
1 hour
```

Authenticated requests must include:

```http
Authorization: Bearer <token>
```

### Users

#### Create User

```http
POST /user/create
```

Body:

```json
{
  "username": "guest",
  "email": "guest@example.com",
  "password": "1234"
}
```

#### List Users

Admin only.

```http
GET /user/index
```

#### Show User

Admin only.

```http
GET /user/show/:id
```

#### Edit User

Authenticated.

```http
PUT /user/edit/:id
```

#### Delete User

Admin only.

```http
DELETE /user/delete/:id
```

### Cabins

#### List Cabins

```http
GET /cabin
```

#### Show Cabin

```http
GET /cabin/show/:id
```

#### Search Available Cabins

```http
GET /cabin/available?checkIn=2026-06-01&checkOut=2026-06-03&amountOfPeople=2
```

Query parameters:

- `checkIn`
- `checkOut`
- `amountOfPeople`

#### Create Cabin

Admin only.

```http
POST /cabin/create
```

Body:

```json
{
  "identifier": "A",
  "maxCapacity": 5,
  "pricePerDay": 1000,
  "description": "Cozy wooden cabin near the lake.",
  "imageUrl": "https://example.com/cabin.jpg"
}
```

#### Edit Cabin

Admin only.

```http
PUT /cabin/edit/:id
```

#### Delete Cabin

Admin only.

```http
DELETE /cabin/delete/:id
```

### Campsites

#### List Campsites

```http
GET /campsite
```

#### Show Campsite

```http
GET /campsite/show/:id
```

#### Search Available Campsites

```http
GET /campsite/available?checkIn=2026-06-01&checkOut=2026-06-03&amountOfPeople=2
```

#### Create Campsite

Admin only.

```http
POST /campsite/create
```

Body:

```json
{
  "identifier": "P1",
  "maxCapacity": 4,
  "pricePerPerson": 350,
  "description": "Shaded tent site with nearby services.",
  "imageUrl": "https://example.com/campsite.jpg"
}
```

#### Edit Campsite

Admin only.

```http
PUT /campsite/edit/:id
```

#### Delete Campsite

Admin only.

```http
DELETE /campsite/delete/:id
```

### Bookings

All booking routes require authentication.

#### Create Booking

```http
POST /booking/create
```

Body:

```json
{
  "checkIn": "2026-06-01",
  "checkOut": "2026-06-03",
  "amountOfPeople": 2,
  "accommodationId": 1,
  "firstName": "Ana",
  "lastName": "Stone",
  "document": "12345678",
  "phone": "099111111"
}
```

Behavior:

- Validates accommodation exists.
- Validates max capacity.
- Validates date conflicts.
- Creates guest holder data if `guestId` is not supplied.
- Calculates total amount.
- Creates booking with `pending` status.

#### My Bookings

```http
GET /booking/mybookings
```

Returns bookings belonging to the authenticated user.

#### List All Bookings

Admin only.

```http
GET /booking
```

#### Show Booking

Admin only.

```http
GET /booking/show/:id
```

#### Update Booking Status

Admin only.

```http
PUT /booking/status/:id
```

Body:

```json
{
  "status": "confirmed"
}
```

Valid statuses:

- `pending`
- `confirmed`
- `checked_in`
- `checked_out`
- `cancelled`

#### Edit Booking

```http
PUT /booking/edit/:id
```

#### Delete Booking

```http
DELETE /booking/delete/:id
```

### Guests

Guest routes are currently authenticated and mostly intended for admin/internal flows.

```http
GET /guest
GET /guest/show/:id
POST /guest/create
PUT /guest/edit/:id
DELETE /guest/delete/:id
```

### Accommodations

Base accommodation routes exist for internal/admin management:

```http
GET /accommodation
GET /accommodation/show/:id
POST /accommodation/create
POST /accommodation/edit/:id
DELETE /accommodation/delete/:id
```

## Error Handling

The backend returns useful error messages for debugging and frontend display.

Example:

```json
{
  "message": "Accommodation not available on these dates"
}
```

Recent improvements:

- Generic `"error"` responses were replaced with the actual `error.message`.
- Invalid status updates return a clear validation message.
- Capacity and availability validation return specific user-facing messages.

Production note:

For a public deployment, consider using environment-based error handling:

- Development: return `error.message`
- Production: return safe user-facing messages and log internal details server-side

## Testing

The backend uses Node's built-in test runner.

Run tests:

```bash
npm test
```

Current test coverage includes:

- `validateStay` allows valid bookings.
- `validateStay` rejects over-capacity bookings.
- `validateStay` rejects unavailable date ranges.
- `validateStay` returns 404 for missing accommodations.
- Booking creation creates holder guest data.
- Booking creation calculates total amount.
- Booking creation defaults to `pending` status.
- Booking creation rejects missing holder data.
- Booking status update accepts valid statuses.
- Booking status update rejects invalid statuses.
- Booking status update returns 404 for missing bookings.

Current result:

```text
9 passing tests
```

## Recommended Demo Flow

Use this flow when presenting the project:

1. Open the public home page.
2. Show accommodation cards and availability search.
3. Create or log into a user account.
4. Make a reservation.
5. Log in as admin.
6. Open the Summary dashboard and show analytics.
7. Open Bookings and filter by status/name/accommodation/date.
8. Move a booking through the status flow.
9. Open Calendar and show reserved/occupied dates.
10. Edit a cabin or campsite and upload a new photo.

## Project Structure

```text
campingService
  controllers/
    Request handlers for each resource

  middlewares/
    Authentication, authorization, booking validation

  models/
    Sequelize models and database initialization

  routes/
    Express route definitions

  services/
    Business logic such as amount calculation

  tests/
    Node test runner unit tests

  utils/
    Shared helpers such as password hashing

  server.js
    Express app entry point
```

## Frontend Integration

The frontend consumes this API through Axios and is maintained in a separate repository:

```text
https://github.com/agustinmota/campingServiceFront
```

Frontend capabilities:

- Public landing/home page.
- Availability search.
- Login and registration.
- Authenticated booking flow.
- Admin dashboard.
- Booking filters.
- Calendar view.
- Accommodation CRUD.
- Image upload for cabins and campsites.
- Admin analytics.

Frontend environment example:

```env
VITE_API_URL=http://localhost:3000
```

## Security Notes

Implemented:

- Password hashing with bcryptjs.
- JWT authentication.
- 1-hour session expiration.
- Role-based admin route protection.
- Backend reservation validation.

Recommended before production:

- Use a strong `JWT_SECRET`.
- Replace demo credentials.
- Restrict CORS origins.
- Add request rate limiting.
- Add production-safe error responses.
- Store uploaded files in object storage instead of database text fields.
- Use HTTPS.
- Add refresh-token or re-login flow if needed.

## Known Technical Debt

The project is functional and portfolio-ready, but the following improvements would make it stronger:

- Move seed logic into a dedicated `npm run seed` command.
- Add database migrations instead of relying on `sequelize.sync({ alter: true })`.
- Normalize response shapes across all controllers.
- Add integration tests with a test database.
- Add pagination for admin lists.
- Add server-side filters for bookings.
- Store images in a file/object storage service instead of saving base64 data in the database.
- Add centralized error middleware.

## Portfolio Roadmap

Recommended next upgrades:

- Deploy frontend and backend.
- Add screenshots to this README.
- Add CI with GitHub Actions.
- Add payment status simulation.
- Add email confirmations with Nodemailer.
- Add audit logs for admin actions.
- Add backend integration tests.
- Add OpenAPI/Swagger documentation.

## License

This project is currently intended for educational and portfolio use.
