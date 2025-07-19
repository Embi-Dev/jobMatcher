# 🛠️ Project Setup Guide

This guide will help you get your project up and running locally.

---

## 1. Create a GROQ AI Account and API Key

* Visit [https://groq.com](https://groq.com) and sign up.
* Navigate to the API section and generate an API key.

---

## 2. Configure Environment Variables

* Create a `.env.local` file by copying the template:

  ```bash
  cp sample.env.local .env.local
  ```

* Paste your GROQ API key into the appropriate field in `.env.local`.

---

## 3. Install Dependencies

Install all required packages using:

```bash
npm install
```

---

## 4. Run the Development Server

Start your local development server:

```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🔁 Need Help?

If you encounter issues during setup, feel free to open an issue or reach out to the maintainer.
