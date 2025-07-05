# SecretMarkdocs

**Self-Hosted Notes Platform** - A modern, secure, and feature-rich markdown notes platform you can host on your own infrastructure.

Built with SvelteKit and MongoDB, SecretMarkdocs gives you complete control over your notes and data privacy.

🔗 **Live Demo**: [Demo](https://vault.berkankutuk.dk/demo) (Secret: `supersecret`)

## Features

- 📝 **Rich Markdown Editor**: Full-featured markdown editing with syntax highlighting

![Markdown Editor](/src/assets/Editor.png)

- 🔒 **Secret Protection**: Password-protect notes with bcrypt encryption

![Secret Protection](/src/assets/Secret.png)

- 👥 **Multi-User Support**: User authentication and management system

![Multi-User Support](/src/assets/Invites.png)

- 📊 **Centralized Dashboard**: Manage all your notes from one place

![Dashboard](/src/assets/Dashboard.png)

- 🔗 **Unique URLs**: Each note gets a shareable, unique identifier

![Unique URLs](/src/assets/Note.png)

- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🏠 **Self-Hosted**: Full control over your data and infrastructure
- 🔐 **Privacy First**: No third-party tracking or data collection

## 🛠️ Tech Stack

- **Frontend**: SvelteKit, TypeScript, Tailwind CSS
- **Backend**: Node.js, SvelteKit API routes
- **Database**: MongoDB
- **Authentication**: Custom auth with bcrypt
- **Deployment**: Compatible with any Node.js hosting platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/berkanktk/SecretMarkdocs.git
   cd SecretMarkdocs
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory (also required for production):
   ```env
   # Database
   MONGODB_URI=<INSERT_MONGODB_URI_HERE>
   ```

4. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in DATABASE_URL
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Create your first admin user**:
   - Navigate to `http://localhost:5173/auth/register`
   - Register your account (first user becomes admin automatically)

## 📖 Usage

### Creating Notes
1. Navigate to `/editor` or use the dashboard
2. Write your content in markdown
3. Toggle secret protection if needed
4. Save and share the unique URL

### Managing Users
- Admin users can create invite codes
- Users register with invite codes or open registration
- Manage users from the admin dashboard

### Security Features
- Bcrypt for storing user passwords
- Session-based authentication with JSON Web Tokens (JWT)

## 🔧 Configuration

### Database Schema
The application automatically creates these collections:
- `users`: User accounts and authentication
- `notes`: Note content and metadata
- `invites`: Invitation codes for user registration

### Customization
- Modify styles in `src/app.css`
- Update branding in `src/routes/+layout.svelte`
- Configure authentication in `src/lib/auth.ts`

## 🛡️ Security Considerations

- Use strong `AUTH_SECRET` in production (minimum 32 characters)
- Enable HTTPS in production
- Regularly update dependencies
- Use MongoDB authentication and network restrictions
- Consider implementing rate limiting
- Regular backups of your MongoDB database

## 🔮 Future Features
- [x] Add and render markdown notes with syntax highlighting
- [x] Add a way to delete notes
- [x] Add a way to edit notes
- [x] Centralized user management with invite codes
- [X] Sharable links
- [X] Secret protection for notes
- [x] Add a way to search & filter/sort notes
- [ ] Encrypt notes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- Create an issue on GitHub for bug reports
- Check existing issues for common problems
- Star the project if you find it useful!
