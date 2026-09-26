/* Site settings. Edit this file only; no other file needs changing for these values.
   Leave a URL empty ("") and the matching button becomes "Request access" (opens the contact form). */
window.EDUSMART = {
  company: "EduSmart Consult LTD",
  phone: "+250 782 368 555",
  phoneIntl: "250782368555",          // digits only, used for WhatsApp links
  email: "hagenalexis2000@gmail.com",
  address: "Itetero, Nyagatovu, Kimironko, Gasabo, Kigali, Rwanda",

  /* Smart School App downloads. Host the large files (about 2 GB each) on GitHub Releases,
     Google Drive, OneDrive or your own server, then paste the direct links here. */
  downloads: {
    version: "2.22.0",
    windowsUrl: "",   // e.g. https://github.com/Eribangi05/smart-school-app/releases/download/v2.22.0/Smart-School-App-Setup-2.22.0.exe
    androidUrl: "",   // e.g. https://github.com/Eribangi05/smart-school-app-android/releases/download/v2.22.0/Smart-School-App-release-signed.apk
    webAppUrl: "",    // browser version, when it is published
    sha256Windows: "1aa17b6b30fc92347abde1d4586a5ad19dd4c68c927dd80cc5a03fe3b153324a" // optional checksum shown on the Downloads page
  },

  /* Contact form. Paste a Formspree (or similar) endpoint to receive submissions by email,
     for example "https://formspree.io/f/xxxxxxx". Empty = the form opens the visitor's email app. */
  /* Smart School Cloud (the Cloud Sync Server). Paste the server address, for example https://sync.edusmartconsult.com
     The online app is opened at baseUrl + "/app". Leave empty until the server is live. */
  cloud: {
    baseUrl: "https://smart-school-cloud-sync.onrender.com",   // Smart School Cloud server (free Render plan: the first visit after a quiet period can take about a minute)
    appPath: "/app",
    embed: false      // true only if the server allows framing (needs frame-ancestors + cross-site cookies). Default: open in a new tab
  },

  /* Prices shown on the pricing page. Leave empty to show "Quote on request". Example: "from 500,000 RWF per school per year" */
  pricing: { school: "", training: "" },

  /* Optional, privacy friendly statistics (Plausible). Leave domain empty for no statistics at all. Visitors must opt in. */
  analytics: { domain: "", src: "https://plausible.io/js/script.js" },

  formEndpoint: "https://formspree.io/f/moevnprb"
};
