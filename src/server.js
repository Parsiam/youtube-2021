import express from "express";
import morgan from "morgan";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan("tiny"));
app.get("/", (req, res) => res.send("home"));

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
