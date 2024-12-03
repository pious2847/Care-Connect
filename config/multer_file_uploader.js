const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = upload;