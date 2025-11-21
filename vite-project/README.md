# 📁 Dataroom Lite

A lightweight document manager with nested folders, PDF uploads, inline renaming, and live preview.

## Folder Management

1. Create nested folders
2. Rename folders inline
3. Delete folders recursively
4. Automatically deletes all nested files in Supabase Storage

## File Management

1. Upload PDFs into the selected folder
2. Display files instantly in the sidebar
3. Delete files (removed from both structure and Supabase storage)
4. Rename files inline
5. Real-time PDF preview using iframe and signed URLs

## Cloud Storage

All user data is stored inside Supabase Storage, using:

documents/files/<userId>/... for uploaded PDFs

documents/structure/<userId>.json for the folder tree structure

This is a databaseless implementation.

# Setup Instructions

1. Clone the Repository.
2. Install dependencies (npm install).
3. Create a supabase project:

    4.1. Go to https://supabase.com.
    
    4.2. Click new project.

    4.3. Wait for the project to initialize.

    4.4. Copy the following: Project URL / Anon public API key

    4.5. Create a .env in the root folder and paste the following and replace the url and key with your own:

        VITE_SUPABASE_URL=YOUR_URL
        VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
    4.6. Create a new bucket named "documents".

    4.7. Add policies for this bucket as following:

      &nbsp;&nbsp;4.7.1 Allow authenticated users to SELECT (read) – (auth.role() = 'authenticated')  
      &nbsp;&nbsp;4.7.2 Allow authenticated users to INSERT (upload) – (auth.role() = 'authenticated')  
      &nbsp;&nbsp;4.7.3 Allow authenticated users to UPDATE (overwrite) – (auth.role() = 'authenticated')  
      &nbsp;&nbsp;4.7.4 Allow authenticated users to DELETE – (bucket_id = 'documents'::text) AND (owner = auth.uid())  

4. Run the project in development: npm run dev

5. Register a user and enjoy.

## Technologies

### React
Main frontend framework used. React is a safe choice for any project, whether small or enterprise due to market dominance and ease of use.
### Supabase (Database)
We use supabase for various reasons:
1. Very easy to set up.
2. Free to use up until a certain point, so it can scale as needed.
3. We can skip building a backend by storing the folder and file structure in a simple json file, which we pull.
4. It also works out of the box as a file storage.
5. Supabase also has out of the box authentification, which is perfect for us.
It does however limit certain more complex functionality, so if this app were to be expanded with more complex functionality, a proper database with actual tables would be needed. Although we can use a noSQL database since the structure format already comes as a json.
AWS S3 would be a better choice for something more complex, but the setup is more complex and it would have been overkill for our use case.
### Vite
Extremely fast dev server, also a favorite emerging choice on the market. It's also ideal for deploying on Vercel.
We don't need other frameworks like Next.js for this app because we don't need SSR or api routes.
### React Router
Instead, we use react router since it's minimal and just what we need.
### React Query
React query features various advantages, including automatic refetching, cache invalidation (very important for the supabase connection), async state management. Code is more stable because of it.
### Tailwind
We use tailwind 3 for a quick setup and to make app look decent for an MVP. Tailwind 4 would require a more complex setup and it was not necessary for this mvp.
