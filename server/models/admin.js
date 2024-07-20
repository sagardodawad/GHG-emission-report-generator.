const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const adminSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
});

adminSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const Admin = mongoose.model("admin", adminSchema);

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("email"),
		password: passwordComplexity().required().label("password"),
	});
	return schema.validate(data);
};

module.exports = { Admin, validate };