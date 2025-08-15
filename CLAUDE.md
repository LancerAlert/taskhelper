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
- **JavaScript Libraries**: 
  - **Swiper.js**: Carousel/slider functionality for testimonials
  - **CountUp.js**: Animated number counting for statistics
  - **Toastr**: Toast notifications
  - **MicroModal**: Lightweight modal dialogs with accessibility enhancements
  - **Alpine.js**: Reactive components and interactivity
  - **Joi**: Client-side validation library for forms
  - **AOS (Animate on Scroll)**: Scroll-triggered animations
- **Typography**: Inter font family for consistent UI
- **Animation System**: CSS-based immediate animations with AOS scroll-triggered animations

### Directory Structure (src/main/resources/)

#### **Templates (templates/)**
- **Root**: index.html (main landing page), dashboard.html (user dashboard)
- **task/**: Core task flow (create.html, detail.html, list.html, my.html, progress.html, application.html, helper.html)
- **user/**: User management (profile.html, profile-public.html, settings.html, notifications.html, messages.html, reviews.html, favorites.html)
- **auth/**: Authentication flow (login.html, register.html, forgot-password.html, verify-email.html, two-factor.html, reset-password.html, login-history.html)
- **helper/**: Helper-specific features (onboarding.html, leaderboard.html, achievement-center.html, earnings.html)
- **admin/**: Administrative panel (dashboard.html, users.html, disputes.html, analytics.html, content.html)
- **support/**: Support and information pages (help.html, about.html, terms.html, privacy-policy.html, dispute-resolution.html, testimonials.html, onboarding-guide.html)
- **misc/**: Utility pages (payment.html, search.html)
- **layout/**: Template inheritance (layout.html, fragments.html)
- **fragments/**: Reusable components (header.html, footer.html, common-scripts.html)
- **components/**: Reusable UI components (ui-components.html)

#### **Static Assets (static/)**
- **css/**: Page-specific stylesheets
  - **Root**: styles.css, header.css, index.css, task-list.css
  - **task/**: detail.css, my.css, helper.css
- **js/**: Page-specific JavaScript
  - **Root**: header.js, index.js, task-list.js
  - **auth/**: register.js
  - **task/**: create.js, detail.js, my.js, helper.js, application.js

## Template System

### Thymeleaf Layout Pattern (Spring Boot Ready)
- **layout.html**: Base layout template with fragment placeholders, Tailwind config, and common resources
- **fragments.html**: Header, footer, and JavaScript fragments with Spring Security integration
- **ui-components.html**: Reusable UI component library with mobile-optimized elements
- **Page Templates**: Use `layout:decorate="~{layout}"` for consistent structure

### Template Usage
```html
<!-- Page Template Pattern -->
<!DOCTYPE html>
<html layout:decorate="~{layout/layout}" 
      th:with="title='Page Title'"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">

<div layout:fragment="content">
  <!-- Page content here -->
  <th:block th:replace="~{components/ui-components :: user-type-selection()}"></th:block>
</div>

<th:block layout:fragment="extra-scripts">
  <!-- Page-specific scripts -->
</th:block>
</html>
```

### Key Thymeleaf Patterns
- **URL Generation**: `th:href="@{/tasks/list(category='shopping')}"`
- **Authentication**: `th:if="${#authorization.expression('isAuthenticated()')}"`
- **Active Navigation**: `th:classappend="${#httpServletRequest.requestURI == '/' ? 'active-class' : ''}"`
- **User Context**: `th:text="${#authentication.name}"`

## Design System Standards

### Color System
- **Primary Brand Gradient**: `from-gray-900 via-blue-900 to-gray-900`
- **Category Colors**:
  - Green: Shopping (買い物)
  - Blue: Cleaning (掃除) 
  - Orange: Delivery (配送)
  - Purple: Pet Care (ペットケア)
  - Red: Repairs (修理)
  - Gray: Others (その他)

### Mobile Responsiveness
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px) with mobile-first approach
- **Touch Targets**: Minimum 44px for accessibility
- **Service Cards**: 3×2 grid on mobile, scale-based hover effects (no translateY)

### Key Component Classes
- **`.service-card`**: Mobile-optimized cards with scale transforms (prevents scroll jumping)
- **`.terms-checkbox`**: Fixed 16x16px checkbox size for mobile consistency
- **`.terms-container`**: Responsive flex layout for terms & conditions

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
```

### Application Configuration
- **Server Port**: 8081 (configured in application.yml)
- **Main Class**: com.taskhelper.TaskhelperApplication
- **Security**: Currently allows all requests for development
- **Database**: H2 in-memory for development, MySQL for production

## Backend Architecture

### Controller Structure
- **MainController**: Handles core routes (/, register, login, dashboard)
- **TaskController**: Manages task-related routes (/tasks/list, /tasks/create, /tasks/detail/{id}, /tasks/my)
- **UserController**: User management and profile functionality
- **AdminController**: Administrative panel routes
- **SecurityConfig**: Spring Security configuration with custom login/logout URLs

### Database Schema

#### Complete Production-Ready Schema

##### 1. Role Table (Master Data)
```sql
CREATE TABLE role (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

-- Initial Data
INSERT INTO role (role_name) VALUES
('REQUESTER'), ('HELPER'), ('ADMIN');
```

##### 2. Image Table
```sql
CREATE TABLE image (
    image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_name VARCHAR(50) NOT NULL,
    image_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Default profile image
INSERT INTO image (image_name, image_hash) VALUES ('default.png', 'default');
```

##### 3. User Table
```sql
CREATE TABLE user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL DEFAULT 1,
    image_id BIGINT NOT NULL DEFAULT 1,
    login_type VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    description TEXT,
    address VARCHAR(100),
    gender CHAR(1) NOT NULL CHECK(gender IN ('M','F')),
    birth_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT fk_user_image FOREIGN KEY (image_id) REFERENCES image(image_id)
);

CREATE INDEX idx_user_active ON user(is_active);
```

##### 4. Category Table
```sql
CREATE TABLE category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(20) NOT NULL
);

-- Initial Data
INSERT INTO category(category_name) VALUES
('SHOPPING'), ('CLEANING'), ('DELIVERY'), ('PETCARE'), ('REPAIR'), ('OTHERS');
```

##### 5. Task Table
```sql
CREATE TABLE task (
    task_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    requester_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(100),
    price INT NOT NULL,
    task_date DATE NOT NULL,
    task_time VARCHAR(20) NOT NULL CHECK(task_time IN('MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME')),
    status VARCHAR(20) NOT NULL CHECK(status IN('RECRUITING', 'INPROGRESS', 'COMPLETED', 'CANCELLED')),
    view_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME,
    
    CONSTRAINT fk_task_requester FOREIGN KEY (requester_id) REFERENCES user(user_id),
    CONSTRAINT fk_task_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_category_status ON task(category_id, status);
CREATE INDEX idx_task_date ON task(task_date);
```

##### 6. Task Application Table
```sql
CREATE TABLE task_application (
    task_application_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    helper_id BIGINT NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK(status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ta_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_ta_helper FOREIGN KEY (helper_id) REFERENCES user(user_id),
    CONSTRAINT uk_ta_helper UNIQUE (task_id, helper_id)
);

CREATE INDEX idx_ta_status ON task_application(status);
CREATE INDEX idx_ta_task_status ON task_application(task_id, status);
CREATE INDEX idx_ta_helper_status ON task_application(helper_id, status);
```

##### 7. Review Table
```sql
CREATE TABLE review (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_review_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES user(user_id),
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES user(user_id),
    CONSTRAINT uk_review UNIQUE (task_id, reviewer_id, reviewee_id),
    CONSTRAINT ck_no_self_review CHECK (reviewer_id != reviewee_id)
);

CREATE INDEX idx_review_reviewee ON review(reviewee_id);
CREATE INDEX idx_review_task ON review(task_id);
```

##### 8. Task Image Table
```sql
CREATE TABLE task_image (
    task_image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    original_name VARCHAR(50) NOT NULL,
    orders INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ti_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_ti_image FOREIGN KEY (image_id) REFERENCES image(image_id),
    CONSTRAINT uk_ti_image UNIQUE (task_id, image_id)
);

CREATE INDEX idx_task_image_orders ON task_image (task_id, orders);
```

##### 9. Options Table
```sql
CREATE TABLE options (
    option_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    option_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

-- Initial Data
INSERT INTO options (option_name, description) VALUES
('URGENT', '緊急対応が必要'), 
('PHOTO_REQUIRED', '写真撮影が必要'), 
('HEAVY_LIFTING','重い荷物の運搬あり'), 
('PET_FRIENDLY', 'ペット対応可能');
```

##### 10. Task Options Table (Junction)
```sql
CREATE TABLE task_options (
    task_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    
    PRIMARY KEY (task_id, option_id),
    CONSTRAINT fk_to_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_to_options FOREIGN KEY (option_id) REFERENCES options(option_id)
);
```

##### 11. Question Table
```sql
CREATE TABLE question (
    question_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_question_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_question_user FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE INDEX idx_question_task ON question(task_id);
```

##### 12. Answer Table
```sql
CREATE TABLE answer (
    answer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    parent_id BIGINT,  -- For nested replies
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_answer_user FOREIGN KEY (user_id) REFERENCES user(user_id),
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question(question_id),
    CONSTRAINT fk_answer_parent FOREIGN KEY (parent_id) REFERENCES answer(answer_id)
);

CREATE INDEX idx_answer_question ON answer(question_id);
CREATE INDEX idx_answer_user ON answer(user_id);
CREATE INDEX idx_answer_parent ON answer(parent_id);
```

### Database Design Principles

#### Naming Conventions
- **Tables**: Lowercase singular names (user, task, review)
- **Primary Keys**: `{table_name}_id` pattern
- **Foreign Keys**: `fk_{table}_{reference}` pattern
- **Unique Constraints**: `uk_{table}_{columns}` pattern
- **Indexes**: `idx_{table}_{columns}` pattern
- **Enum Values**: UPPERCASE with underscores (PENDING, IN_PROGRESS)

#### Index Strategy
- **Primary Keys**: Automatically indexed
- **Foreign Keys**: Additional indexes for non-primary foreign keys
- **Query Optimization**: Composite indexes for frequently joined columns
- **Status Fields**: Indexed for filtering operations

#### Data Types
- **IDs**: BIGINT for scalability
- **Status/Type**: VARCHAR with CHECK constraints
- **Timestamps**: DATETIME with DEFAULT CURRENT_TIMESTAMP
- **Flags**: BOOLEAN for is_active, is_verified
- **Text**: TEXT for unlimited content, VARCHAR for limited

#### Constraints
- **NOT NULL**: Applied to all required fields
- **UNIQUE**: Username, email, phone, and composite keys
- **CHECK**: Enum validations, score ranges, self-reference prevention
- **DEFAULT**: Sensible defaults for status, timestamps, flags

### Common Query Examples

#### Task Queries
```sql
-- Get all recruiting tasks by category
SELECT t.*, u.username, c.category_name 
FROM task t
JOIN user u ON t.requester_id = u.user_id
JOIN category c ON t.category_id = c.category_id
WHERE t.status = 'RECRUITING' 
  AND c.category_name = 'SHOPPING'
ORDER BY t.created_at DESC;

-- Get tasks with applications
SELECT t.*, COUNT(ta.task_application_id) as application_count
FROM task t
LEFT JOIN task_application ta ON t.task_id = ta.task_id
WHERE t.requester_id = ?
GROUP BY t.task_id;
```

#### Helper Queries
```sql
-- Get helper's average rating
SELECT AVG(r.score) as avg_rating, COUNT(r.review_id) as review_count
FROM review r
WHERE r.reviewee_id = ?;

-- Get helper's active applications
SELECT t.*, ta.status as application_status
FROM task_application ta
JOIN task t ON ta.task_id = t.task_id
WHERE ta.helper_id = ? 
  AND ta.status IN ('PENDING', 'ACCEPTED');
```

#### Q&A Queries
```sql
-- Get questions with answers (hierarchical)
WITH RECURSIVE answer_tree AS (
    SELECT a.*, 0 as level
    FROM answer a
    WHERE a.question_id = ? AND a.parent_id IS NULL
    UNION ALL
    SELECT a.*, at.level + 1
    FROM answer a
    JOIN answer_tree at ON a.parent_id = at.answer_id
)
SELECT * FROM answer_tree ORDER BY level, created_at;
```

### Migration Notes

#### Table Creation Order
```sql
-- 1. Master tables (no dependencies)
role, category, options, image

-- 2. User table (depends on role, image)
user

-- 3. Task table (depends on user, category)
task

-- 4. Junction/relationship tables
task_application, task_image, task_options, review

-- 5. Q&A tables
question, answer
```

#### Spring JPA Entity Mapping
```java
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    // Use @Enumerated for status fields
    @Enumerated(EnumType.STRING)
    @Column(name = "login_type")
    private LoginType loginType;
}
```

## UI Components System

**IMPORTANT**: UI Components are for **REFERENCE ONLY**. Do not use `th:replace` to include components directly in templates due to Thymeleaf security restrictions on event handlers.

### Usage Policy
- ✅ **Reference UI components** for consistent styling and structure
- ✅ **Copy and adapt** component HTML directly into templates
- ✅ **Maintain design consistency** across all pages
- ❌ **Do NOT use** `th:replace="~{components/ui-components :: ...}"` syntax
- ❌ **Avoid** onclick attributes with JavaScript strings (Thymeleaf security policy)

### Available Component References
```html
<!-- REFERENCE ONLY - Copy structure and styling -->

<!-- Task Dashboard Cards -->
components/ui-components.html :: task-dashboard-card      /* Requester cards (blue theme) */
components/ui-components.html :: helper-dashboard-card    /* Helper cards (purple theme) */

