class UploadController {
  async uploadPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded or invalid format',
        });
      }

      res.json({
        message: 'File saved successfully',
        filename: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default new UploadController();
