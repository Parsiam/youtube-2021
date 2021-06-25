import express from "express";

const PORT = process.env.PORT || 4000;

const app = express();

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
