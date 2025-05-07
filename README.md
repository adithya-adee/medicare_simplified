# Medicare Simplified
## Project Description
Medicare Simplified is a web application for online pharmacy store built using Next.js, PostgreSQL, NextAuth.js, Prisma ORM, and implements Role-Based Access Control (RBAC) for managing user access (admin and regular user). It aims to simplify Medicare processes.

## Features
Next.js Framework: Utilizes Next.js for server-side rendering, routing, and API functionality.
PostgreSQL Database: Uses PostgreSQL as the relational database to store application data.
NextAuth.js: Implements user authentication, including Google authentication.
Prisma ORM: Provides a type-safe database client for interacting with the PostgreSQL database.
Role-Based Access Control (RBAC):
Admin User: Has full access to manage all aspects of the application.
Regular User: Has limited access, typically to their own data.
Google Authentication: Users can sign in using their Google accounts.

## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js: (Version 18 or later is recommended)
- npm: (Node Package Manager)
- PostgreSQL: (Make sure you have a PostgreSQL database instance running)

## Setup Instructions
Follow these steps to set up the project:

**1. Environment Configuration:**
- Create a .env.local file in the root directory of the project.
- Add the following environment variables to the .env.local file, replacing the values with your actual configuration:
```
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_URL="http://localhost:3000"  # Or your deployed URL
NEXTAUTH_SECRET="your_nextauth_secret"  # Generate a random secure string

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

_Explanation of Environment Variables:_
- DATABASE_URL: The connection string for your PostgreSQL database. It should include the username, password, host, port, and database name. For example: postgresql://user:password@host:port/database
- NEXTAUTH_URL: The base URL of your application. In development, this is usually http://localhost:3000. In production, it will be your deployed domain.
- NEXTAUTH_SECRET: A secret key used by NextAuth.js to encrypt tokens. You can generate a random string using openssl rand -base64 32 on a Unix-like system or use any online secret generator. Keep this secret secure!
- GOOGLE_CLIENT_ID: The Client ID for your Google OAuth 2.0 web application. You can obtain this from the Google Cloud Console.
- GOOGLE_CLIENT_SECRET: The Client Secret for your Google OAuth 2.0 web application. You can also obtain this from the Google Cloud Console.

**2. Set up Google OAuth 2.0 Credentials:**
- Go to the Google Cloud Console.
- Create a new project or select an existing one.
- Navigate to "APIs & Services" > "Credentials".
- Click "Create Credentials" > "OAuth client ID".
- Select "Web application" as the application type.
- Give your OAuth 2.0 client a name (e.g., "Medicare Simplified").
- In the "Authorized JavaScript origins" field, enter the base URL of your application (e.g., http://localhost:3000 for development).
- In the "Authorized redirect URIs" field, enter http://localhost:3000/api/auth/callback/google (replace with your actual domain if deploying).
- Click "Create".
- Copy the "Your Client ID" and "Your Client Secret" and paste them into the .env.local file as GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, respectively.


**3. Database Setup with Prisma:**
- Open a terminal in the project's root directory.
- Run the following command to apply the Prisma schema to your PostgreSQL database:
`npx prisma db push`

- This command will create the necessary tables in your database based on the schema defined in prisma/schema.prisma. It also generates the Prisma Client.
- If you make changes to your database schema later, you'll need to run this command again to update the database. It is recommended to use npx prisma db push during development. For production, use npx prisma migrate deploy.

- Run the following command to generate the Prisma Client:
`npx prisma generate`


**4. Install Dependencies:**
In the same terminal, run the following command to install the project's dependencies:
`npm install`


**5. Run the Application:**
Once the dependencies are installed, you can start the development server by running:
`npm run dev`


This will start the Next.js development server, and you can access the application in your browser at http://localhost:3000.

## Important Notes
- Database Migrations: For production environments, it's crucial to use Prisma Migrations to manage database schema changes. See the Prisma documentation for details: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Security: Ensure that your NEXTAUTH_SECRET is kept confidential. Do not expose it in your code or commit it to a public repository.
- Environment Variables: It is highly recommended to use a library like dotenv to manage your environment variables, especially in larger projects, instead of directly placing them in the code. However, Next.js has built-in support for .env files.
RBAC Implementation: The RBAC implementation details (how roles are assigned and permissions are checked) are within the application's code (Next.js files). Look for files related to authentication and authorization.


## Medicare Simplified Preview
(https://github.com/user-attachments/assets/a8855b87-e817-40a5-b36c-ade89d31afde)

