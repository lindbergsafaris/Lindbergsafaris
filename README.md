# Lindberg Safaris & Holidays - Frontend Architecture

## Overview
This project is a modern, high-performance travel and safari booking website built with **React** and **TypeScript**. It utilizes a **Headless CMS (Sanity)** for content management, allowing for dynamic updates to tours, destinations, blogs, and packages without code changes.

The architecture was recently refactored to a **Serverless/Frontend-only** model, removing the need for a custom Node.js backend. The frontend now communicates directly with the Sanity Content Delivery Network (CDN).

## Technology Stack

### Core
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6+)

### Data & Content
- **CMS**: Sanity.io (Headless CMS)
- **Data Fetching**: `@sanity/client` with GROQ queries
- **Caching & State**: `swr` (Stale-While-Revalidate) for efficient server state management
- **Maps**: Leaflet / React-Leaflet

### SEO & Performance
- **SEO**: `react-helmet-async` for dynamic meta tags
- **Performance**: Code splitting via `React.lazy` and `Suspense`

## Architecture

### 1. Direct Sanity Integration
Instead of routing requests through a middleware server, the application queries Sanity's API directly. This reduces latency and hosting complexity.
- **Client**: Configured in `src/lib/sanity.ts`.
- **API Layer**: `src/lib/api.ts` contains all GROQ queries, organized by domain (Tours, Destinations, Blog, etc.).
- **Security**: Uses Sanity's public dataset visibility. CORS origins must be configured in the Sanity Dashboard to allow requests from the frontend domain.

### 2. Data Flow
1.  **Component Mounts**: A page (e.g., `Tours.tsx`) mounts.
2.  **SWR Hook**: `useSWR` triggers a fetch request using the keys defined in the component.
3.  **API Call**: `api.tours.getAll()` executes a GROQ query via `@sanity/client`.
4.  **Sanity CDN**: The request hits Sanity's global CDN (Edge Cache).
5.  **Render**: Data is returned and the component renders. SWR caches the data for subsequent visits.

### 3. Key Directories
- `src/pages`: Top-level route components (Home, Tours, Contact, etc.).
- `src/components`: Reusable UI components (Layout, Navbar, Footer, Cards).
- `src/lib`: Core utilities, API definitions, and Sanity configuration.
- `src/types`: TypeScript interfaces matching the Sanity Schema.
- `sanity-studio`: (Separate folder) The CMS configuration and schema definitions.

## Setup & Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1.  Clone the repository.
2.  Navigate to the frontend directory:
    ```bash
    cd my-react-app
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env` file in `my-react-app` with the following:
```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

### Running Locally
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```
This generates a static bundle in the `dist` folder, ready for deployment to Vercel, Netlify, or any static host.

## Deployment
The project is optimized for Vercel deployment.
1.  Connect your GitHub repository to Vercel.
2.  Set the **Root Directory** to `my-react-app`.
3.  Add the Environment Variables in the Vercel Dashboard.
4.  Deploy.

## Sanity Configuration (Crucial)
To prevent CORS errors, add your deployment domains (e.g., `https://your-app.vercel.app` and `http://localhost:5173`) to the **CORS Origins** list in your Sanity Project Dashboard.
