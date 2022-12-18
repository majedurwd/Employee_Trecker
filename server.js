// External Import
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// Internal Import
const { APP_PORT, DB_URI } = require("./config");
const connectDB = require("./db-connection");
const errorHandler = require("./middlewares/error-handler");
const routes = require("./routes");

const app = express();

// Connection Database and Create Server
connectDB(DB_URI)
    .then(() => {
        console.log("Database Connected");
        // Create Server
        app.listen(APP_PORT, () => {
            console.log(`Server is Running in http://localhost:${APP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });

// Request Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Routing Setup
app.use(routes);

// Default Error Handler
app.use(errorHandler);

// Export the Express App
module.exports = app;
