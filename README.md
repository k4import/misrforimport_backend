# Misr For Import System Backend

This is the backend API for the Misr For Import system.

## Environment Variables

Set these environment variables in your Vercel deployment:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to "production" for Vercel

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /` - API status
- `/api/Employee/*` - Employee management
- `/api/Equipment/*` - Equipment management
- `/api/Brands/*` - Brand management
- `/api/Products/*` - Product management
- `/api/Purchases/*` - Purchase management
- `/api/Sales/*` - Sales management
- `/api/Warehouses/*` - Warehouse management
- `/api/Locations/*` - Location management
- `/api/Inventory/*` - Inventory management

## Deployment

This application is configured for Vercel serverless deployment.
