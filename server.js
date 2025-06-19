const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productsRoutes");
const cashierRoutes = require("./routes/cashierRoutes");
const branchRoutes = require("./routes/branchRouter");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const receiptRoutes = require("./routes/recieptsRoutes");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middleWares/errorMiddleware");
const dbConnection = require("./config/database");
//Routes
//const mountRoutes = require('./Routes')

dbConnection();
// express app
const app = express();

//Middlewares
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cashiers", cashierRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/receipts", receiptRoutes);
//mountRoutes(app)

app.all("*sth", (req, res, next) => {
  // const err = new Error(`Can't find this route ${req.originalUrl}`)
  // next(err.message)

  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

//middleware to handle errors and return them in json in express only
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App runing on port ${PORT}`);
});

//when i have error not coming from express i want to catch it globaly
//handle rejections outside the express
process.on("unhandeledRejection", (err) => {
  console.error(`UnhandledRejection  Errorrr: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down ...... bye!!!");
    process.exit(1); 
  });
});
