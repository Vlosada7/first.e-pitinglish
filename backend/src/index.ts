import express from "express";
import router from "./router";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; // Instale com `npm install axios`
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3001;

// Rota para exibir "Servido" na página principal
app.get("/", (req, res) => {
	res.send("Servidor");
});

const getPublicIPAddress = async () => {
	try {
		const response = await axios.get("https://api.ipify.org?format=json");
		return response.data.ip;
	} catch (error) {
		console.error("Não foi possível obter o IP público:", error);
		return "localhost";
	}
};

console.log("Teste do commit 1");

app.listen(port, async () => {
	const publicIPAddress = await getPublicIPAddress();
	console.log(`Server is running on http://${publicIPAddress}:${port}`);
});