<!-- Registration Form Components -->
components/ui-components.html :: user-type-selection-card /* User role selection cards */
components/ui-components.html :: service-selection-grid   /* 3×2 service category grid */
components/ui-components.html :: password-requirements    /* Password strength indicators */
components/ui-components.html :: social-login-button     /* Social login button styles */

<!-- Alpine.js Filter State Pattern -->
components/ui-components.html :: alpine-filter-pattern   /* Separate tab filter states */

<!-- Button Color System -->
.btn-primary    /* Blue/Purple - Main actions like "詳細を見る" */
.btn-success    /* Green - Positive actions like "入金する" */ 
.btn-warning    /* Yellow - Rating actions like "評価する" */
.btn-secondary  /* White - Supporting actions like "編集", "連絡" */
.btn-danger     /* Red - Destructive actions (icon only) */

<!-- Status Badge Reference -->
<!-- Use: <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"> -->

<!-- Category Badge Reference -->
<!-- Use: <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"> -->
```

### Safe Navigation Patterns
```html
<!-- ✅ SAFE: Use Thymeleaf URL generation -->
<a th:href="@{/tasks/create}" class="btn-primary">Create Task</a>

<!-- ✅ SAFE: Use data attributes for JavaScript -->
<button data-action="delete" data-id="123" class="btn-danger">Delete</button>

