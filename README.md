# SecretMarkdocs

Modern self-hosted notes platform built with SvelteKit and MongoDB. Create and manage secret-protected markdown notes with a beautiful web interface.

## Features

- 📝 **Markdown Editor**: Rich markdown editing with syntax highlighting
- 🔒 **Secret Protection**: Password-protect your notes with bcrypt hashing
- 👥 **User Management**: Multi-user support with authentication
- 📊 **Dashboard**: Manage all your notes from a central dashboard
- 🔗 **Unique URLs**: Each note gets a unique, shareable URL
- 📱 **Responsive Design**: Works great on desktop and mobile

## Setup

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up MongoDB**: 
   - Install MongoDB locally or use MongoDB Atlas
   - Update the connection string in your environment variables

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Create your first user**: 
   - Visit `/auth/register` to create an account
   - The first user automatically becomes an admin

## Usage

- **Create notes**: Use the editor to create new markdown notes
- **Secret protection**: Toggle between public and private notes
- **Share notes**: Share the unique URL with others
- **Dashboard**: Manage all your notes from the dashboard

## Database

The application uses MongoDB to store:
- User accounts and authentication
- Notes with content and metadata
- Invite codes for new user registration
