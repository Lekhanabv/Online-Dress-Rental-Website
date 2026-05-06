<<<<<<< HEAD
# Dress Rental Project

A full-stack dress rental application scaffold with a static client folder and a Node.js/Express backend.

## Project Structure

- `client/` - Frontend static pages, styles, and JavaScript logic
- `server/` - Backend Node.js API with authentication, routes, controllers, and database config
- `database/schema.sql` - MySQL schema for users, dresses, rentals, and payments

## Setup

1. Install server dependencies:
   ```bash
   cd "server"
   npm install
   ```
2. Configure the `.env` file in `server/`.
   - Set `DB_PASSWORD` to your MySQL password.
   - Example:
     ```text
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=dress_rental
     JWT_SECRET=replace_this_with_a_secure_key
     ```
3. Create the database and tables using `database/schema.sql`.
4. Start the backend server:
   ```bash
   npm run start
   ```

## Notes

- The frontend is static HTML/CSS/JS and can be served directly from the `client/` folder.
- Backend routes are mounted under `/api/*`.
- Auth uses JWT tokens and `Authorization: Bearer <token>` headers.
- Use the `/api/admin/tables` route with an admin account to inspect database table names, and `/api/admin/tables/:tableName` to view up to 20 rows from a table.


=======
# Online-Dress-Rental-Website
Online dress rental websites provide premium designer, bridal, and party wear on rent at a fraction of the retail price, offering options for weddings, pre-wedding shoots, and special events
>>>>>>> efae90c268e3d0ffbe393b8f6ee13f5b8aa48e37
