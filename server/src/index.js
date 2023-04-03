import express from "express";
import cors from "cors";
import { generateCallDataCredit,generateProofCredit,generateCallDataTwitter,generateProofTwitter,generateCallDataAge,generateProofAge} from "./lib/zkutils.js";

const app = express();
const port = 8080;
const corsOptions = {
  // To allow requests from client
  origin: [
    "*"
  ]
};

app.set("trust proxy", true);
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Twitter Verification
app.get("/api/twitter/generate-call-data", async(req,res,next)=>{
try{
  console.log("Generating proof...");
    const followers = req.query.followers;
    const threshold = req.query.threshold;
    // check if creditScore is a number
    if (isNaN(followers) && isNaN(threshold)) {
      return res.status(400).send("followers must be a number");
    }
    const { a, b, c, Input } = await generateCallDataTwitter(followers,threshold);

    if (a === null || b === null || c === null || Input === null) {
      return res.status(400).send("Error generating call data");
    }

    console.log("Call Data Generated");
    console.log("a", a);
    console.log("b", b);
    console.log("c", c);
    console.log("Input", Input);
    return res.status(200).send({ a, b, c, Input });

}catch(err){
  console.log(`Error Message ${err.message}`)
  next(err);
}
})

app.get("/api/twitter/generate-proof", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const followers = req.query.followers;
    const threshold = req.query.threshold;
    // check if creditScore is a number
    if (isNaN(followers) && isNaN(threshold)) {
      return res.status(400).send("Followes and Threshold must be a number");
    }
    const { proof, publicSignals } = await generateProofTwitter(followers,threshold);

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




// Credit Score
app.get("/api/credit/generate-call-data", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const creditScore = req.query.creditScore;
    // check if creditScore is a number
    if (isNaN(creditScore)) {
      return res.status(400).send("creditScore must be a number");
    }
    const { a, b, c, Input } = await generateCallDataCredit(creditScore);

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
    const { proof, publicSignals } = await generateProofCredit(creditScore);

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

// Age Verification
app.get("/api/age/generate-call-data", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const age = req.query.age;
    // check if age is a number
    if (isNaN(age)) {
      return res.status(400).send("age must be a number");
    }
    const { a, b, c, Input } = await generateCallDataAge(age);

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

app.get("/api/age/generate-proof", async (req, res, next) => {
  try {
    console.log("Generating proof...");
    const age = req.query.age;
    // check if age is a number
    if (isNaN(creditScore)) {
      return res.status(400).send("creditScore must be a number");
    }
    const { proof, publicSignals } = await generateProofAge(age);

    // check if proofJson is null
    if (proof == null) {
      return res.status(400).send("age must more than 18");
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