<!-- ❌ UNSAFE: Direct onclick with JavaScript strings -->
<button th:onclick="'deleteTask(' + ${task.id} + ')'">Delete</button>
```

## Development Guidelines

### Library-First Policy
**IMPORTANT**: When implementing new functionality:
1. **ALWAYS search for existing libraries first** before custom implementation
2. **Use established, well-maintained libraries** over custom code
3. **Prefer CDN-hosted solutions** for faster implementation
4. **Document library choices** in CLAUDE.md with rationale

**Exceptions (Custom CSS/JS Allowed)**:
- ✅ **Terms & Conditions forms**: Complex checkbox synchronization logic and responsive layout constraints require precise control
- ✅ **Mobile optimization**: When library solutions don't meet specific mobile UX requirements

### Adding New Pages
1. Use `layout:decorate="~{layout/layout}"` for consistent structure
2. **Reference UI components** from `components/ui-components.html` for styling consistency (DO NOT use th:replace)
3. Apply category-specific colors and consistent hover effects
4. Ensure mobile responsiveness with proper breakpoints
5. Test at 640px, 768px, and 1024px breakpoints
6. **Separate CSS/JS**: Create external files (e.g., `page-name.css`, `page-name.js`)
7. **Tailwind First**: Maximize Tailwind utility usage before custom CSS
8. **Thymeleaf Security**: Use `@{/path}` for URLs, avoid onclick with JavaScript strings
9. **Document Rationale**: Add comments explaining any custom CSS exceptions

### Component Development
- **Mobile-First**: Design for 320px+ screens first
- **Scale Effects**: Use `transform: scale()` instead of `translateY()` for hover effects
- **Consistent Spacing**: Use `space-y-5` for form sections, `space-y-3` for tight layouts
- **Alpine.js Integration**: Use `x-data`, `x-model`, `:class` for reactive components

## JavaScript Architecture

### Alpine.js Components
- **registerForm()**: Complete registration form with validation and state management
- **createTaskForm()**: Task creation form with category selection, image upload, and validation
- **headerNavigation()**: Navigation component with mobile menu support
- **myTasksManager()**: Requester dashboard with posted/completed task management
- **helperTasksManager()**: Helper dashboard with applied/completed task management

### Alpine.js Best Practices
- **Filter State Separation**: Use separate variables for each tab (postedFilter/appliedFilter)
- **Getter/Setter Pattern**: Implement computed properties for dynamic filter access
- **State Management**: Use `$nextTick()` for immediate UI updates
- **Reactive Validation**: Real-time form field validation with immediate visual feedback
- **Tab Persistence**: Maintain filter states when switching between tabs
```javascript
get statusFilter() {
  return this.activeView === 'posted' ? this.postedFilter : this.appliedFilter;
},
set statusFilter(value) {
  if (this.activeView === 'posted') {
    this.postedFilter = value;
  } else {
    this.appliedFilter = value;
  }
}
```

### Library Integration
- **MicroModal**: Initialized in common-scripts.html with proper ARIA support
- **Toastr**: Configured for toast notifications
- **Joi**: Client-side validation with Japanese error messages
- **AOS**: Scroll-triggered animations with 800ms duration

## Current Implementation Status

### ✅ Completed Features
- **Index Page**: Complete with hybrid animation system (CSS hero + AOS scroll)
- **Registration System**: 
  - **Complete Alpine.js Form**: Full reactive form with registerForm() component
  - **User Type Selection**: Dynamic role selection (依頼者/ヘルパー) with visual feedback
  - **Helper Information**: Conditional fields for helper registration (bio, services)
  - **Service Selection Grid**: 3×2 mobile-optimized grid with scale animations
  - **Password Requirements**: Real-time validation with visual indicators (length, alphanumeric, special)
  - **Terms & Conditions**: Hierarchical checkbox system with "agree all" functionality
  - **Social Login Modals**: MicroModal integration for LINE, Yahoo!, Google, X (Twitter), Apple
  - **Form State Management**: Complete validation with isFormValid computed property
  - **Responsive Design**: Mobile-first with breakpoints at 320px, 640px, 768px
  - **External JS**: Logic separated to `/js/auth/register.js`
- **Authentication System**: 
  - **Login**: Simple and clean form with email/password authentication
  - **Social Login**: Available during registration only (LINE, Google, Yahoo, Twitter, Apple)
  - **Security**: Spring Security integration with custom login endpoints
- **Navigation System**: Unified desktop/mobile design with gradient icons
- **UI Components**: Comprehensive component library for **REFERENCE ONLY** (no direct th:replace usage)
- **Terms & Conditions**: Custom checkbox layout with responsive design and modal integration
- **Mobile Optimization**: Scale-based hover effects, responsive grids, layout stability
- **Task List System**: 
  - **Filtering & Search**: Advanced multi-criteria filtering with Alpine.js reactive patterns
  - **Responsive Design**: Mobile-first approach with Tailwind CSS optimization
  - **Code Separation**: External CSS/JS files following separation of concerns
  - **Library Integration**: Toastr notifications, Font Awesome icons, Alpine.js reactivity
- **Task Creation System**:
  - **Alpine.js Form**: Complete reactive form with real-time validation and state management
  - **Category Selection**: 6 predefined categories with consistent color coding and scale animations
  - **Image Upload**: Client-side handling with preview, validation, and removal functionality
  - **Responsive Layout**: Mobile single-column, desktop 2-column grid for optimal UX
  - **Form Validation**: Real-time field validation with visual feedback using Alpine.js
  - **Accessibility**: Full ARIA support with describedby relationships and semantic structure
- **Task Detail System**:
  - **Comprehensive Layout**: 3-column grid with sticky sidebar, main content, and Q&A integration
  - **Native Sticky Sidebar**: CSS-only sticky positioning with header-aware spacing (calc(4rem + 2rem))
  - **Interactive Elements**: Favorite toggle, image modal, scroll-to-top with smooth animations
  - **Q&A System**: Public question-answer display with custom gradient backgrounds
  - **Status Management**: Dynamic status badges without distracting pulse animations
  - **Code Optimization**: CSS reduced from 222 lines to 79 lines (64% reduction)
  - **Library-First Compliance**: Eliminated JavaScript libraries in favor of native CSS solutions
- **Task My System (Requester Dashboard)**:
  - **Dashboard Layout**: Statistics cards with tab navigation for posted/completed tasks
  - **Alpine.js State Management**: Separate filter states (postedFilter/completedFilter) for tab persistence
  - **Dynamic Card Rendering**: Data-driven task cards with status-specific button logic
  - **Button Color System**: Universal color meanings (blue=primary, green=success, yellow=rating, white=secondary)
  - **Status-Aware Actions**: Context-sensitive buttons based on task status (recruiting/in-progress/pending-payment/rated)
  - **Code Separation**: External CSS/JS files (my.css, my.js) following separation of concerns
  - **Mobile Optimization**: Scale-based animations, 44px touch targets, responsive grid layouts
- **Task Helper System (Helper Dashboard)**:
  - **Purple-Indigo Theme**: Distinct color scheme to differentiate from requester dashboard
  - **Bidirectional Workflow**: Applied tasks (pending/accepted/in-progress) and completed tasks (pending-payment/paid)
  - **Helper-Specific Actions**: Application withdrawal, progress reporting, requester rating
  - **Earnings Tracking**: Income confirmation and payment status management
  - **Dynamic Data Binding**: Full Alpine.js integration with getHelperStatusBadgeClass() and getCategoryIcon()
  - **Filter State Persistence**: Separate appliedFilter/completedFilter maintaining tab-specific selections
- **Task Application System (応募者管理)**:
  - **Application Management**: View and manage helper applications for tasks
  - **Sorting Options**: Sort by rating, experience, distance, or application time
  - **Applicant Cards**: Display helper profiles with ratings, completed tasks, and messages
  - **SweetAlert2 Integration**: Modern modal dialogs for helper selection and messaging
  - **Responsive Grid**: Mobile-optimized 1-2 column layout with scale animations
  - **External JS**: Logic separated to `/js/task/application.js`
- **Dashboard System**:
  - **User Main Dashboard**: Central hub after login with role-based content
  - **Statistics Overview**: Task counts, ratings, and activity summary
  - **Quick Actions**: Role-specific action buttons and navigation
  - **Responsive Layout**: Mobile-optimized card grid system

### 📱 Mobile UX Optimizations (2025-08-09)
- **Scroll Jump Prevention**: Service cards use scale transforms instead of translateY
- **Layout Stability**: Height-based animations prevent menu position changes
- **Checkbox Consistency**: Fixed 16x16px sizing across all browsers (.terms-checkbox class)
- **Touch Optimization**: 44px minimum touch targets, immediate visual feedback
- **Responsive Grids**: 3×2 service card layout on mobile prevents overflow
- **Input Field Consistency**: All form inputs use consistent width and spacing across mobile devices
- **Responsive Form Layout**: Mobile single-column, desktop 2-column grid with proper spacing

### 🔄 Recent Code Optimizations (2025-08-10)
- **Task Detail Optimization**: CSS reduced from 222 lines to 79 lines (64% reduction)
- **Native CSS Adoption**: Replaced JavaScript libraries with native CSS solutions (sticky positioning)
- **Button Design Unification**: Standardized all primary buttons across login, register, create, and detail pages
- **URL Structure Fix**: Corrected task detail navigation from `/task/detail/` to `/tasks/detail/`
- **Code Quality**: Achieved A+ CLAUDE.md compliance with perfect Library-First policy adherence
- **Performance Enhancement**: Eliminated unnecessary JavaScript libraries, improved sticky sidebar performance

## Technical Notes

### Animation System
- **Hero Sections**: CSS keyframes for immediate impact
- **Scroll Elements**: AOS library for viewport-triggered animations
- **Interactive Elements**: Scale transforms for better mobile performance
- **Transitions**: 300ms duration for professional feel

### Form Optimization
- **Spacing**: Form sections use `space-y-6`, tight sections use `space-y-3`
- **Margin Management**: Terms section uses `-mt-5` to eliminate double margins
- **Alpine.js State**: Immediate updates with reactive validation and visual feedback
- **Responsive Grids**: `lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0` for desktop 2-column layout
- **Input Consistency**: All inputs use `w-full` with consistent padding and styling

### Button Design System

**Universal Color Meanings** - Applied across all dashboards:
- 🟦 **Primary (Blue)** - Main actions that users perform most frequently (`bg-blue-600`)
  - "詳細を見る" (View Details)
- 🟢 **Success (Green)** - Positive, completion-oriented actions (`bg-green-600`)  
  - "入金する" (Make Payment), "採用する" (Hire Helper)
- 🟡 **Warning (Yellow)** - Rating and evaluation actions (`bg-yellow-500`)
  - "評価する" (Rate), "依頼者を評価" (Rate Requester)
- ⚪ **Secondary (White)** - Supporting actions with lower priority (`border bg-white text-gray-700`)
  - "編集" (Edit), "連絡" (Contact), "収入確認" (Check Earnings)
- 🔴 **Danger (Red)** - Destructive or withdrawal actions (icon-only, `text-red-600`)
  - Delete, Cancel, Withdraw Application

**Button Hierarchy**: Primary actions get colored backgrounds, secondary actions get white backgrounds with borders, destructive actions are icon-only to prevent accidental clicks.

### Code Architecture
- **Separation of Concerns**: HTML structure, CSS styling, and JavaScript logic properly separated
- **Library-First Implementation**: Maximizes use of established libraries (Alpine.js, Tailwind, Toastr)
- **Custom CSS Minimization**: Only essential custom CSS retained (mobile optimization, complex interactions)
- **Tailwind Optimization**: Inline utilities prioritized over custom classes where possible
- **External File Strategy**: Page-specific CSS/JS files for better caching and maintainability

### Security & Accessibility
- **WCAG 2.1 AA**: Screen reader compatible with proper ARIA attributes
- **Keyboard Navigation**: Full keyboard accessibility maintained
- **Form Security**: Client-side validation with server-side verification required
- **Modal Management**: Proper focus trap and escape key handling

## Database Status & Future Enhancements

### ✅ Current Database State (2025-08-15)
**Production-Ready Schema with 13 Tables:**
- **Master Tables**: role (3 roles), category (6 types), options (4 options), image
- **Core Tables**: user, task  
- **Relationship Tables**: task_application, task_image, task_options, review
- **Q&A System**: question, answer (with hierarchical replies)

**Key Improvements from Initial Design:**
- Added ADMIN role for administration features
- Implemented image deduplication with hash
- Added task options for flexible requirements
- Hierarchical answer system for nested replies
- Comprehensive indexes for query optimization

**Status Enum Values:**
- Task Status: `RECRUITING`, `INPROGRESS`, `COMPLETED`, `CANCELLED`
- Application Status: `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`
- Task Time: `MORNING`, `AFTERNOON`, `EVENING`, `ANYTIME`

### 🔄 Future Enhancements
**Tables to Add Later:**
- **payment** - 결제 관리
- **message** - 메시지 시스템
- **notification** - 알림 관리
- **transaction** - 거래 내역
- **favorite** - 즐겨찾기 기능
- **report** - 신고 관리

This documentation serves as the definitive guide for maintaining and extending TaskHelper's codebase with consistent mobile-optimized user experience.