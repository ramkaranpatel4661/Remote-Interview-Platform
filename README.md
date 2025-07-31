# Remote Interview Platform

A comprehensive remote interview platform built with Next.js, Convex, Clerk, and Stream Video. This application provides a complete solution for conducting technical interviews with real-time video calls, code editing, and interview management.

## Features

- **Real-time Video Calls**: Powered by Stream Video
- **Code Editor**: Monaco Editor with multiple language support
- **Interview Scheduling**: Schedule and manage interviews
- **Role-based Access**: Separate interfaces for interviewers and candidates
- **Interview Management**: Track interview status, add comments, and ratings
- **Recording Management**: Access and manage interview recordings
- **Authentication**: Secure authentication with Clerk

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here

# Stream Video
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here
```

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
