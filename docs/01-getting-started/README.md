# 🚀 Getting Started with Tryliate

Welcome to Tryliate! This guide will help you get up and running in minutes.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

```bash
✅ Bun v1.3.5 or higher
✅ Node.js 25+ (for compatibility)
✅ Git
✅ A Supabase account (for BYOI)
✅ A Google Cloud account (for deployment - optional)
```

### Installing Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/VinodHatti7019/Tryliate.git
cd tryliate
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (Admin Instance)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Backend URLs (for local development)
NEXT_PUBLIC_CLOUD_RUN_URL=http://localhost:8080
NEXT_PUBLIC_ENGINE_URL=http://localhost:3001

# AI (Groq)
GROQ_API_KEY=your-groq-api-key

# OAuth (optional for local dev)
NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID=your-oauth-client-id
NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=your-logo-dev-key
```

### 4. Apply Database Migrations

Navigate to your Supabase project dashboard:
1. Go to **SQL Editor**
2. Run the migrations in order:
   ```sql
   -- Run these files from supabase/migrations/
   -- 1. insert_flow_feed.sql
   -- 2. 002_mcp_infrastructure.sql
   -- ... (all migration files in order)
   ```

---

## 🎯 Start Development Servers

### Terminal 1: Frontend

```bash
bun run dev
```

The frontend will start at `http://localhost:3000`

### Terminal 2: Backend (Optional)

```bash
cd server
bun run index.js
```

The backend will start at `http://localhost:8080`

---

## 🌐 Access the Platform

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Tryliate landing page!

---

## 🎨 Your First Workflow

### Step 1: Login/Register

1. Click **"Get Started"** or **"Login"**
2. Create an account or sign in with Google

### Step 2: Connect Your Infrastructure (BYOI)

1. Click the **Integration** button in the toolbar
2. Click **CONNECT** on the Supabase card
3. Authorize Tryliate to access your Supabase account
4. Click **PROVISION DATABASE** to create your infrastructure

### Step 3: Build Your First Workflow

1. Click **Add Node** in the toolbar
2. Select **Flow Feed** to browse templates
3. Choose **"Single Node"** template
4. The canvas will populate with a starter node

### Step 4: Configure the Node

1. Click on the node to open the properties panel
2. Edit the node name and description
3. Select an MCP server from the dropdown
4. Configure any required parameters

### Step 5: Save Your Workflow

1. Click the **Save** button in the toolbar
2. Give your workflow a name
3. Click **Save**

### Step 6: Execute Your Workflow

1. Click **Run Once** in the toolbar
2. Monitor execution in the **Logs** dropdown
3. View results in the **Schedule** dropdown

---

## 🤖 Using the AI Assistant (Trymate)

1. Click **Ask Trymate** to open the AI panel
2. Ask questions about your workflow:
   - "How can I optimize this workflow?"
   - "What MCP servers should I connect?"
   - "Help me debug this error"
3. Get AI-powered suggestions and recommendations

---

## 📚 Next Steps

Now that you're up and running, explore these guides:

- **[Core Concepts](../02-core-concepts/README.md)** - Understand Tryliate's philosophy
- **[Building Workflows](../03-user-guides/BUILDING_WORKFLOWS.md)** - Advanced workflow patterns
- **[MCP Integration](../03-user-guides/MCP_INTEGRATION.md)** - Connect to 500+ MCP servers
- **[BYOI Setup](../03-user-guides/BYOI_SETUP.md)** - Deep dive into infrastructure

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Module not found" errors**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules bun.lock
bun install
```

**Issue: "Database connection failed"**
```bash
# Solution: Check your Supabase credentials in .env.local
# Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
```

**Issue: "Port 3000 already in use"**
```bash
# Solution: Kill the process or use a different port
bun run dev -- -p 3001
```

For more troubleshooting, see the **[Troubleshooting Guide](../05-deployment/TROUBLESHOOTING.md)**

---

## 🤝 Need Help?

- **GitHub Issues:** [Report bugs](https://github.com/VinodHatti7019/Tryliate/issues)
- **Email:** officialvinodhatti@gmail.com
- **Documentation:** [Full docs](../README.md)

---

**Ready to build amazing workflows? Let's go! 🚀**
