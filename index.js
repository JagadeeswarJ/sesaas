import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = 3033;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

