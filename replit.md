# Replit.md

## Overview

This is a full-stack web application built with React, TypeScript, and Express.js featuring an AI-powered tax assistant chat interface. The application provides professional tax consultation through an interactive chat experience with PIN-based authentication. Users can register with a 4-6 digit PIN and security question to receive a unique user ID for future logins. The frontend uses shadcn/ui components for a polished, professional appearance, while the chat system includes mock AI responses with helpful tax resources and links.

## Recent Changes

**Human Tax Expert Connection Feature Added (Latest Update)**
- Created comprehensive booking system for connecting users with certified tax professionals and attorneys
- Implemented dual service options: hourly consultations and full-service tax preparation
- Added expert type selection between Certified Tax Professionals (CPAs/EAs) and Tax Attorneys
- Integrated consultation method options: phone, video, and in-person meetings
- Created scheduling system with calendar integration and time slot selection
- Added transparent pricing display and cost estimation for both service types
- Enhanced navigation menu with direct access to human expert booking

**Tax Form Wizard Feature**
- Created document-focused tax preparation wizard with guided question system
- Implemented multi-step workflow: Employment Income → Investment Income → Deduction Documents → Business Documentation
- Added comprehensive document upload functionality for all tax-related documents (W-2s, 1099s, receipts, etc.)
- Removed personal information collection - system focuses on document-based data extraction
- Enhanced each step with specific document requirements and form section mapping
- Integrated progress tracking and step navigation with clear document upload requirements

**Investment Tax Advisor Feature**
- Added comprehensive investment advisor page with personalized tax optimization recommendations
- Integrated form-based financial information collection with validation
- Implemented mock calculations for tax-deductible investments, estimated savings, and monthly recommendations
- Added investment strategy recommendations (401k, IRA, HSA, etc.) with contribution limits and tax benefits
- Enhanced navigation with investment advisor access from main chat interface
- Updated chat responses to include investment-related tax advice and direct links to advisor tool

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and API interactions
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation through Hookform resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: Uses tsx for development with hot reloading
- **Build System**: esbuild for production builds with ES modules
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Middleware**: Custom logging middleware for API request tracking

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Database Client**: Neon Database serverless driver for cloud PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for rapid development and testing

### Authentication and Authorization
- **PIN-Based Authentication**: Users register with 4-6 digit PIN and security question
- **Unique User ID System**: Auto-generated unique user IDs (format: TAX12345678) for account identification
- **Security Questions**: Predefined security questions for account recovery
- **Local Storage Session**: Client-side authentication state management for frontend-only implementation
- **User Schema**: User model with PIN, security question/answer, and UUID primary keys

### API Design Patterns
- **Architecture**: RESTful API design with `/api` prefix for all endpoints
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Logging**: Comprehensive request/response logging with performance metrics
- **CORS**: Configured for cross-origin requests with credentials support

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL provider for production database hosting
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect for database operations

### Frontend Libraries
- **shadcn/ui**: Complete UI component system built on Radix UI primitives
- **TanStack Query**: Server state management for API caching and synchronization
- **Wouter**: Minimalist routing library for single-page application navigation
- **React Hook Form**: Form state management with validation support
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Development Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Static type checking across the entire application
- **esbuild**: High-performance bundler for production builds
- **Replit Integration**: Custom plugins for Replit development environment

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Icon library with consistent design system
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx/tailwind-merge**: Conditional className utilities for dynamic styling