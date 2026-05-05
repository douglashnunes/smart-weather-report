
---

# 🎨 README — FRONTEND (smart-weather-report)

```md
# 🌤️ Smart Weather AI - Frontend

Aplicação web desenvolvida com React e TypeScript que permite ao usuário consultar o clima e receber recomendações inteligentes geradas por IA.

---

## 🚀 Funcionalidades

- Input de cidade
- Geração de relatório climático com IA
- Exibição de temperatura, umidade e condição do tempo
- Envio opcional do relatório por email
- Interface moderna e responsiva

---

## 🧠 Tecnologias

- React
- TypeScript
- Vite
- Fetch API
- Lovable (AI UI builder)

---

## 🔗 Integração com Backend

A aplicação consome a API:

```text
https://weather-ai-project.onrender.com/generate-report

📦 Estrutura
src/routes/index.tsx → página principal
components → UI reutilizável
styles → layout e design

▶️ Rodar localmente
git clone https://github.com/douglashnunes/smart-weather-report
cd smart-weather-report

npm install
npm run dev

🌐 Aplicação online
https://smart-report-front.lovable.app/

⚠️ Observações
O backend pode demorar alguns segundos para responder (Render free tier)
O envio de email depende da configuração do Resend

👨‍💻 Autor
Douglas Nunes
