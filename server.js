import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/database/connectDb.js";

import cors from 'cors';
import { userRoute } from "./src/router/authRouter.js";
import reportRouter from "./src/router/reportRouter.js";
import { guidance } from "./src/router/gudanceRouter.js";

dotenv.config();
const app = express();

await connectDb();

// Allow all CORS (no restrictions)
app.use(cors());

app.use(express.json());

app.use('/api', userRoute);
app.use('/api', reportRouter);
app.use('/api', guidance);
// app.use('/api', budgetRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

