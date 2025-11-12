import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    // Reject the file
    cb(new Error("Invalid file type, only PDF is allowed!"))
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
})