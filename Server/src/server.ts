import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import morgan from "morgan";
import cors from "cors";
import sendMail from "./Email/email";
import { verifyEmailFormat } from "./Email/verifyEmailFormat.service";
import { resolveMXRecords } from "./Email/resolveMXRecords.service";
import { testInboxOnServer } from "./Email/testInboxOnServer.service";

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
      return res.status(400).json({ message: "Campos obrigatórios faltando." });
    }

    const emailFormatIsValid = verifyEmailFormat(email);
    if (!emailFormatIsValid) {
      return res.status(400).json({ message: "Formato de e-mail inválido." });
    }

    const [, domain] = email.split("@");
    const mxRecords = await resolveMXRecords(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return res.status(400).json({ message: "Domínio de e-mail não existe." });
    }

    const sortedMxRecords = mxRecords.sort((a, b) => a.priority - b.priority);

    try {
      console.log(`Tentando verificar inbox para: ${email}...`);
      const inboxResult = await testInboxOnServer(
        sortedMxRecords[0].exchange,
        email
      );

      if (
        inboxResult.connection_succeeded &&
        inboxResult.inbox_exists === false
      ) {
        throw new Error(
          "Endereço de e-mail rejeitado pelo servidor de destino."
        );
      }
    } catch (smtpError: any) {
      console.warn(
        "Aviso: Verificação SMTP falhou ou foi bloqueada. Prosseguindo com envio padrão."
      );
      console.warn(`Motivo: ${smtpError.message}`);
    }

    await sendMail({ email, name, message, attach });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro final:", error);
    res
      .status(400)
      .json({ message: error.message || "Falha ao enviar e-mail." });
  }
});

export default server;
