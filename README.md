# ElderSafe – Complete Project

## What is fixed
- SOS button does NOT open Chrome or an SMS URL.
- Emergency contact is stored locally.
- Manual SOS and Fall Alert use the same background API.
- GPS location is added to the emergency message when permission is available.
- Alert history records Sending / Sent / Failed.
- 30-second fall countdown can be changed in Settings.
- Responsive mobile-style UI.

## Important SMS note
A normal HTML/JavaScript website cannot silently send a real SMS from a phone.
This project therefore includes a Node.js + Twilio backend.

### Frontend demo
Open `index.html`. Add an emergency contact and press SOS.
If the backend is not running, the UI stays inside the project and does NOT open Chrome.
It runs in safe demo mode.

### Real SMS
1. Install Node.js.
2. Open a terminal in `server`.
3. Run:
   npm install
4. Copy `.env.example` to `.env`.
5. Add your Twilio Account SID, Auth Token and Twilio phone number.
6. Run:
   npm start
7. In `js/app.js`, keep:
   const API_BASE="http://localhost:3000";
8. Open the frontend through a local web server (recommended VS Code Live Server).

For a college demo, use a test/verified number supported by your SMS provider.

## Folder structure
ElderSafe_Complete/
  index.html
  dashboard.html
  contact.html
  fall-detected.html
  history.html
  location.html
  settings.html
  sos-sent.html
  css/style.css
  js/app.js
  server/server.js
  server/package.json
  server/.env.example
