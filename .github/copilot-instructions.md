# Notes App - Copilot Instructions

This document provides instructions for AI coding agents to effectively contribute to the Notes App codebase.

## Architecture Overview

This is a full-stack mobile application built with React Native (Expo) for the frontend and a Node.js/Express/MongoDB backend for the API.

- **Frontend (`/`)**: A React Native application managed by the Expo framework.
- **Backend (`/backend`)**: A Node.js server providing a RESTful API for the notes functionality.

The two parts of the application are decoupled and must be run as separate processes during development.

## Frontend Development

The frontend is a standard Expo application.

- **Entry Point**: `App.js` is the main entry point for the application.
- **Navigation**: The app uses **React Navigation**. The primary navigation setup is located in `src/navigation/Routes.js`. This file initializes the `NavigationContainer` and renders the main stack navigator, `HomeStack`.
- **Screens & Components**:
  - All application screens are located in `src/screens`.
  - Reusable components are placed in `src/components`.
- **Styling**: Global styles are defined in `src/styles/globalStyles.js`. Component-specific styles are co-located with their components.
- **API Service**: The frontend communicates with the backend via the API service defined in `src/services/api.js`.

### Critical Frontend Pattern

A critical bug was fixed that caused production builds (EAS) to crash. In `src/navigation/Routes.js`, a navigator component was incorrectly called as a function (`HomeStack()`) instead of being rendered as a JSX component (`<HomeStack />`).

- **Incorrect (crashes in production)**: `<NavigationContainer>{HomeStack()}</NavigationContainer>`
- **Correct**: `<NavigationContainer><HomeStack /></NavigationContainer>`

Always ensure React components, especially navigators, are rendered as JSX tags.

## Backend Development

The backend is a standard Node.js application using the Express framework and Mongoose for MongoDB interaction.

- **Entry Point**: The server is started with `nodemon server.js`. The main application logic is in `app.js`.
- **MVC Pattern**: The backend follows a Model-View-Controller (MVC) structure:
  - **Models (`/backend/models`)**: Defines the Mongoose schemas. `noteModel.js` is the schema for a note.
  - **Routes (`/backend/routes`)**: Defines the API endpoints. `noteRoutes.js` contains all routes related to notes.
  - **Controllers (`/backend/controllers`)**: Contains the business logic for each route. `noteControllers.js` implements the logic for creating, reading, updating, and deleting notes.
- **Configuration**: Environment variables are managed with the `dotenv` package and the `config.env` file.

## Developer Workflow

To run the application for development, you must start both the frontend and backend servers.

1.  **Start the Backend Server**:

    ```bash
    cd backend
    npm install
    npm start
    ```

2.  **Start the Frontend Application**:
    In a separate terminal, from the project root:
    ```bash
    npm install
    npm start
    ```
    This will open the Expo development server, allowing you to run the app in a simulator or on a physical device using the Expo Go app.
