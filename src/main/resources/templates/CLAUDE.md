# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskHelper is a Japanese neighborhood task assistance service website built as a Spring Boot web application with Thymeleaf templating. The site allows users to post task requests (shopping, cleaning, delivery, pet care, repairs) and helpers to browse and apply for these tasks.

## Architecture

### Backend Stack
- **Spring Boot 3.5.4**: Web framework with embedded Tomcat server
- **Spring Security**: Authentication and authorization (currently configured but allows all requests for development)
- **Spring Data JPA**: Database abstraction layer
- **MyBatis**: SQL mapping framework for custom queries
- **H2 Database**: In-memory database for development
- **MySQL**: Production database support
- **Thymeleaf**: Server-side templating engine
- **Thymeleaf Layout Dialect**: Template inheritance and layout system

### Frontend Stack
- **HTML5**: Semantic structure with Japanese language support (`lang="ja"`)
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Font Awesome**: Icon library for UI elements
- **JavaScript Libraries**: Toastr (notifications), SweetAlert2 (modals), Alpine.js (reactive components)
- **Typography**: Inter font family for consistent UI

### Directory Structure (src/main/resources/templates/)
- **Root**: index.html (main landing page), dashboard.html (user dashboard)
- **task/**: Core task flow (create.html, detail.html, list.html, my.html, progress.html)
- **user/**: User management (profile.html, profile-public.html, settings.html, notifications.html, messages.html, reviews.html, favorites.html)
- **auth/**: Authentication flow (login.html, register.html, forgot-password.html, verify-email.html, two-factor.html, reset-password.html, login-history.html)
- **helper/**: Helper-specific features (onboarding.html, leaderboard.html, achievement-center.html, earnings.html)
- **admin/**: Administrative panel (dashboard.html, users.html, disputes.html, analytics.html, content.html)
- **support/**: Support and information pages (help.html, about.html, terms.html, privacy-policy.html, dispute-resolution.html, testimonials.html, onboarding-guide.html)
- **misc/**: Utility pages (payment.html, search.html)
- **layout/**: Template inheritance (layout.html, fragments.html)
- **fragments/**: Reusable components (header.html, footer.html, common-scripts.html)

### Template System
- **layout.html**: Base layout template with Thymeleaf Layout Dialect integration
- **fragments.html**: Reusable Thymeleaf fragments and JavaScript utilities
- **header.html**: Complex navigation component with mega menu structure
- **footer.html**: Footer component with service links

### Design System Standards

**Navigation**: Consistent "ログイン + 始める" button pattern with mega menu structure for desktop and collapsible sections for mobile.

**Interactive Elements**: Standardized hover effects with `hover:scale-105 transition-all duration-200` and `.modern-button` class with gradient backgrounds and ripple effects.

**Color System**: Blue (#2563eb) primary with category-specific colors:
- Green: Shopping (買い物)
- Blue: Cleaning (掃除) 
- Orange: Delivery (配送)
- Purple: Pet Care (ペットケア)
- Red: Repairs (修理)
- Gray: Others (その他)

**Mobile Responsiveness**: Breakpoints at `sm:` (640px), `md:` (768px), `lg:` (1024px) with mobile-first approach. Special mobile CSS in styles.css for form element handling.

### Key Components

**Category Cards**: Rounded selection cards (50px border-radius) with hover animations and selected states using `.category-card` and `.category-inner` classes.

**Task Cards**: Reusable components with `.task-card` class featuring hover transforms, status badges, and consistent action buttons.

**Relative Time Display**: JavaScript `updateRelativeTimes()` function converts timestamps to Japanese format (たった今, X分前, X時間前) with 60-second auto-refresh.

**Form Validation**: `.error-field` and `.success-field` classes for visual feedback with border and background color changes.

**Image Upload System**: Task creation form supports up to 4 image uploads with:
- File type validation (image/* only)
- File size limits (10MB max per file)
- Preview thumbnails with hover controls
- Remove and preview functionality
- Alpine.js reactive management in `create.js`

## Development Commands

### Spring Boot Application
```bash
# Run the application (Windows)
gradlew bootRun

# Run the application (Unix/Mac)
./gradlew bootRun

# Build the application
gradlew build

# Run tests
gradlew test

# Clean build artifacts
gradlew clean

# View available Gradle tasks
gradlew tasks

# Run a specific test class
gradlew test --tests "TaskhelperApplicationTests"
```

### Application Configuration
- **Server Port**: 8081 (configured in application.yml)
- **Main Class**: com.taskhelper.TaskhelperApplication
- **Security**: Currently configured to allow all requests for development (SecurityConfig.java:14-19)
- **Database**: H2 in-memory for development, MySQL for production

## Backend Architecture

### Controller Structure
- **MainController**: Handles core routes (/, register, login, dashboard) with simple MVC pattern
- **TaskController**: Manages task-related routes (/tasks/list, /tasks/create, /tasks/detail/{id}, /tasks/my) mapped to task/ templates
- **UserController**: User management and profile functionality
- **AdminController**: Administrative panel routes including admin dashboard
- **SecurityConfig**: Spring Security configuration with CSRF disabled for development, custom login/logout URLs

### Key Backend Files
- `src/main/java/com/taskhelper/TaskhelperApplication.java`: Standard Spring Boot application entry point
- `src/main/java/com/taskhelper/config/SecurityConfig.java`: Security configuration with Japanese comments
- `src/main/java/com/taskhelper/controller/`: MVC controllers for routing
- `src/main/resources/application.yml`: Application configuration (port 8081, application name)

## Template System

### Thymeleaf Layout Pattern (Spring Boot Ready)
- **layout.html**: Base layout template with fragment placeholders, Tailwind config, and common resources
- **fragments.html**: Header, footer, and JavaScript fragments with Spring Security integration
- **Page Templates**: Use `layout:decorate="~{layout}"` for consistent structure

### Template Usage
```html
<!-- Page Template Pattern -->
<!DOCTYPE html>
<html layout:decorate="~{layout}" 
      th:with="title='Page Title'"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">

<div layout:fragment="content">
  <!-- Page content here -->
</div>

<th:block layout:fragment="extra-scripts">
  <!-- Page-specific scripts -->
</th:block>
</html>
```

### Key Thymeleaf Patterns
- **URL Generation**: `th:href="@{/tasks/list(category='shopping')}"` (note: updated to /tasks/ prefix)
- **Authentication**: `th:if="${#authorization.expression('isAuthenticated()')}"`
- **Active Navigation**: `th:classappend="${#httpServletRequest.requestURI == '/' ? 'active-class' : ''}"`
- **User Context**: `th:text="${#authentication.name}"`

## Development Guidelines

### Adding New Pages
1. Copy navigation from header.html and footer from footer.html
2. Add `text-blue-600 font-semibold` to current page menu item for active state
3. Include Alpine.js for interactive components (`x-data`, dropdowns, mobile menu)
4. Apply category-specific colors and consistent hover effects
5. Ensure mobile responsiveness and test at 640px breakpoint

### Styling Architecture
- **Global CSS**: `box-sizing: border-box`, no text decoration on links (styles.css)
- **Tailwind Priority**: Prefer utility classes over custom CSS
- **Custom Classes**: `.task-card`, `.category-card`, `.modern-button`, `.filter-button.active`
- **Shadow System**: `shadow-lg` for cards, `shadow-xl` for elevated states
- **Form States**: `.error-field` (red border/background), `.success-field` (green border/background)

### JavaScript Architecture
- **Vanilla JavaScript**: Primary approach with Alpine.js for specific reactive components
- **Library Integration**: Toastr (notifications), SweetAlert2 (confirmations)
- **Mobile Menu**: Uses `aria-expanded` attributes and icon transitions
- **Time Display**: `updateRelativeTimes()` with setInterval for auto-refresh
- **Current Year**: 2025 (update data-time attributes accordingly)

## Key Architecture Notes

**Full Stack Spring Boot Application**: Complete web application with Spring Boot backend, Thymeleaf templating, and Spring Security integration.

**Template Inheritance Pattern**: Uses Thymeleaf Layout Dialect for consistent page structure:
- `layouts/layout.html`: Base template with extensive Tailwind configuration, animations, and common head/body structure
- `layouts/fragments.html`: Reusable Thymeleaf fragments including relative time JavaScript utilities
- Individual page templates use `layout:decorate="~{layout}"` pattern

**Database Integration**: Configured for both H2 (development) and MySQL (production) with Spring Data JPA and MyBatis support.

**Security Configuration**: Spring Security configured with custom login/logout URLs, CSRF disabled for development, but with proper form login configuration ready for production.

**Controller Structure**: Simple MVC pattern with IndexController handling root route and AuthController handling authentication flows.

**Japanese Localization**: Complete Japanese language support including relative time formatting (`updateRelativeTimes()` function) and culturally appropriate UI patterns.

**Complex Navigation System**: Sophisticated mega menu structure in header.html with desktop and mobile variants, using Alpine.js for interactivity and extensive JavaScript for mobile menu functionality.

## Current Implementation Status

### Completed Features ✅
- **Task Creation System**: Full form with 6 categories (shopping, cleaning, delivery, petcare, repair, others), image upload (up to 4 files), validation, and Alpine.js reactive components
- **Task Listing**: Filtered task display with category buttons, search, and location filters
- **Dashboard**: User landing page after successful task creation
- **Template Architecture**: Complete Thymeleaf layout system with consistent navigation and styling
- **Responsive Design**: Mobile-first design with Tailwind CSS utilities
- **Japanese Localization**: All UI text in Japanese with proper relative time formatting

### Key Route Mappings
- **MainController**: `/` → index.html, `/register` → auth/register.html, `/login` → auth/login.html, `/dashboard` → dashboard.html
- **TaskController**: `/tasks/list` → task/list.html, `/tasks/create` → task/create.html, `/tasks/detail/{id}` → task/detail.html, `/tasks/my` → task/my.html
- **AdminController**: `/admin/dashboard` → admin/dashboard.html

### Development Notes
- **Image Upload**: Handled client-side with JavaScript FileReader API, validates file types and sizes before preview
- **Form Validation**: Real-time validation with Alpine.js, visual feedback with Tailwind CSS classes
- **Category System**: Six predefined categories with consistent color coding across all templates
- **Mobile Menu**: Alpine.js powered responsive navigation with proper ARIA attributes
- **Time Display**: Automatic relative time updates every 60 seconds for dynamic content