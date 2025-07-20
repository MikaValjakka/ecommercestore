import {connectDB} from "../lib/db.js";
import { closeRedis } from "../lib/redis.js";
import mongoose from "mongoose";

beforeAll(async () => await connectDB());

afterAll(async () => {
    await closeRedis();
    await mongoose.connection.close();
});

