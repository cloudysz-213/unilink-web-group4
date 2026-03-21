# UniLink Project - Build Instructions



## Project Overview

Build a full-stack Next.js 15 (App Router) application called UniLink for ABC University Student Enquiry and Appointment System. This is a centralized platform for handling student enquiries, appointment scheduling, and AI-powered support.



## Tech Stack

- Next.js 15 (App Router)

- TypeScript

- Tailwind CSS

- shadcn/ui components

- Supabase (Authentication + PostgreSQL Database + Storage)



---



## Folder Structure to Create

unilik-app/

├── stitch/ # UI code từ Stitch (đã có sẵn)

│ ├── landing-page.txt

│ ├── login-page.txt

│ ├── student-dashboard.txt

│ ├── submit-enquiry.txt

│ ├── enquiry-detail.txt

│ ├── admin-dashboard.txt

│ ├── sso-dashboard.txt

│ ├── manager-dashboard.txt

│ ├── appointment-booking.txt

│ ├── profile-settings.txt

│ └── knowledge-base.txt

│

├── app/ # Next.js App Router

│ ├── page.tsx # Landing page (từ stitch/landing-page.txt)

│ ├── layout.tsx # Root layout với providers

│ │

│ ├── login/

│ │ └── page.tsx # Login page (từ stitch/login-page.txt)

│ │

│ ├── dashboard/

│ │ ├── student/

│ │ │ └── page.tsx # Student dashboard (từ stitch/student-dashboard.txt)

│ │ ├── admin/

│ │ │ └── page.tsx # Admin officer dashboard (từ stitch/admin-dashboard.txt)

│ │ ├── sso/

│ │ │ └── page.tsx # SSO dashboard (từ stitch/sso-dashboard.txt)

│ │ └── manager/

│ │ └── page.tsx # Manager dashboard (từ stitch/manager-dashboard.txt)

│ │

│ ├── enquiry/

│ │ ├── new/

│ │ │ └── page.tsx # Submit enquiry form (từ stitch/submit-enquiry.txt)

│ │ └── [id]/

│ │ └── page.tsx # Enquiry detail page (từ stitch/enquiry-detail.txt)

│ │

│ ├── appointments/

│ │ └── page.tsx # Appointment booking (từ stitch/appointment-booking.txt)

│ │

│ ├── profile/

│ │ └── page.tsx # Profile settings (từ stitch/profile-settings.txt)

│ │

│ └── search/

│ └── page.tsx # Knowledge base search (từ stitch/knowledge-base.txt)

│

├── components/ # React components

│ ├── ui/ # shadcn/ui components

│ ├── chatbot/

│ │ └── Chatbot.tsx # Floating AI chatbot

│ ├── layout/

│ │ ├── Header.tsx

│ │ └── Sidebar.tsx

│ └── enquiry/

│ ├── EnquiryTable.tsx

│ ├── EnquiryForm.tsx

│ └── EnquiryStatusBadge.tsx

│

├── lib/

│ ├── supabase/

│ │ ├── client.ts # Supabase client

│ │ └── server.ts # Server-side client

│ └── utils.ts

│

├── middleware.ts # Auth middleware (bảo vệ routes)

├── .env.local # Environment variables

├── tailwind.config.js

├── next.config.js

└── package.json



text



---



## Database Schema (Supabase)



### SQL Script - Copy vào Supabase SQL Editor:



