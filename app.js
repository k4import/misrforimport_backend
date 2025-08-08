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
//mongodb+srv://kareemmisrforimport:qmuoWoCJs2K0yMfn@misrforimportdb.xeakt8n.mongodb.net/
//mongoose.connect("mongodb://localhost:27017/misrforimport")
mongoose.connect("mongodb+srv://kareemmisrforimport:qmuoWoCJs2K0yMfn@misrforimportdb.xeakt8n.mongodb.net/")
    .then(() => { console.log("Database connected....") })
    .catch((err) => { console.log(err) })

const port = process.env.port || 8080


process.on("uncaughtException", (exception) => {
    console.log("uncaught Exception:", exception.message)
    console.log(exception.stack)
    process.exit(1)
})
process.on("unhandledRejection", (exception) => {
    console.log("Promise Rejected:", exception.message)
    console.log(exception.stack)
    process.exit(1)
})

app.use(bodyParser.json());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

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
    res.sendFile(path.join(__dirname, "/main.html"))
    //res.send(" this is server response")
});

app.get("/welcome.html", (req, res) => {
    console.log(req.query)
    res.sendFile(path.join(__dirname, "/welcome.html"))
})

app.post("/welcome.html", (req, res) => {
    console.log(req.body)
    res.send(`dear ${req.body.email} your logged in done `)
})

app.use('/api/Warehouses', warehouseRouter);
app.use('/api/Locations', locationRouter);
app.use('/api/Inventory', inventoryRouter);

app.listen(port, () => {
    console.log(`Express server is listening port ${port}`)
});


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