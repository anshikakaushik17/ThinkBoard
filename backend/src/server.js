import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
    } // Allow requests from the frontend
    ));
}


app.use(express.json()); // Middleware to parse JSON bodies
app.use(rateLimiter); // Apply rate limiting middleware


// app.use((req,res,next)=>{
//     console.log(`Req method is ${req.method} and req URL is ${req.url}`);
//     next();
// })

if (process.env.NODE_ENV === "production") {
    app.use("/api/notes", notesRoutes);

    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on PORT:", PORT);
    });
});




