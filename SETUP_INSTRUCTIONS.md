# BIET Admin Portal - Setup Instructions

## 🔐 Authentication System Overview

This portal uses **Supabase Authentication** with **role-based access control** (Admin, Teacher, Student).

---

## 📋 Initial Setup

### Step 1: Create Initial Admin Account

The system requires an initial admin account to be created. Use the following credentials:

**Admin Credentials:**
- Username: `admin_aiml`
- Password: `sameer@aiml`

To create the admin account, run this in your browser console (on the login page):

```javascript
// Open browser console (F12)
const { supabase } = await import('./src/integrations/supabase/client.ts');

const response = await supabase.functions.invoke('create-admin', {
  body: {
    username: 'admin_aiml',
    password: 'sameer@aiml',
    fullName: 'Admin AIML'
  }
});

console.log('Admin created:', response);
```

### Step 2: Login as Admin

1. Navigate to `/login`
2. Enter username: `admin_aiml`
3. Enter password: `sameer@aiml`
4. Click "Sign In"

You'll be redirected to the Admin Dashboard.

---

## 🏗️ Architecture

### Database Schema

**Tables:**
- `user_roles` - Stores user roles (admin, teacher, student)
- `profiles` - User profile information
- `students` - Student records (linked to auth users)
- `teachers` - Teacher records (linked to auth users)
- `marks` - Student marks/grades
- `attendance` - Student attendance records
- `announcements` - System announcements

### Role-Based Access

**Admin (`admin_aiml`):**
- Full access to all features
- Create/manage Teacher accounts
- Create/manage Student accounts
- View/edit all marks and attendance
- Manage announcements

**Teacher:**
- Create Student accounts
- Manage assigned students
- Mark attendance
- Upload test results
- View analytics

**Student:**
- View own profile
- View attendance records
- View test results
- Download report card (PDF)

---

## 🔧 Account Creation Flows

### Admin Creates Teacher

1. Login as admin
2. Navigate to "Teachers" tab
3. Click "Create Teacher Account"
4. Fill in details:
   - Username (e.g., `teacher_john`)
   - Password
   - Full Name
   - Subject
   - Department
   - Phone (optional)
5. Teacher can now login with username@biet.teacher format

### Admin/Teacher Creates Student

1. Login as admin or teacher
2. Navigate to "Students" tab
3. Click "Create Student Account"
4. Fill in details:
   - Username (e.g., `student_2024001`)
   - Password
   - Full Name
   - Roll Number
   - Department
   - Semester
   - Section
   - Phone (optional)
5. Student can now login with username@biet.student format

---

## 🔑 Login Format

- **Admin:** Use username directly (`admin_aiml`)
- **Teacher:** Use username directly (`teacher_john`)
- **Student:** Use username directly (`student_2024001`)

The system automatically appends the correct email domain based on the role.

---

## 🛡️ Security Features

1. **Role-Based RLS Policies:**
   - Students can only view their own data
   - Teachers can manage students
   - Admins have full access

2. **Secure Password Hashing:**
   - Supabase Auth handles password hashing
   - No plaintext passwords stored

3. **JWT Authentication:**
   - Session-based authentication
   - Automatic token refresh

4. **Protected Edge Functions:**
   - Role verification on server-side
   - Admin-only and Teacher-only endpoints

---

## 📊 API Endpoints (Edge Functions)

| Endpoint | Method | Auth Required | Role | Description |
|----------|--------|---------------|------|-------------|
| `/create-admin` | POST | No | None | Create initial admin (one-time) |
| `/create-teacher` | POST | Yes | Admin | Create teacher account |
| `/create-student` | POST | Yes | Admin/Teacher | Create student account |

---

## 🎯 Next Steps

After completing the initial setup:

1. **Create Teacher Accounts:**
   - Login as admin
   - Go to Teachers tab
   - Create accounts for your teaching staff

2. **Create Student Accounts:**
   - Login as admin or teacher
   - Go to Students tab
   - Create accounts for students

3. **Add Data:**
   - Upload marks/grades
   - Record attendance
   - Post announcements

4. **Test Role Access:**
   - Login as teacher to verify permissions
   - Login as student to verify limited access

---

## 🔧 Troubleshooting

### Can't Login
- Ensure admin account was created successfully
- Check browser console for errors
- Verify username format (no @domain needed)

### RLS Errors
- Ensure user has the correct role in `user_roles` table
- Check that student/teacher records are linked to auth user

### Edge Function Errors
- Check edge function logs in Supabase dashboard
- Verify authorization header is being sent

---

## 📝 Admin Credentials Reminder

**Default Admin:**
- Username: `admin_aiml`
- Password: `sameer@aiml`

**Important:** Change the admin password after initial setup for security.

---

© @ananta - BIET Admin Portal
