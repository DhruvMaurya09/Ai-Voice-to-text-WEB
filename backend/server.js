require("dotenv").config();

console.log(
    "Gemini API Key loaded:",
    process.env.GEMINI_API_KEY ? "YES" : "NO"
);

console.log(
    "Gemini Model:",
    process.env.GEMINI_MODEL
);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const aiRoutes = require("./routes/ai");


const app = express();


// ================= MIDDLEWARE =================

app.use(

    cors({

        origin: true,

        credentials: true

    })

);


app.use(express.json());


// ================= TEST ROUTE =================

app.get("/", (req, res) => {

    res.json({

        message: "AI Voice Notes Backend is running!"

    });

});


// ================= API ROUTES =================

app.use(

    "/api/auth",

    authRoutes

);


app.use(

    "/api/notes",

    notesRoutes

);


app.use(

    "/api/ai",

    aiRoutes

);


// ================= DATABASE =================

mongoose

    .connect(process.env.MONGODB_URI)

    .then(() => {

        console.log("MongoDB connected successfully.");

        app.listen(

            process.env.PORT || 5000,

            () => {

                console.log(

                    `Server running at http://localhost:${process.env.PORT || 5000}`

                );

            }

        );

    })

    .catch((error) => {

        console.error(

            "MongoDB connection failed:",

            error.message

        );

        process.exit(1);

    });