```sql

-- ============================================

-- UNILINK DATABASE SCHEMA

-- ============================================



-- 1. Users table (extends Supabase auth.users)

CREATE TABLE public.users (

  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  email TEXT UNIQUE NOT NULL,

  role TEXT NOT NULL CHECK (role IN ('student', 'admin_officer', 'sso', 'manager', 'director')),

  full_name TEXT NOT NULL,

  student_id TEXT UNIQUE,

  avatar_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



-- 2. Enquiries table

CREATE TABLE public.enquiries (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,

  description TEXT,

  category TEXT NOT NULL CHECK (category IN ('academic', 'visa_international', 'graduation_career', 'welfare', 'financial', 'other')),

  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),

  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'escalated', 'resolved', 'closed')),

  assigned_to UUID REFERENCES public.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  resolved_at TIMESTAMP WITH TIME ZONE,

  resolution_notes TEXT,

  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),

  feedback_comment TEXT

);



-- 3. Appointments table

CREATE TABLE public.appointments (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,

  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  staff_id UUID NOT NULL REFERENCES public.users(id),

  title TEXT,

  start_time TIMESTAMP WITH TIME ZONE NOT NULL,

  end_time TIMESTAMP WITH TIME ZONE NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),

  location TEXT,

  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



-- 4. Documents/Attachments table

CREATE TABLE public.documents (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE,

  file_name TEXT NOT NULL,

  file_url TEXT NOT NULL,

  file_size INTEGER,

  mime_type TEXT,

  uploaded_by UUID REFERENCES public.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



-- 5. Messages/Replies table (for follow-ups)

CREATE TABLE public.messages (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,

  sender_id UUID NOT NULL REFERENCES public.users(id),

  content TEXT NOT NULL,

  is_internal BOOLEAN DEFAULT FALSE, -- Staff-only notes

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



-- 6. Notifications table

CREATE TABLE public.notifications (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,

  message TEXT NOT NULL,

  type TEXT CHECK (type IN ('enquiry_update', 'appointment', 'assignment', 'escalation')),

  read BOOLEAN DEFAULT FALSE,

  link TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



-- ============================================

-- ENABLE ROW LEVEL SECURITY (RLS)

-- ============================================



ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;



-- ============================================

-- RLS POLICIES

-- ============================================



-- Users: Users can view their own profile

CREATE POLICY "Users can view own profile" ON public.users

  FOR SELECT USING (auth.uid() = id);



-- Users: Staff can view all users

CREATE POLICY "Staff can view all users" ON public.users

  FOR SELECT USING (

    EXISTS (

      SELECT 1 FROM public.users

      WHERE users.id = auth.uid()

      AND users.role IN ('admin_officer', 'sso', 'manager', 'director')

    )

  );



-- Enquiries: Students can view their own enquiries

CREATE POLICY "Students view own enquiries" ON public.enquiries

  FOR SELECT USING (auth.uid() = student_id);



-- Enquiries: Staff can view all enquiries

CREATE POLICY "Staff view all enquiries" ON public.enquiries

  FOR SELECT USING (

    EXISTS (

      SELECT 1 FROM public.users

      WHERE users.id = auth.uid()

      AND users.role IN ('admin_officer', 'sso', 'manager', 'director')

    )

  );



-- Enquiries: Staff can update enquiries

CREATE POLICY "Staff update enquiries" ON public.enquiries

  FOR UPDATE USING (

    EXISTS (

      SELECT 1 FROM public.users

      WHERE users.id = auth.uid()

      AND users.role IN ('admin_officer', 'sso', 'manager', 'director')

    )

  );



-- Enquiries: Students can insert their own enquiries

CREATE POLICY "Students insert own enquiries" ON public.enquiries

  FOR INSERT WITH CHECK (auth.uid() = student_id);



-- Appointments: Students view own appointments

CREATE POLICY "Students view own appointments" ON public.appointments

  FOR SELECT USING (auth.uid() = student_id);



-- Appointments: Staff view all appointments

CREATE POLICY "Staff view all appointments" ON public.appointments

  FOR SELECT USING (

    EXISTS (

      SELECT 1 FROM public.users

      WHERE users.id = auth.uid()

      AND users.role IN ('admin_officer', 'sso', 'manager', 'director')

    )

  );



-- Notifications: Users view own notifications

CREATE POLICY "Users view own notifications" ON public.notifications

  FOR SELECT USING (auth.uid() = user_id);



-- ============================================

-- FUNCTIONS & TRIGGERS

-- ============================================



-- Auto-update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS $$

BEGIN

  NEW.updated_at = NOW();

  RETURN NEW;

END;

$$ LANGUAGE plpgsql;



CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users

  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries

  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments

  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- ============================================

-- SEED DATA (for testing)

-- ============================================



-- Note: Users need to be created via Supabase Auth first

-- After creating users, insert into public.users:

-- INSERT INTO public.users (id, email, role, full_name, student_id) VALUES

--   ('[auth_user_id_1]', 'student@unilik.edu', 'student', 'Nguyen Van A', '20240001'),

--   ('[auth_user_id_2]', 'admin@unilik.edu', 'admin_officer', 'Tran Thi B', NULL),

--   ('[auth_user_id_3]', 'sso@unilik.edu', 'sso', 'Le Van C', NULL),

--   ('[auth_user_id_4]', 'manager@unilik.edu', 'manager', 'Pham Thi D', NULL);

```

