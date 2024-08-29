import express from "express";
import router from "./router";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
