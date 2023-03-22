import express from "express";
import cors from "cors";
import { generateCallData ,generateProof} from "./lib/zkutils.js";

const app = express();
const port = 8080;
const corsOptions = {
  // To allow requests from client
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.set("trust proxy", true);
app.use(cors());
app.get("/", (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// Credit Score
app.get("/api/credit/generate-call-data", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const creditScore = req.query.creditScore;
    // check if creditScore is a number
    if (isNaN(creditScore)) {
      return res.status(400).send("creditScore must be a number");
    }
    const { a, b, c, Input } = await generateCallData(creditScore);

    if (a === null || b === null || c === null || Input === null) {
      return res.status(400).send("Error generating call data");
    }

    console.log("Call Data Generated");
    console.log("a", a);
    console.log("b", b);
    console.log("c", c);
    console.log("Input", Input);
    return res.status(200).send({ a, b, c, Input });
  } catch (error) {
    console.log(`Error Message ${error.message}`);
    next(error);
  }
});

app.get("/api/credit/generate-proof", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const creditScore = req.query.creditScore;
    // check if creditScore is a number
    if (isNaN(creditScore)) {
      return res.status(400).send("creditScore must be a number");
    }
    const { proof, publicSignals } = await generateProof(creditScore);

    // check if proofJson is null
    if (proof == null) {
      return res.status(400).send("creditScore must more than 15");
    }
    return res.status(200).json({ proof, publicSignals });
  } catch (error) {
    console.log(`Error Message ${error.message}`);
    next(error);
  }
});

app.use("*", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
