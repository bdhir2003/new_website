# Copilot Instructions for Student Portfolio Website

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a student portfolio website built with Next.js, TypeScript, and Tailwind CSS. The project includes:
- A public-facing portfolio website with sections for About Me, Education, Major Achievements in MCH, Featured Projects, Skills, Podcasts, and Awards
- An admin panel for content management with CRUD operations
- MongoDB integration for data persistence
- Authentication system for admin access

## Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React icons

## Code Style Guidelines
- Use TypeScript with strict type checking
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with mobile-first approach
- Implement responsive design patterns
- Use proper error handling and loading states
- Follow RESTful API conventions for backend routes
- Use proper TypeScript interfaces for data models

## Project Structure
- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utilities, database connection, and configurations
- `/src/types` - TypeScript type definitions
- `/src/models` - MongoDB/Mongoose models
- `/public` - Static assets

## Key Features to Implement
1. Portfolio sections with dynamic content loading
2. Admin authentication and protected routes
3. CRUD operations for all content types
4. Image upload and management
5. Responsive design for all devices
6. SEO optimization
7. Form validation and error handling
