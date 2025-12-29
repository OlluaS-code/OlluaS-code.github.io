import axios from "axios";

const form = document.getElementById("meuFormulario") as HTMLFormElement;
const btnEnviar = document.getElementById("btnEnviar") as HTMLButtonElement;
const statusDiv = document.getElementById("statusFeedback") as HTMLDivElement;
const fields = document.querySelectorAll(".mb-4");

const API_URL = import.meta.env.VITE_API_URL;

form.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  btnEnviar.disabled = true;
  btnEnviar.innerHTML = 'Enviando... <i class="ri-loader-4-line"></i>';
  statusDiv.textContent = "";

  fields.forEach((field) => field.classList.remove("field-error"));

  const formData = new FormData(form);
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const nameInput = document.getElementById("nome") as HTMLInputElement;
  const messageInput = document.getElementById(
    "mensagem"
  ) as HTMLTextAreaElement;

  try {
    const response = await axios.post(`${API_URL}/contact-us`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      window.location.href = "obrigado.html";
    }
  } catch (error: any) {
    const msgErro =
      error.response?.data?.message || "Erro ao conectar com o servidor.";
    statusDiv.innerHTML = `<span style="color: #dc3545;">${msgErro}</span>`;

    const msgLower = msgErro.toLowerCase();

    if (
      msgLower.includes("e-mail") ||
      msgLower.includes("formato") ||
      msgLower.includes("domínio")
    ) {
      emailInput.parentElement?.classList.add("field-error");
    }

    if (msgLower.includes("obrigatórias")) {
      if (!nameInput.value)
        nameInput.parentElement?.classList.add("field-error");
      if (!emailInput.value)
        emailInput.parentElement?.classList.add("field-error");
      if (!messageInput.value)
        messageInput.parentElement?.classList.add("field-error");
    }
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = 'Enviar Mensagem <i class="ri-send-plane-fill"></i>';
  }
});
