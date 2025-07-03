# Welcome to your Task Managements

## How can I edit this code?

**Use your preferred IDE**
This is a modern task management application built with React and TypeScript. It features a clean, intuitive interface for managing tasks, with real-time updates and team collaboration capabilities. The application includes user authentication, task organization, progress tracking, and team collaboration features. Built with performance and user experience in mind, it uses the latest web technologies and follows modern development practices.


Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone [https://github.com/fab-ryan/Task-management-frontend.git](https://github.com/fab-ryan/Task-management-frontend.git)

# Step 2: Navigate to the project directory.
cd Task-management-frontend

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Apollo Client (GraphQL)
- React Query

## GraphQL Server Connection

The application connects to a GraphQL server for data management. Here's how to set up the connection:

1. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_GRAPHQL_URL=http://localhost:4000/graphql
   VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
   ```

2. **Server Connection**
   The application uses Apollo Client for GraphQL operations. The connection is configured in `src/lib/apollo.ts`.

3. **Authentication**
   - The GraphQL server requires authentication for protected operations
   - JWT tokens are automatically included in requests
   - Token management is handled through the auth context

4. **Available Operations**
   The following GraphQL operations are available:
   - Authentication (login, register)
   - Task Management (create, read, update, delete)
   - User Management (profile, settings)
   - Team Collaboration (invite, assign)

5. **Error Handling**
   - Network errors are handled automatically
   - Authentication errors trigger automatic logout
   - Validation errors are displayed to users

## Development Workflow

1. Start the GraphQL server:
   ```sh
   # In the server directory
   npm run dev
   ```

2. Start the frontend development server:
   ```sh
   # In the frontend directory
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## API Documentation

For detailed API documentation, visit the GraphQL Playground at http://localhost:4000/graphql when the server is running.



