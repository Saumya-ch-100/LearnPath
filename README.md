# 🎓 LearnPath

> A modern, full-stack learning management platform built with the MERN stack, featuring AI-powered mentorship, progress tracking, and personalized learning paths.

**🔗 Repository:** [https://github.com/Saumya-ch-100/LearnPath](https://github.com/Saumya-ch-100/LearnPath)

**Business Model:** B2B2C platform designed for universities, bootcamps, and educational institutions to provide comprehensive learning management to their students. Think Udemy for Business or LinkedIn Learning for Enterprise.

![LearnPath Banner](https://img.shields.io/badge/MERN-Stack-success?style=for-the-badge) ![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge) ![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge) ![React](https://img.shields.io/badge/react-18.2.0-61dafb?style=for-the-badge)

---

## ✨ Features

### 👨‍🎓 For Learners
- **Personalized Learning Paths** - Create custom learning journeys based on your goals
- **Skill Proficiency Tracking** - Monitor your progress across multiple skills with visual charts
- **Resource Library** - Access curated learning resources with progress tracking
- **Learning Logs** - Document your daily learning activities and reflections
- **Milestone Management** - Set and track learning milestones with reminders
- **Mentor System** - Connect with experienced mentors for guidance and feedback
- **Q&A Platform** - Ask questions and get personalized answers from your mentor
- **Progress Sharing** - Share your achievements with mentors for feedback
- **Interactive Dashboard** - Visual analytics with charts and progress indicators
- **Streak Tracking** - Maintain learning consistency with daily streak counters
- **Notifications** - Real-time alerts for milestones, mentor assignments, and Q&A replies

### 👨‍🏫 For Mentors
- **Learner Management** - Track multiple learners' progress in one place
- **Feedback System** - Provide structured feedback (encouragement, suggestions, concerns)
- **Q&A Response** - Answer learner questions with notification system
- **Progress Insights** - View detailed learner analytics and learning patterns
- **Learner Profiles** - Access comprehensive learner information and history
- **Mentor Dashboard** - Dedicated dashboard with assigned learners overview

### 👑 For Admins
- **User Management** - Create, edit, and manage all user accounts (learners, mentors, admins)
- **Skill Management** - Add, edit, and maintain the skill catalog with categories
- **Resource Management** - Curate and organize learning resources (courses, books, tutorials, videos)
- **Mentor Assignment** - Assign mentors to learners and manage mentorship relationships
- **Platform Analytics** - Monitor platform statistics, user distribution, and engagement metrics
- **System Monitoring** - Track platform health, active users, and resource utilization

---

## 🚀 Tech Stack

### Frontend
- **React 18.2** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors for auth
- **Recharts** - Beautiful data visualizations and charts
- **Lucide React** - Modern icon library (600+ icons)
- **Tailwind CSS** - Utility-first CSS framework with custom theme

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework with RESTful APIs
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing with salt rounds
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** >= 18.0.0
- **MongoDB** (local or cloud Atlas)
- **npm** or **yarn**

### Quick Start (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/Saumya-ch-100/LearnPath.git
cd LearnPath
```

2. **Install all dependencies (backend + frontend)**
```bash
npm run install:all
```

3. **Setup environment variables**

Create `/backend/.env`:
```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/learnpath
JWT_SECRET=your_super_secret_jwt_key_here_change_this
NODE_ENV=development
```

4. **Start both servers**
```bash
# From root directory
npm start
```

🎉 **Done!** Backend runs on `http://localhost:5050`, Frontend on `http://localhost:5173`

> 💡 **First Time Setup:** Register your first user at `/register` - the first user should be made an admin using the `makeAdmin.js` script.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5050/api
```

### Authentication
All protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔑 Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "male",
  "role": "learner"  // learner (default), mentor, admin
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "learner"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>

{
  "name": "John Smith",
  "bio": "Learning full-stack development"
}
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer <token>

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

### 🎯 Skills Endpoints

#### Get All Skills
```http
GET /skills?category=Frontend&search=react
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `search` (optional) - Search by name

#### Get Skill by ID
```http
GET /skills/:id
```

#### Create Skill (Admin only)
```http
POST /skills
Authorization: Bearer <admin_token>

{
  "name": "React.js",
  "description": "A JavaScript library for building user interfaces",
  "category": "Frontend"
}
```

#### Update Skill (Admin only)
```http
PUT /skills/:id
Authorization: Bearer <admin_token>

{
  "name": "Advanced React.js",
  "description": "Updated description"
}
```

#### Delete Skill (Admin only)
```http
DELETE /skills/:id
Authorization: Bearer <admin_token>
```

---

### 📚 User Skills Endpoints

#### Add Skill to Profile
```http
POST /user-skills
Authorization: Bearer <token>

{
  "skillId": "64f8a...",
  "currentLevel": 3,
  "targetLevel": 8
}
```

**Levels:** 1-10 (1 = Beginner, 10 = Expert)

#### Get My Skills
```http
GET /user-skills
Authorization: Bearer <token>
```

#### Update Skill Progress
```http
PUT /user-skills/:id
Authorization: Bearer <token>

{
  "currentLevel": 5,
  "notes": "Completed advanced React course"
}
```

#### Delete Skill from Profile
```http
DELETE /user-skills/:id
Authorization: Bearer <token>
```

---

### 📖 Resources Endpoints

#### Get All Resources
```http
GET /resources?type=course&skill=64f8a...&level=beginner
```

**Query Parameters:**
- `type` - course, book, tutorial, video
- `skill` - Filter by skill ID
- `level` - beginner, intermediate, advanced
- `provider` - Filter by provider name
- `search` - Search by title

#### Get Resource by ID
```http
GET /resources/:id
```

#### Create Resource (Admin only)
```http
POST /resources
Authorization: Bearer <admin_token>

{
  "title": "The Complete React Course",
  "description": "Learn React from scratch",
  "type": "course",
  "url": "https://example.com/course",
  "level": "beginner",
  "estimatedHours": 20,
  "provider": "Udemy",
  "skillIds": ["64f8a..."]
}
```

#### Update Resource (Admin only)
```http
PUT /resources/:id
Authorization: Bearer <admin_token>
```

#### Delete Resource (Admin only)
```http
DELETE /resources/:id
Authorization: Bearer <admin_token>
```

---

### 📝 Enrollment Endpoints

#### Enroll in Resource
```http
POST /enrollments
Authorization: Bearer <token>

{
  "resourceId": "64f8a..."
}
```

#### Get My Enrollments
```http
GET /enrollments
Authorization: Bearer <token>
```

#### Update Enrollment Progress
```http
PUT /enrollments/:id/progress
Authorization: Bearer <token>

{
  "status": "in-progress",  // enrolled, in-progress, completed
  "progress": 45,           // 0-100%
  "notes": "Completed modules 1-5"
}
```

---

### 📊 Learning Logs Endpoints

#### Create Learning Log
```http
POST /logs
Authorization: Bearer <token>

{
  "date": "2025-12-14",
  "skillId": "64f8a...",
  "resourceId": "64f8b...",  // optional
  "durationMinutes": 120,
  "notes": "Learned React hooks in depth",
  "reflection": "Great progress today!"
}
```

#### Get My Learning Logs
```http
GET /logs?startDate=2025-12-01&endDate=2025-12-31
Authorization: Bearer <token>
```

#### Update Learning Log
```http
PUT /logs/:id
Authorization: Bearer <token>
```

#### Delete Learning Log
```http
DELETE /logs/:id
Authorization: Bearer <token>
```

---

### 🏆 Milestones Endpoints

#### Create Milestone
```http
POST /milestones
Authorization: Bearer <token>

{
  "title": "Complete React Course",
  "description": "Finish all modules",
  "skillId": "64f8a...",
  "targetDate": "2025-12-31"
}
```

#### Get My Milestones
```http
GET /milestones
Authorization: Bearer <token>
```

#### Update Milestone
```http
PUT /milestones/:id
Authorization: Bearer <token>

{
  "status": "completed",  // pending, in-progress, completed, overdue
  "actualCompletionDate": "2025-12-15"
}
```

#### Delete Milestone
```http
DELETE /milestones/:id
Authorization: Bearer <token>
```

---

### 👥 Mentor Endpoints

#### Get All Available Mentors
```http
GET /mentors
Authorization: Bearer <token>
```

#### Assign Mentor to Learner (Admin only)
```http
POST /learners/assign-mentor
Authorization: Bearer <admin_token>

{
  "learnerId": "64f8a...",
  "mentorId": "64f8b..."
}
```

#### Get My Learners (Mentor only)
```http
GET /mentors/my-learners
Authorization: Bearer <mentor_token>
```

#### Get Learner Progress (Mentor only)
```http
GET /learners/:learnerId/progress
Authorization: Bearer <mentor_token>
```

---

### 💬 Q&A Endpoints

#### Ask Question (Learner)
```http
POST /questions
Authorization: Bearer <learner_token>

{
  "question": "How do I use React hooks?",
  "context": "I'm learning React and confused about useState"
}
```

#### Get My Questions (Learner)
```http
GET /questions
Authorization: Bearer <learner_token>
```

#### Get Questions for My Learners (Mentor)
```http
GET /questions/for-mentor
Authorization: Bearer <mentor_token>
```

#### Reply to Question (Mentor)
```http
POST /questions/:id/reply
Authorization: Bearer <mentor_token>

{
  "answer": "useState is a hook that lets you add state to functional components..."
}
```

---

### 🔔 Notification Endpoints

#### Get My Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

#### Mark Notification as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
POST /notifications/mark-all-read
Authorization: Bearer <token>
```

#### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

---

### 📈 Progress Analytics Endpoints

#### Get Progress Summary
```http
GET /progress?startDate=2025-12-01&endDate=2025-12-31
Authorization: Bearer <token>
```

**Returns:**
```json
{
  "totalHours": 120,
  "hoursPerDay": [...],      // Array of {date, hours}
  "hoursPerSkill": [...],    // Array of {skillName, hours}
  "enrollmentProgress": [...], // Resource completion stats
  "weeklyTotal": 35,
  "monthlyTotal": 120
}
```

---

### 🔐 Admin Endpoints

#### Get Platform Analytics (Admin only)
```http
GET /admin/analytics
Authorization: Bearer <admin_token>
```

**Returns:**
```json
{
  "totalUsers": 1234,
  "totalSkills": 45,
  "totalResources": 89,
  "roleDistribution": {
    "learners": 1100,
    "mentors": 120,
    "admins": 14
  },
  "recentUsers": [...]
}
```

#### Get All Users (Admin only)
```http
GET /admin/users?role=learner&search=john
Authorization: Bearer <admin_token>
```

#### Update User (Admin only)
```http
PUT /admin/users/:id
Authorization: Bearer <admin_token>

{
  "name": "Updated Name",
  "role": "mentor"
}
```

#### Delete User (Admin only)
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>
```

---

### 🌐 Onboarding Endpoints

#### Complete Learner Onboarding
```http
POST /onboarding/learner
Authorization: Bearer <token>

{
  "goals": ["Learn React", "Master JavaScript"],
  "learningStyle": "visual",
  "hoursPerWeek": 10,
  "preferredTopics": ["Frontend", "Backend"],
  "experience": "beginner"
}
```

#### Complete Mentor Onboarding
```http
POST /onboarding/mentor
Authorization: Bearer <token>

{
  "specializations": ["React", "Node.js"],
  "experience": "5 years of software engineering",
  "availability": "Weekdays 6-9 PM",
  "maxLearners": 5
}
```

---

## 🗂️ Project Structure

```
LearnPath/
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, skills, resources, etc.)
│   │   ├── models/           # MongoDB schemas (User, Skill, Resource, etc.)
│   │   ├── routes/           # API routes grouped by feature
│   │   ├── middleware/       # Auth & authorization middleware
│   │   ├── utils/            # JWT utilities
│   │   ├── config/           # Database configuration
│   │   ├── scripts/          # Seed and utility scripts
│   │   └── index.js          # Server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client with interceptors
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/           # UI primitives (Button, Card, Badge, etc.)
│   │   │   ├── charts/       # Chart components (Recharts)
│   │   │   ├── layout/       # Sidebar, TopNav
│   │   │   └── modals/       # Modal components
│   │   ├── context/          # React context (AuthContext)
│   │   ├── layouts/          # Page layouts (AuthLayout, MainLayout)
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── skills/       # Skill management
│   │   │   ├── resources/    # Resource library
│   │   │   ├── logs/         # Learning logs
│   │   │   ├── milestones/   # Milestone tracking
│   │   │   ├── profile/      # User profile
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── mentor/       # Mentor pages
│   │   │   ├── onboarding/   # Onboarding flows
│   │   │   ├── landing/      # Public landing page
│   │   │   ├── legal/        # Privacy, Terms pages
│   │   │   └── misc/         # 404, etc.
│   │   ├── routes/           # React Router setup
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── package.json              # Root package (runs both servers)
├── .gitignore
└── README.md
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with HttpOnly cookies
- **Password Hashing** - Bcrypt with 10 salt rounds
- **Role-Based Access Control (RBAC)** - Three roles: Learner, Mentor, Admin
- **Protected Routes** - Frontend and backend route protection with middleware
- **Input Validation** - Server-side request validation
- **Authorization Middleware** - Role-specific access control for sensitive endpoints
- **CORS Configuration** - Controlled cross-origin requests
- **Environment Variables** - Sensitive data in `.env` files
- **Token Expiration** - Configurable JWT expiration times

---

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon (auto-restart on changes)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

### Run Both Servers Simultaneously
```bash
# From root directory
npm start
```

### Build Frontend for Production
```bash
cd frontend
npm run build        # Creates optimized build in dist/
npm run preview      # Preview production build locally
```

### Make User Admin
```bash
cd backend
node src/scripts/makeAdmin.js <email>
```

---

## 📊 Database Schema

### Collections
- **users** - User accounts with roles and profiles
- **skills** - Skill catalog with categories and descriptions
- **userSkills** - Learner skill progress tracking
- **resources** - Learning resources (courses, books, tutorials, videos)
- **enrollments** - User enrollments in resources with progress
- **learningLogs** - Daily learning activity logs
- **milestones** - User-defined learning goals with deadlines
- **notifications** - In-app notifications for users
- **mentorQuestions** - Q&A between learners and mentors
- **mentorFeedback** - Structured feedback from mentors to learners
- **sharedAccess** - Progress sharing permissions

---

## 🌟 Key Features Implemented

✅ **Authentication & Authorization**
- JWT-based login/register
- Role-based access control (Learner, Mentor, Admin)
- Protected routes on frontend and backend
- Profile management with password change

✅ **Skill Management**
- Browse 40+ skills across 13 categories
- Add skills to profile with current/target levels
- Track skill progress with visual indicators
- Admin CRUD operations for skills

✅ **Learning Resources**
- Resource library with courses, books, tutorials, videos
- Enroll in resources with progress tracking
- Filter by type, level, skill, provider
- Admin resource management

✅ **Progress Tracking**
- Learning logs with duration, notes, reflections
- Visual analytics with charts (Recharts)
- Hours by day, week, month
- Skill-wise progress breakdown

✅ **Milestones & Goals**
- Set learning milestones with target dates
- Track status (pending, in-progress, completed, overdue)
- Milestone reminders and notifications

✅ **Mentor System**
- Assign mentors to learners
- Mentor dashboard with learner list
- View detailed learner progress
- Q&A platform for mentor-learner communication

✅ **Notifications**
- Real-time notification system
- Types: milestone reminders, mentor assignments, Q&A replies
- Unread count badge
- Mark as read/delete functionality

✅ **Admin Dashboard**
- Platform analytics (users, skills, resources)
- User management (create, edit, delete)
- Skill and resource management
- Mentor assignment

✅ **Onboarding Flows**
- Learner onboarding (goals, learning style, availability)
- Mentor onboarding (specializations, experience, capacity)

✅ **Landing Page**
- Modern 2025 design with gradients and animations
- Feature showcase
- Role-specific information
- Privacy policy and terms of service

✅ **Legal Pages**
- Comprehensive privacy policy
- Terms of service
- Contact information

---

## 📈 Future Enhancements

- [ ] Real-time chat between mentors and learners (Socket.io)
- [ ] Video conferencing integration (WebRTC)
- [ ] Gamification with badges and leaderboards
- [ ] AI-powered learning recommendations (ML models)
- [ ] Mobile app (React Native)
- [ ] Email notifications (Nodemailer, SendGrid)
- [ ] Social features (forums, discussion groups)
- [ ] Certificate generation (PDF)
- [ ] Payment integration (Stripe) for premium content
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Export learning data (PDF, CSV)
- [ ] Calendar integration for scheduling
- [ ] Advanced analytics dashboard with charts
- [ ] Peer-to-peer learning groups
- [ ] Integration with external platforms (Coursera, Udemy APIs)

---

## 🐛 Known Issues

1. **Duplicate Index Warning** - MongoDB throws a duplicate index warning on User email field. This is a known Mongoose issue and doesn't affect functionality.
2. **Port Conflicts** - If port 5173 is in use, Vite automatically switches to 5174. Backend must run on 5050.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use **ESLint** for linting
- Follow **Airbnb JavaScript Style Guide**
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features

---

## 📄 License

This project is licensed under the **MIT License**. See `LICENSE` file for details.

---

## 👨‍💻 Author

**Saumya Chaturvedi**
- GitHub: [@Saumya-ch-100](https://github.com/Saumya-ch-100)
- Email: hello@learnpath.com

---

## 🙏 Acknowledgments

- **MongoDB** for the excellent NoSQL database
- **React** team for the amazing UI library
- **Express.js** for the robust backend framework
- **Vite** for the blazing-fast build tool
- **Recharts** for beautiful data visualizations
- **Lucide** for the comprehensive icon library
- **Tailwind CSS** for the utility-first styling approach
- All open-source contributors who make projects like this possible

---

## 📞 Support & Contact

- **Email:** hello@learnpath.com
- **GitHub:** [https://github.com/Saumya-ch-100/LearnPath](https://github.com/Saumya-ch-100/LearnPath)
- **Issues:** [GitHub Issues](https://github.com/Saumya-ch-100/LearnPath/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Saumya-ch-100/LearnPath/discussions)

---

<div align="center">

### 🌟 Star this repo if you find it helpful!

Made with ❤️ and ☕ by Saumya

**LearnPath** - Empowering learners worldwide 🚀

</div>