Features to Implement (Priority Order)

Phase 1: Core Setup (Day 1)

Initialize Next.js project with TypeScript + Tailwind



Install shadcn/ui and configure



Setup Supabase client (both client and server)



Create auth middleware for route protection



Phase 2: Authentication (Day 1-2)

Build Login page with email/password



Implement signup for students



Role-based redirect after login



Protected routes middleware



Phase 3: Student Features (Day 2-3)

Student Dashboard (list enquiries, appointments)



Submit New Enquiry form (with category, priority, file upload)



Enquiry Detail page (view history, add follow-up)



Appointment booking (view staff availability, book slot)



Feedback form after resolution



Phase 4: Staff Features (Day 3-4)

Admin Dashboard (enquiry queue, triage general/complex)



Manual enquiry logging (for email/phone enquiries)



Assign enquiries to SSO



SSO Dashboard (assigned enquiries, respond form)



Escalate to Manager functionality



Resolve enquiry with notes



Phase 5: Manager & Analytics (Day 4-5)

Manager Dashboard (overview, escalated queue)



Analytics with Recharts (volume trends, resolution time)



Monthly report export (CSV/PDF)



Phase 6: AI & Advanced Features (Day 5-6)

Floating AI Chatbot (FAQ with rule-based or OpenAI/Grok)



Auto-classify enquiry category on submit



Auto-route to SSO based on category



Knowledge base search (full-text search)



Phase 7: Polish & Deploy (Day 6-7)

Notifications system (toast + in-app)



Profile settings page



Dark mode toggle



Deploy to Vercel



Step-by-Step Build Commands

Step 1: Initialize Next.js Project

bash

npx create-next-app@latest . --typescript --tailwind --app

# When prompted:

#   Would you like to use src/ directory? → No

#   Would you like to use import alias? → Yes

Step 2: Install shadcn/ui

bash

npx shadcn@latest init

# Choose:

#   TypeScript: yes

#   Style: default

#   Base color: slate

#   Use CSS variables: yes



# Add components as needed:

npx shadcn@latest add button card input form table dialog calendar select tabs toast alert

Step 3: Install Supabase

bash

npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs

Step 4: Install Additional Dependencies

bash

npm install recharts react-hook-form zod @hookform/resolvers lucide-react date-fns react-day-picker

Step 5: Create Environment File

Create .env.local:



text

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Integration with Stitch UI Code

Each page in stitch/ folder contains HTML/CSS code from Stitch. When building each page:



Read the UI code from corresponding .txt file



Convert HTML to JSX



Replace static content with dynamic data from Supabase



Replace static classes with Tailwind + shadcn components



Maintain the visual design and layout



Example conversion pattern:



Static table → shadcn Table component with dynamic data



Static form → shadcn Form with react-hook-form



Static buttons → shadcn Button with onClick handlers



Environment Variables Summary

text

# Supabase

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=



# AI (optional, for chatbot)

OPENAI_API_KEY=

GROK_API_KEY=



# Outlook Calendar (optional, for future integration)

OUTLOOK_CLIENT_ID=

OUTLOOK_CLIENT_SECRET=

OUTLOOK_TENANT_ID=

Deployment to Vercel

Push code to GitHub



Go to vercel.com



Import GitHub repository



Add environment variables



Deploy



Notes

All UI code from Stitch is in /stitch folder - use as reference



Focus on making it functional first, then polish UI



Use shadcn components for consistency



Implement RLS in Supabase for security



Test with different user roles before deployment



text
