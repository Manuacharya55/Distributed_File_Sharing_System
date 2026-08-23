# 🌐 ShareFlow — Distributed File Sharing & Cloud Storage System

A modern, enterprise-grade **Distributed Cloud Storage & File Sharing Platform** designed with a decoupled storage plane architecture. Built with **React 19**, **Express 5**, **MongoDB**, **Redis**, **BullMQ**, and **AWS Cloud Services (S3 & SES)**.

The system scales horizontally across an **Application Load Balancer (ALB)** and **Auto Scaling Group (ASG)**, offloads binary file streams directly to **AWS S3** via presigned URLs to eliminate server RAM bottlenecks, protects sessions with **Token Family JWT Rotation**, and executes asynchronous batch tasks using **BullMQ background workers**.

---

## 📑 Table of Contents
1. [Project Name & Overview](#-project-name--overview)
2. [Tech Stack](#-tech-stack)
   - [Frontend Tech Stack](#frontend-tech-stack)
   - [Backend Tech Stack](#backend-tech-stack)
   - [Cloud & Infrastructure](#cloud--infrastructure)
3. [System Requirements & Prerequisites](#-system-requirements--prerequisites)
4. [High-Level Design (HLD) & Architecture](#-high-level-design-hld--architecture)
   - [End-to-End Infrastructure Diagram (ALB + ASG)](#end-to-end-infrastructure-diagram-alb--asg)
   - [Core Architectural Pipelines](#core-architectural-pipelines)
     - [1. Direct Client-to-S3 Presigned Upload Pipeline](#1-direct-client-to-s3-presigned-upload-pipeline)
     - [2. Secure Presigned Download & Preview Resolution](#2-secure-presigned-download--preview-resolution)
     - [3. In-Memory JWT Authentication & Token Family Rotation](#3-in-memory-jwt-authentication--token-family-rotation)
     - [4. Distributed Asynchronous Worker Queues (BullMQ)](#4-distributed-asynchronous-worker-queues-bullmq)
     - [5. Soft-Delete Trash Bin & S3 Batch Garbage Collection](#5-soft-delete-trash-bin--s3-batch-garbage-collection)
     - [6. Public Link Sharing System](#6-public-link-sharing-system)
   - [Database Schema & Indexing Design](#database-schema--indexing-design)
5. [Folder Structure](#-folder-structure)
   - [Client Structure](#client-folder-structure)
   - [Server Structure](#server-folder-structure)
6. [Installation & Setup Guide](#-installation--setup-guide)
   - [1. Clone Repository](#1-clone-repository)
   - [2. Backend Setup (`server`)](#2-backend-setup-server)
   - [3. Frontend Setup (`client`)](#3-frontend-setup-client)
   - [4. Running the Complete System](#4-running-the-complete-system)
7. [API Reference Summary](#-api-reference-summary)

---

## 🌟 Project Name & Overview

**ShareFlow** is an end-to-end distributed file sharing and cloud management system. 

Unlike traditional file upload platforms that route large multi-part file streams through application servers (saturating CPU, network bandwidth, and memory), ShareFlow implements a **Control Plane vs. Data Plane separation**:
- **Control Plane (Node.js/Express API cluster)**: Handles authentication, metadata indexing, user quota enforcement, permission resolution, and signed URL generation.
- **Data Plane (AWS S3)**: Handles high-throughput direct binary uploads and downloads directly to/from client browsers.
- **Asynchronous Plane (Redis + BullMQ)**: Orchestrates background email dispatch and multi-object S3 garbage collection without blocking the main event loop.

---

## 🛠 Tech Stack

### Frontend Tech Stack
- **Framework**: React 19 (`v19.2.8`)
- **Build Tool**: Vite (`v8.2.0`)
- **Routing**: React Router DOM (`v7.18.2`)
- **Server State & Caching**: TanStack React Query (`v5.101.4`)
- **Styling**: Tailwind CSS (`v4.3.3`) with `@tailwindcss/vite`
- **HTTP Client**: Axios (`v1.19.0`) with request/response interceptors & token refresh queue
- **Forms & Validation**: React Hook Form (`v7.85.0`) + Zod (`v4.4.3`) + `@hookform/resolvers`
- **State Management**: React Context (`AuthContext`, `ToastContext`) + Zustand (`v5.0.14`)
- **Icons**: Lucide React (`v1.33.0`)

### Backend Tech Stack
- **Runtime**: Node.js (ES Modules, `type: "module"`)
- **Web Framework**: Express 5 (`v5.2.1`)
- **Primary Database**: MongoDB with Mongoose 9 (`v9.9.1`)
- **Caching & Key-Value Store**: Redis (`ioredis v6.0.0`)
- **Distributed Job Queue**: BullMQ (`v6.1.1`)
- **Security & Cryptography**: Argon2 (`v0.45.1`), JSONWebToken (`v9.0.3`), Helmet (`v8.3.0`), Express Rate Limit (`v8.6.2`)
- **Validation**: Zod (`v4.4.3`)
- **File Ingestion (Avatars)**: Multer 2 (`v2.2.0`) (Memory Storage)
- **Logging**: Morgan (`v1.11.0`) & Custom ISO Timestamp Logger

### Cloud & Infrastructure
- **Object Storage**: AWS S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **Email Service**: AWS SESv2 (`@aws-sdk/client-sesv2`, Nodemailer `v9.0.5`)
- **Deployment Architecture**: AWS Application Load Balancer (ALB) + Auto Scaling Group (ASG) + Multi-AZ EC2 / ECS

---

## 📋 System Requirements & Prerequisites

Ensure the following environments and accounts are prepared:

| Requirement | Minimum Version | Notes |
|---|---|---|
| **Node.js** | `v18.0.0+` (LTS recommended) | Required for ES Modules & modern native fetch |
| **npm** / **pnpm** | `v9.0.0+` | Package manager |
| **MongoDB** | `v6.0+` | Local instance (`mongodb://localhost:27017`) or MongoDB Atlas |
| **Redis** | `v6.0+` | Local instance (`redis://127.0.0.1:6379`) or Redis Cloud |
| **AWS Account** | Active Account | Configured S3 Bucket with CORS enabled and SES verified sender email |

---

## 🏛 High-Level Design (HLD) & Architecture

![ShareFlow High-Level Architecture (HLD)](./images/hld.png)

### End-to-End Infrastructure Overview (ALB + ASG)

The system is designed for high availability, fault tolerance, and horizontal scalability:
- **DNS & CDN Layer**: Route 53 DNS routes traffic, while CloudFront CDN delivers static frontend assets globally.
- **Load Balancing (ALB)**: AWS Application Load Balancer distributes incoming HTTPS requests across multi-Availability Zone (Multi-AZ) target groups with automated health probes.
- **Auto Scaling Group (ASG)**: Dynamically scales Node.js / Express API server instances based on CPU utilization and request throughput thresholds.
- **Decoupled Data & Storage Plane**:
  - **MongoDB Cluster (Replica Set)**: Stores user accounts, directory structures, file metadata, and share links with optimized compound indexing.
  - **Redis Key-Value & Queues**: Maintains active JWT family JTI rotation tokens, 15-minute OTP verifications, and BullMQ queue states.
  - **AWS S3 Private Bucket**: Direct client binary uploads and downloads via signed URLs, eliminating server memory and CPU overhead.
- **Asynchronous Worker Layer (BullMQ)**:
  - **Email Worker**: Consumes `email-queue` to dispatch transactional OTP emails through **AWS SES**.
  - **Folder Cleanup Worker**: Consumes `folder-cleanup-queue` to batch delete S3 objects (1,000 keys per chunk) and cascade-clean database records.

---

### Core Architectural Pipelines

#### 1. Direct Client-to-S3 Presigned Upload Pipeline
1. **Quota & Destination Check**: Client sends file metadata (`filename`, `mimeType`, `size`, optional `folderId`) to `POST /api/v1/file/presigned-url`. The server validates that `user.usedStorage + size <= storageLimit` ($1\text{ GB}$).
2. **Presigned PUT URL Generation**: The server generates a unique S3 key (`uploads/<userId>/<timestamp>-<sanitizedName>`) and returns a 15-minute cryptographically signed S3 PUT URL.
3. **Direct Upload**: The client browser streams the binary payload directly to AWS S3 using the presigned URL, completely bypassing the Node.js event loop and eliminating server memory allocation.
4. **Upload Confirmation**: Upon S3 completion, the client triggers `POST /api/v1/file/confirm-upload`. The server saves the file document in MongoDB and atomically increments the user's `usedStorage`.

```
[ Client Browser ]
       │
       │  1. POST /api/v1/file/presigned-url
       ▼
[ Express API ] ──── Check Quota (≤ 1GB) ────► [ MongoDB ]
       │
       │  2. Generate Signed PUT URL (15m TTL)
       ▼
[ AWS S3 Bucket ]
       │
       │  3. Return Presigned Upload URL
       ▼
[ Client Browser ] ═══ 4. Direct Binary PUT Upload ═══► [ AWS S3 Bucket ]
       │
       │  5. POST /api/v1/file/confirm-upload
       ▼
[ Express API ] ──── Insert Record & Inc Quota ────► [ MongoDB ]
```

---

#### 2. Secure Presigned Download & Preview Resolution
- S3 objects remain private.
- When a user views or downloads a file (`GET /api/v1/file/:id` or folder contents), the server mints dynamic 1-hour presigned GET URLs with specific HTTP `Content-Disposition` headers:
  - **Preview**: `inline; filename="file.ext"` (renders in the in-browser modal viewer).
  - **Download**: `attachment; filename="file.ext"` (forces browser file download).

---

#### 3. In-Memory JWT Authentication & Token Family Rotation
- **Access Tokens**: Short-lived JWTs stored strictly **in-memory** on the React client to prevent XSS exfiltration.
- **Refresh Tokens**: Long-lived tokens stored in secure, `httpOnly`, `SameSite=Strict` cookies.
- **Token Family & Replay Detection**:
  - Each refresh token contains a unique `jti` and `familyId`.
  - Redis tracks the valid `jti` for each user family: `refresh_token:<userId>:<familyId>`.
  - When refreshed, if the incoming `jti` does not match Redis, a **token replay attack** is identified. The system immediately revokes the entire token family from Redis, forcing all instances to re-authenticate.

---

#### 4. Distributed Asynchronous Worker Queues (BullMQ)
- **`email-queue`**:
  - Dispatches OTP verification emails asynchronously via AWS SES without delaying user registration responses.
  - Configured with exponential backoff (3 attempts).
- **`folder-cleanup-queue`**:
  - Offloads deep recursive folder deletions.
  - Batches S3 deletion calls (up to 1,000 keys per chunk) via `DeleteObjectsCommand`.
  - Deletes database records and decrements user storage quota accurately.

---

#### 5. Soft-Delete Trash Bin & S3 Batch Garbage Collection
- Moving an item to trash (`DELETE /api/v1/file/:id` or `folder/:id`) sets `isDeleted: true` and timestamps `deletedAt`.
- Restoring an item (`PATCH /api/v1/file/:id/restore`) resets the flags instantly.
- Permanently deleting an item or triggering "Empty Trash" queues background S3 object deletion and removes database records.

---

#### 6. Public Link Sharing System
- Users can toggle public sharing on any file (`PATCH /api/v1/share/file/:id/toggle`).
- Generates a 24-character hexadecimal `shareToken`.
- Unauthenticated guests can view and download the resource at `/share/:shareToken` via public endpoint `GET /api/v1/share/access/:shareToken`.

---

### Database Schema & Indexing Design

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│             USERS              │       │            FOLDERS             │
├────────────────────────────────┤       ├────────────────────────────────┤
│ _id: ObjectId                  │1     *│ _id: ObjectId                  │
│ name: String                   │───────│ name: String                   │
│ email: String (Unique, Indexed)│       │ user: ObjectId (Ref: Users)    │
│ password: String (Argon2id)    │       │ isDeleted: Boolean             │
│ usedStorage: Number            │       │ deletedAt: Date                │
│ storageLimit: Number (1GB)     │       │ createdAt / updatedAt: Date    │
│ isVerified: Boolean            │       └────────────────────────────────┘
│ avatar: String                 │                       │ 1
└────────────────────────────────┘                       │
                │ 1                                      │ *
                │                                        ▼
                │ *                      ┌────────────────────────────────┐
                │                        │             FILES              │
                ▼                        ├────────────────────────────────┤
┌────────────────────────────────┐       │ _id: ObjectId                  │
│             SHARES             │       │ user: ObjectId (Ref: Users)    │
├────────────────────────────────┤       │ folder: ObjectId (Ref: Folder) │
│ _id: ObjectId                  │       │ originalName: String           │
│ shareToken: String (Unique)    │       │ key: String (S3 Object Key)    │
│ resourceType: "file" | "folder"│       │ size: Number (Bytes)           │
│ file: ObjectId (Ref: File)     │       │ mimeType / extension: String   │
│ folder: ObjectId (Ref: Folder) │       │ isDeleted / deletedAt: Date    │
│ owner: ObjectId (Ref: Users)   │       │ isShareable: Boolean           │
│ isRevoked: Boolean             │       │ shareToken: String (Indexed)   │
└────────────────────────────────┘       └────────────────────────────────┘
```

**Compound Indexes for High Performance**:
- `Folder`: `{ user: 1, isDeleted: 1, createdAt: -1 }`
- `File`: `{ user: 1, folder: 1, isDeleted: 1 }`
- `File`: `{ user: 1, isDeleted: 1, createdAt: -1 }`
- `File`: `{ isDeleted: 1, deletedAt: 1 }`
- `Share`: `{ shareToken: 1 }`, `{ owner: 1, createdAt: -1 }`

---

## 📂 Folder Structure

### Client Folder Structure

```
client/
├── public/                       # Static public assets
├── src/
│   ├── api/
│   │   └── api.js                # Axios instance, JWT interceptor, refresh lock, S3 PUT helper
│   ├── components/
│   │   ├── headers/
│   │   │   ├── NavBar.jsx        # Sticky navigation header with mobile drawer
│   │   │   └── Footer.jsx        # Footer component
│   │   ├── layout/
│   │   │   └── ProtectedLayout.jsx # Route guard verifying in-memory JWT authentication
│   │   └── shared/
│   │       ├── Button.jsx        # Standard Neo-brutalist action button
│   │       ├── ConfirmModal.jsx  # Reusable confirmation dialog
│   │       ├── EmptyState.jsx    # Empty state illustration placeholder
│   │       ├── ErrorState.jsx    # Standardized error display
│   │       ├── ImageComponent.jsx# Multi-file selector with direct S3 upload engine
│   │       ├── InputField.jsx    # Validated form input component
│   │       ├── Loader.jsx        # Shimmer skeleton components
│   │       └── Pagination.jsx    # Paginated navigation bar
│   ├── context/
│   │   ├── AuthContext.jsx       # User auth session provider
│   │   └── ToastContext.jsx      # Neo-brutalist floating toast alert manager
│   ├── features/
│   │   ├── auth/                 # Login, Register, Email OTP Verification pages & schemas
│   │   ├── dashboard/            # Metrics overview, storage gauge widget, recent activity
│   │   ├── files/                # File lists, search, multi-format preview modal, share modal
│   │   ├── folders/              # Hierarchical folder view, create/rename modals, sub-files
│   │   ├── profile/              # Profile editing, password change, avatar S3 upload
│   │   ├── share/                # Unauthenticated guest file preview & download view
│   │   ├── trash/                # Soft-deleted items manager with single/bulk purge
│   │   └── NotFound.jsx          # 404 page
│   ├── utils/
│   │   ├── downloadFile.js       # Resilient Blob file download helper
│   │   └── formErrors.js         # Backend error to React Hook Form mapper
│   ├── App.jsx                   # Central route registry (Public & Protected routes)
│   ├── index.css                 # Tailwind CSS v4 & theme design tokens
│   ├── main.jsx                  # React DOM root entry point with QueryClientProvider
│   └── vite.config.js            # Vite configuration
├── .env                          # Client environment variables
├── package.json                  # Dependencies & scripts
└── README.md
```

### Server Folder Structure

```
server/
├── src/
│   ├── app.js                    # Express app initialization, rate limiter, security headers, routers
│   ├── index.js                  # App bootstrap, MongoDB connection & HTTP server listener
│   ├── config/
│   │   └── aws.js                # AWS S3 Client singleton configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Register, login, logout, OTP verify, refresh token rotation
│   │   ├── dashboard.controller.js# Aggregated storage metrics and recent activity
│   │   ├── file.controller.js    # Presigned URL generation, confirm upload, CRUD, soft/perm delete
│   │   ├── folder.controller.js  # Folder CRUD, trash items, bulk trash purge trigger
│   │   ├── share.controller.js   # Public link sharing toggle and public access resolver
│   │   └── user.controller.js    # User profile, password update, avatar direct S3 upload
│   ├── db/
│   │   └── index.js              # Mongoose connection handler
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT authorization validator
│   │   ├── multer.middleware.js  # Avatar memory upload filter & 2MB limit
│   │   └── validation.middleware.js # Zod request body validation middleware
│   ├── models/
│   │   ├── file.model.js         # File schema & compound indexes
│   │   ├── folder.model.js       # Folder schema & compound indexes
│   │   ├── share.model.js        # Share link model
│   │   └── user.model.js         # User model with storage quota tracking
│   ├── redis/
│   │   ├── connection.js         # ioredis client singleton
│   │   ├── queue.js              # Email BullMQ queue definition
│   │   ├── worker.js             # Email worker processor (AWS SES)
│   │   ├── folderCleanup.queue.js# Folder cleanup BullMQ queue definition
│   │   └── folderCleanup.worker.js# Cascading folder & S3 batch deletion worker
│   ├── routes/
│   │   ├── auth.router.js        # Auth route definitions
│   │   ├── dashboard.router.js   # Dashboard route definitions
│   │   ├── file.router.js        # File route definitions
│   │   ├── folder.router.js      # Folder and Trash route definitions
│   │   ├── share.router.js       # Share route definitions
│   │   └── user.router.js        # User profile route definitions
│   ├── schema/
│   │   ├── folder.schema.js      # Zod validation schema for folders
│   │   └── user.schema.js        # Zod validation schemas for auth, profile, and password
│   ├── services/
│   │   └── email.service.js      # Nodemailer + AWS SES transport service
│   ├── templates/
│   │   └── otp.template.js       # Responsive HTML OTP email template
│   └── utils/
│       ├── ApiError.js           # Standardized custom API error hierarchy
│       ├── ApiSuccess.js         # Standardized API response envelope
│       ├── argon.js              # Argon2id password hashing helpers
│       ├── asyncHandler.js       # Async route controller wrapper
│       ├── aws.js                # AWS S3 client export
│       ├── email.js              # Email dispatch utility
│       ├── globalError.js        # Global Express error handler
│       ├── JWT.js                # Access & Refresh token generation with JTI
│       ├── logger.js             # ISO timestamped level logger
│       ├── multer.js             # Multer configuration
│       ├── pagination.js         # Generic Mongoose pagination helper
│       ├── s3.helper.js          # S3 presigning & batch deletion SDK helpers
│       └── validate.js           # Standalone Zod validation utility
├── .env                          # Server environment variables
└── package.json                  # Dependencies & scripts
```

---

## ⚙️ Installation & Setup Guide

### 1. Clone Repository

```bash
git clone https://github.com/Manuacharya55/Distributed_File_Sharing_System.git
cd "Distributed File System"
```

---

### 2. Backend Setup (`server`)

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server/` directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # Database & Redis Cache
   MONGODB_URI=mongodb://localhost:27017/distributed-file-system
   REDIS_URL=redis://127.0.0.1:6379

   # Authentication Secrets (generate random 64-char strings)
   ACCESS_TOKEN_SECRET=your_jwt_access_secret_key_here
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key_here

   # AWS S3 Object Storage
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=ap-south-1
   AWS_BUCKET_NAME=your_s3_bucket_name

   # AWS SES Email Service
   AWS_SES_REGION=ap-south-1
   EMAIL=your_verified_ses_sender_email@domain.com
   ```

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   *The server and BullMQ background workers will initialize on `http://localhost:4000`.*

---

### 3. Frontend Setup (`client`)

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_BASE_URL=http://localhost:4000/api/v1
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   *The client SPA will be accessible at `http://localhost:5173`.*

---

### 4. Running the Complete System

| Component | Default URL | Command | Notes |
|---|---|---|---|
| **MongoDB** | `mongodb://localhost:27017` | `mongod` | Database service |
| **Redis** | `redis://127.0.0.1:6379` | `redis-server` | Cache & BullMQ backend |
| **Backend API** | `http://localhost:4000` | `npm run dev` (in `/server`) | API + Queue Workers |
| **Frontend SPA** | `http://localhost:5173` | `npm run dev` (in `/client`) | Vite React App |

---

## 📡 API Reference Summary

### Authentication (`/api/v1/auth`)
- `POST /register`: Registers account, hashes password via Argon2id, queues verification OTP.
- `POST /login`: Authenticates credentials, returns in-memory access token & sets HTTP-only refresh cookie.
- `POST /logout`: Invalidates Redis token family and clears cookies.
- `POST /verify-email`: Validates 6-digit OTP from Redis cache.
- `GET /refresh-token`: Rotates token family, detects reuse attacks, issues fresh access token.

### User Profile (`/api/v1/user`)
- `GET /profile`: Retrieves user profile and storage statistics.
- `PATCH /profile`: Updates name and email.
- `PATCH /password`: Validates existing password and sets new password.
- `PATCH /update-avatar`: Uploads avatar image to S3.

### Files (`/api/v1/file`)
- `POST /presigned-url`: Validates quota, returns 15-minute S3 PUT URL for direct browser upload.
- `POST /confirm-upload`: Persists file metadata in MongoDB and increments used storage.
- `GET /`: Lists active files with search, folder filtering, and pagination.
- `GET /:id`: Retrieves single file metadata with 1-hour presigned preview/download URLs.
- `DELETE /:id`: Soft-deletes file (moves to Trash).
- `PATCH /:id/restore`: Restores soft-deleted file from Trash.
- `DELETE /:id/permanent`: Permanently removes file from S3 & MongoDB, decrements quota.

### Folders & Trash (`/api/v1/folder`)
- `POST /`: Creates a folder.
- `GET /`: Lists active folders with pagination.
- `GET /:id`: Retrieves folder details and nested files.
- `PATCH /:id`: Renames a folder.
- `DELETE /:id`: Soft-deletes folder and triggers background cascading deletion worker.
- `GET /trash`: Lists all soft-deleted files and folders.
- `DELETE /trash/empty`: Empties trash and triggers batch S3 deletion of all deleted files.

### Share Links (`/api/v1/share`)
- `PATCH /file/:id/toggle`: Toggles public link sharing on/off and creates a `shareToken`.
- `GET /access/:shareToken`: Public endpoint allowing guests to preview and download shared files.

### Dashboard (`/api/v1/dashboard`)
- `GET /`: Returns total files, folders, image/document breakdown, used storage, and recent activity logs.

### Health Check
- `GET /health`: Server liveness probe (`{ success: true, message: "server is healthy" }`).

---

## 📄 License

This project is licensed under the **ISC License**.
