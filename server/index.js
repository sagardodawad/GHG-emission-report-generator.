require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("./models/token");
const Joi = require("joi");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const connectDb = require("./db");

const { User } = require("./models/user");
const { Admin } = require("./models/admin");
const Report = require("./models/report");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

connectDb();

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });

    const { error } = emailSchema.validate({ email: req.body.email });

    if (error) {
      return res.status(400).json({
        message: "Invalid email address",
        details: error.details,
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/admin/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });

    const { error } = emailSchema.validate({ email: req.body.email });

    if (error) {
      return res.status(400).json({
        message: "Invalid email address",
        details: error.details,
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await Admin.create({
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/submit", async (req, res) => {
  try {

    console.log(req.body);
    const newReport = await Report.create(req.body);

    console.log("New Report:", newReport);

    return res.status(200).json({
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    const token2 = {
      userId: user._id.toString(),
      email: user.email,
    };
    // console.log(token2);

    // const token3 = user._id;

    return res.status(200).json({
      token: token2,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/admin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //  console.log(email, password);
  try {
    const user = await Admin.findOne({ email });
    // console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token2 = {
      userId: user._id.toString(),
      email: user.email,
    };
    // console.log(token2);

    // const token3 = user._id;

    return res.status(200).json({
      token: token2,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}/`;
    const emailSent = await sendEmail(user.email, "Password Reset", url);

    if (emailSent) {
      return res
        .status(200)
        .send({ message: "Password reset link sent to your email account" });
    } else {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/admin/forgot-password", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await Admin.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.BASE_URL}admin/password-reset/${user._id}/${token.token}/`;
    const emailSent = await sendEmail(user.email, "Password Reset", url);

    if (emailSent) {
      return res
        .status(200)
        .send({ message: "Password reset link sent to your email account" });
    } else {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

app.post("/password-reset/:userId/:token", async (req, res) => {
  try {
    // console.log();
    const { userId, token } = req.params;
    const { password } = req.body;
    // console.log(userId, token, password)
    const validToken = await Token.findOne({ userId, token });
    if (!validToken) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(password);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // await validToken.remove();

    return res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
app.post("/admin/password-reset/:userId/:token", async (req, res) => {
  try {
    // console.log();
    const { userId, token } = req.params;
    const { password } = req.body;
    // console.log(userId, token, password)
    const validToken = await Token.findOne({ userId, token });
    if (!validToken) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    const hashedPassword = await hashPassword(password);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // await validToken.remove();

    return res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(port, console.log(`Listening on port ${port}...`));

app.get("/reports", async (req, res, next) => {
  try {
    const reports = await Report.find();
    return res.status(200).send({ reports: reports });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/reports/:userId", async (req, res,next) => {
  
  const userId = req.params.userId;
  try {
    const reports = await Report.find({ userId });
    return res.status(200).send({ reports: reports });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get("/users",async(req,res,next)=>{

  try {
    const users= await User.find();

    return res.status(200).json({users});
  } catch (error) {
    
  }
})
