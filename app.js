const bodyParser = require('body-parser');
const path = require("path")
const express = require("express")
const app = express()

const employeeRouter = require("./routes/EmployeeRouter.js")

const equipmentRouter = require("./routes/equipmentRouter.js")

const brandRouter = require("./routes/brandRouter.js")


//Products routers require
//..............................................................

//kits
const kitRouter = require("./routes/kitRouter.js")
//item
const itemRouter = require("./routes/itemRouter.js")
//parts
const partsRouter = require("./routes/partRouter.js")
//part brands
const partBrandsRouter = require("./routes/partBrandRouter.js")
//category
const cardRouter = require("./routes/cardRoutes.js")
//card Category
const cardCategoriesRouter = require("./routes/cardCategoriesRouter.js")
//products
const productsRouter = require("./routes/productsRouter.js")

//Purchases routers:

//Purchases_Invoice
const foreignCurrencyPurchaseInvoiceRouter = require('./routes/foreignCurrencyPurchaseInvoiceRouters.js');

//Purchases_Vendors
const vendorRouter = require('./routes/vendorRouter.js');

//Clients
const clientRouter = require('./routes/clientRouter.js');

//Sales_Invoices 
const eGPSalesInvoiceRouter = require('./routes/eGPSalesInvoiceRouters.js');

const warehouseRouter = require('./routes/warehouseRouter.js');
const locationRouter = require('./routes/locationRouter.js');
const inventoryRouter = require('./routes/inventoryRouter.js');


//const logging = require("./middlewares/logging")
const errMW = require("./middlewares/ErrMW")
const mongoose = require("mongoose")

// Database connection with better error handling for serverless
let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://kareemmisrforimport:qmuoWoCJs2K0yMfn@misrforimportdb.xeakt8n.mongodb.net/"
        
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
        
        // Configure mongoose for serverless
        mongoose.set('bufferCommands', false);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        })
        
        isConnected = true;
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Database connection error:", error.message)
        console.error("Full error:", error)
        isConnected = false;
        throw error; // Re-throw the error so we can handle it
    }
}

// Middleware to ensure database connection before each request
const ensureDBConnection = async (req, res, next) => {
    try {
        if (!isConnected || mongoose.connection.readyState !== 1) {
            console.log('Reconnecting to database...');
            await connectDB();
        }
        next();
    } catch (error) {
        console.error('Database connection middleware error:', error);
        
        // For GET requests, allow them to proceed with a warning
        if (req.method === 'GET') {
            console.log('Allowing GET request to proceed despite database connection issue');
            next();
            return;
        }
        
        // For other requests, return error
        res.status(500).json({
            status: false,
            error: "Database connection failed",
            details: error.message,
            location: "ensureDBConnection middleware",
            suggestion: "Please check your MongoDB connection string and credentials"
        });
    }
};

const port = process.env.PORT || 8080

// Improved error handling for serverless environment
process.on("uncaughtException", (exception) => {
    console.log("uncaught Exception:", exception.message)
    console.log(exception.stack)
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1)
    }
})

process.on("unhandledRejection", (exception) => {
    console.log("Promise Rejected:", exception.message)
    console.log(exception.stack)
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1)
    }
})

app.use(bodyParser.json());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Only serve static files in development
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static("public"))
}

// Apply database connection middleware to all API routes
app.use('/api', ensureDBConnection);

//throw Error("Unhandeled exception")
//let p = Promise.reject(new Error("Something went wrong"))
//p.then(() => { console.log("Success") })

//Employee
app.use("/api/Employee", employeeRouter)

//Equipment
app.use("/api/Equipment", equipmentRouter)

//Brands
app.use("/api/Brands", brandRouter)

//Products
app.use("/api/Products/Manage", productsRouter)

//Kits
app.use("/api/Products/Kits", kitRouter)

//Items
app.use("/api/Products/Items", itemRouter)

//Card Categories
app.use("/api/Products/Cards", cardRouter)

//Card Categories
app.use("/api/Products/CardCategories", cardCategoriesRouter)

//Parts
app.use("/api/Products/Parts", partsRouter)

//Part Brands
app.use("/api/Products/PartBrands", partBrandsRouter)


//Purchases Uses:

//Purchases_Invoices
app.use("/api/Purchases/Vendors", vendorRouter)

//Purchases_Vendors
app.use("/api/Purchases/ForeignCurrencyPurchaseInvoice/", foreignCurrencyPurchaseInvoiceRouter)


//Sales Uses:

//Clients
app.use("/api/Clients/Manage/", clientRouter)

//Sales_Invoices

//Egp sales invoice
app.use("/api/Sales/SalesInvoice/EGPSalesInvoice/", eGPSalesInvoiceRouter)

// 202 handler for unknown routes
app.use((req, res, next) => {
  res.status(202).json({
    status: false,
    message: "Route not found. Please check the URL.",
    code: 202
  });
});

app.use(errMW)
// express error middle ware

app.get("/", (req, res) => {
    console.log("req received")
    // Only serve HTML files in development
    if (process.env.NODE_ENV !== 'production') {
        res.sendFile(path.join(__dirname, "/main.html"))
    } else {
        res.json({
            status: true,
            message: "Misr For Import API is running",
            version: "1.0.0"
        })
    }
    //res.send(" this is server response")
});

app.get("/welcome.html", (req, res) => {
    console.log(req.query)
    if (process.env.NODE_ENV !== 'production') {
        res.sendFile(path.join(__dirname, "/welcome.html"))
    } else {
        res.json({
            status: true,
            message: "Welcome to Misr For Import API"
        })
    }
})

app.post("/welcome.html", (req, res) => {
    console.log(req.body)
    res.send(`dear ${req.body.email} your logged in done `)
})

app.use('/api/Warehouses', warehouseRouter);
app.use('/api/Locations', locationRouter);
app.use('/api/Inventory', inventoryRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        databaseConnected: isConnected,
        databaseReadyState: mongoose.connection.readyState
    });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                status: false,
                message: 'Database not connected',
                readyState: mongoose.connection.readyState,
                isConnected: isConnected
            });
        }
        
        // Try a simple database operation
        const testResult = await mongoose.connection.db.admin().ping();
        
        res.json({
            status: true,
            message: 'Database connection test successful',
            ping: testResult,
            readyState: mongoose.connection.readyState,
            isConnected: isConnected
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Database connection test failed',
            error: error.message,
            readyState: mongoose.connection.readyState,
            isConnected: isConnected
        });
    }
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Express server is listening port ${port}`)
    });
}

//const studentsRouter = require("./learen_in_iti_course/Students.js")

// const userRouter = require("./learen_in_iti_course/User.js")
// const authRouter = require("./learen_in_iti_course/auth.js")
// const adminRouter = require("./learen_in_iti_course/admin.js")


// learn in iti course
//app.use("/api/Students", studentsRouter)
//app.use("/api/Users", userRouter)
// app.use(logging)
//app.use("/api/Login", authRouter)
//app.use("/api/admin", adminRouter)

module.exports = app;