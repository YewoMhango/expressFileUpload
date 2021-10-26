import express from "express";
import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import _ from "lodash";

const host = "http://localhost";
const port = 8080;

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.listen(8080, () => console.log(`Server listening on ${host}:${port}`));

app.use(express.static(path.join(__dirname, "static")));

app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file: any = req.files.file;
      let fileName = await determinePath(file.name);

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      file.mv("./static/uploads/" + fileName);

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          fileUrl: `${host}:${port}/uploads/${fileName}`,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

async function determinePath(name: string) {
  let resultingFileName = name;
  let count = 1;

  while (await fileExists(resultingFileName)) {
    let pointIndex = name.lastIndexOf(".");
    resultingFileName = `${name.slice(0, pointIndex)} (${count++})${name.slice(
      pointIndex
    )}`;
  }

  return resultingFileName;
}

async function fileExists(fileName: string) {
  try {
    let stats = await fs.promises.stat(
      path.join(__dirname, "static", "uploads", fileName)
    );
    return true;
  } catch (e) {
    return false;
  }
}
