# How to Push This Code to Your Friend's Repository

Since you're already a collaborator on `makhelemamello/student-portfolio`, here are the steps to push this code:

## Option 1: Using GitHub Desktop or VS Code
1. Open GitHub Desktop or use VS Code's Git integration
2. Make sure you're signed in to your GitHub account
3. Push to the remote repository `makhelemamello/student-portfolio`

## Option 2: Using Command Line with Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate a new token with repo permissions
3. Use this command:
```bash
git push https://[your-username]:[your-token]@github.com/makhelemamello/student-portfolio.git main
```

## Option 3: Using SSH (Recommended)
1. Set up SSH keys if you haven't already
2. Change the remote URL to SSH:
```bash
git remote set-url friend git@github.com:makhelemamello/student-portfolio.git
git push friend main
```

## Option 4: Manual Upload
1. Download this entire project folder as ZIP
2. Go to your friend's repository on GitHub
3. Upload files manually through the web interface

## What's Included in This Push:
- Complete Next.js 15 portfolio website
- MongoDB integration with Mongoose
- JWT authentication system
- Admin dashboard with CRUD operations
- All portfolio sections (About, Education, Projects, Skills, etc.)
- Video Showcase with YouTube integration
- Publications section for academic papers
- Responsive design with Tailwind CSS
- Enhanced admin UI with improved fonts

## Next Steps After Pushing:
1. Your friend needs to run `npm install` to install dependencies
2. Set up MongoDB database and add the connection string to environment variables
3. Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Run `npm run dev` to start the development server
5. Access admin panel at `/admin` with credentials: admin@portfolio.com / admin123

The website will be fully functional once the database is connected!
