const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const userData = require("./ModelData");
const port = 5000;
const url =
	"mongodb+srv://shotkode:shotkode@cluster0.2kfdg.mongodb.net/vercelTestDB?retryWrites=true&w=majority";

const app = express();

const fileUpload = multer();

cloudinary.config({
	cloud_name: "dv4dlmp4e",
	api_key: "464513458841612",
	api_secret: "VxFfeGaNMPPudxcq0GWcsh6zfRk",
});

mongoose.connect(url).then(() => {
	console.log("database connection established");
});

app.use(express.json());

app.post("/upload", fileUpload.single("image"), async (req, res) => {
	let streamUpload = (req) => {
		return new Promise((resolve, reject) => {
			let stream = cloudinary.uploader.upload_stream((error, result) => {
				if (result) {
					resolve(result);
				} else {
					reject(error);
				}
			});

			streamifier.createReadStream(req.file.buffer).pipe(stream);
		});
	};

	const { name } = req.body;
	let result = await streamUpload(req);
	console.log(result);

	const createUser = await userData.create({
		name,
		image: result.secure_url,
	});

	return res.status(200).json({
		message: "successful",
		data: createUser,
	});
});

app.listen(port, () => {
	console.log("listening on port");
});
