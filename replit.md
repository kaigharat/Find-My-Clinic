# Overview

Find My Clinic is a healthcare queue management platform that addresses the inefficiencies of traditional clinic visits. The system allows patients to discover nearby clinics, view real-time wait times, join digital queues remotely, and receive notifications when their turn approaches. For clinics, it provides streamlined queue management through admin panels or WhatsApp bot integration, reducing administrative burden and improving patient flow.

The platform features a hybrid approach combining digital accessibility with physical QR standees, ensuring inclusivity for users regardless of tech comfort levels. It includes a "Lite Mode" using WhatsApp/SMS for clinics with limited technical infrastructure.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript in a Single Page Application (SPA) structure
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

## Backend Architecture
- **Runtime**: Node.js with Express.js as the web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API endpoints with consistent error handling middleware
- **Data Layer**: In-memory storage implementation with interface for easy database migration
- **Build System**: Vite for development and esbuild for production builds

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Type-safe database schemas with Drizzle Kit migrations
- **Connection**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **Security**: CORS enabled for cross-origin requests in development
- **User Management**: Basic user authentication with username/password system

## Development and Build Process
- **Development Server**: Vite dev server with Hot Module Replacement (HMR)
- **TypeScript**: Strict mode enabled with path mapping for clean imports
- **Bundle Strategy**: Client-side bundling with Vite, server-side bundling with esbuild
- **Asset Handling**: Static asset serving with proper caching strategies

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with migrations and schema management

## UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent visual elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design

## Development Tools
- **Replit Integration**: Development environment integration with error overlay and cartographer
- **TypeScript**: Static type checking for improved code quality
- **Vite**: Fast build tool and development server

## Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Utilities and Helpers
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional className utility
- **date-fns**: Date manipulation and formatting library
- **nanoid**: Compact URL-safe unique ID generator