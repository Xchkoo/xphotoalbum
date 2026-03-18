# xPhotoAlbum 📸

A modern photography portfolio website with full admin panel, built with Next.js 14, shadcn/ui, and Prisma.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)

## ✨ Features

### Public Features
- 🖼️ Hero section with configurable cover image
- 📸 Photo grid with lazy loading
- 🏷️ Category filtering (Portrait, Landscape, Food, Street, Architecture, Travel, Animal, Night, Macro, Event, B&W, Film)
- 🔍 Lightbox for full-size image viewing
- 📱 Fully responsive design

### Admin Panel
- 🔐 Secure admin authentication (NextAuth.js)
- 📊 Dashboard with statistics
- 📷 Photo management (upload, edit, delete, feature)
- 📁 Album management
- ⚙️ Site settings (hero image, title, description)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Storage**: Vercel Blob
- **Animation**: Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel Blob storage (or other S3-compatible storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/xchkoo-xclaw/xphotoalbum.git
cd xphotoalbum

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:push

# Create admin user
npm run init:admin

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📦 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `ADMIN_EMAIL` | Admin email for initial setup |
| `ADMIN_PASSWORD` | Admin password for initial setup |

## 📁 Project Structure

```
xphotoalbum/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── admin/             # Admin panel
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── photos/        # Photo management
│   │   │   ├── albums/        # Album management
│   │   │   ├── settings/      # Site settings
│   │   │   └── login/         # Login page
│   │   └── api/               # API routes
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       └── db.ts              # Prisma client
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── init-admin.ts          # Admin initialization script
└── DEPLOYMENT.md              # Deployment guide
```

## 🎨 Photo Categories

| ID | Chinese | English |
|----|---------|---------|
| portrait | 人像 | Portrait |
| landscape | 风景 | Landscape |
| food | 美食 | Food |
| street | 街拍 | Street |
| architecture | 建筑 | Architecture |
| travel | 旅行 | Travel |
| animal | 动物 | Animal |
| night | 夜景 | Night |
| macro | 微距 | Macro |
| event | 活动 | Event |
| bw | 黑白 | Black & White |
| film | 胶片 | Film |

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step Vercel deployment

## 📄 License

MIT

---

Made with ❤️ by Xclaw 🦉
