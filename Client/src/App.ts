import axios from "axios";

const form = document.getElementById("meuFormulario") as HTMLFormElement;
const btnEnviar = document.getElementById("btnEnviar") as HTMLButtonElement;
const statusDiv = document.getElementById("statusFeedback") as HTMLDivElement;

const API_URL = import.meta.env.VITE_API_URL;

form.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  btnEnviar.disabled = true;
  btnEnviar.innerHTML = 'Enviando... <i class="ri-loader-4-line"></i>';
  statusDiv.textContent = "";

  const formData = new FormData(form);

  try {
    const response = await axios.post(`${API_URL}/contact-us`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      statusDiv.innerHTML = `<span style="color: #28a745;">Mensagem enviada com sucesso!</span>`;
      form.reset();
    }
  } catch (error: any) {
    console.error("Erro ao enviar:", error);

    const msgErro =
      error.response?.data?.message || "Erro ao conectar com o servidor.";
    statusDiv.innerHTML = `<span style="color: #dc3545;">Erro: ${msgErro}</span>`;
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = 'Enviar Mensagem <i class="ri-send-plane-fill"></i>';
  }
});
