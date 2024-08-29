import express from "express";
import os from "os";
import router from "./router";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

const port = process.env.PORT || 3001;

// Função para capturar o endereço IP da máquina
const getLocalIPAddress = () => {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]!) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address; // Retorna o IP externo (não localhost)
			}
		}
	}
	return "localhost";
};

// Rota para exibir "Servido" na página principal
app.get("/", (req, res) => {
	res.send("Servidor");
});

app.listen(port, () => {
	const ipAddress = getLocalIPAddress();
	console.log(`Server is running on http://${ipAddress}:${port}`);
});
