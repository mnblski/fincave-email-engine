require('dotenv').config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsConfig = require("./config/cors.config");

const app = express();
const PORT = process.env.PORT;
const API_BASE_PATH = process.env.API_BASE_PATH;

const {errorHandler, errorLogger} = require("./middleware/error.middleware");

const userRouter = require("./services/user_services/router");
const assetsRouter = require("./services/assets_services/router");
// const ordersRouter = require("./ordersService/router");
// const productRouter = require("./routes/asset.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsConfig));

/** isolated Routers with Route controllers */
app.use(`${API_BASE_PATH}/user`, userRouter);
app.use(`${API_BASE_PATH}/assets`, assetsRouter);
// app.use(`${API_BASE_PATH}/orders`, ordersRouter);
// app.use("/product", productRouter);

// user -> assets -> product
// user -> orders -> product
// user -> products


/** error handling middleware */
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server has started on port:  ${PORT}`))