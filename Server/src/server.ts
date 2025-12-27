import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import morgan from "morgan";
import cors from "cors";
import sendMail from "./Email/email";
import { verifyEmailFormat } from "./Email/verifyEmailFormat.service";
import { resolveMXRecords } from "./Email/resolveMXRecords.service";

import { verifyEmailWithAbstract } from "./Email/verifyEmailWithAbstract.service";

const server = express();

server.use(bodyParser.json());
server.use(morgan("dev"));
server.use(
  cors({
    origin: ["https://olluas-code.github.io", "http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
server.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

server.get("/", (req, res) => {
  res.json({ message: "HTTP is running 🚀" });
});

server.post("/contact-us", upload.single("attach"), async (req, res) => {
  const { email, name, message } = req.body;
  const attach = req.file;

  try {
    if (!email || !name || !message) {
      return res
        .status(400)
        .json({ message: "Ops! Faltam informações obrigatórias. 📝" });
    }

    if (!verifyEmailFormat(email)) {
      return res
        .status(400)
        .json({ message: "Hmm, esse formato de e-mail parece estranho. 🧐" });
    }

    const [, domain] = email.split("@");
    const mxRecords = await resolveMXRecords(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return res
        .status(400)
        .json({ message: "O domínio desse e-mail não foi encontrado. 🌐" });
    }

    const isEmailDeliverable = await verifyEmailWithAbstract(email);

    if (!isEmailDeliverable) {
      return res.status(400).json({
        message: "O servidor de destino diz que este e-mail não existe. ❌",
      });
    }

    await sendMail({ email, name, message, attach });

    res.json({ success: true, message: "Mensagem enviada com sucesso! 🚀" });
  } catch (error: any) {
    console.error("Erro no fluxo:", error);
    res.status(500).json({
      message: "Algo deu errado por aqui. Tente novamente em instantes! 🛠️",
    });
  }
});

export default server;
