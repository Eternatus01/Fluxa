import StorageVideoService from "./service.js";

export const uploadVideo = async (req, res) => {
  try {
    const files = req.files;
    const video = files.video[0];
    const thumbnail = files.thumbnail[0];

    const result = await StorageVideoService.uploadVideo(
      video,
      thumbnail,
      req.body.videoPath,
      req.body.thumbnailPath
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTumbnail = async (req, res) => {
  try {
    const file = req.file;

    await StorageVideoService.updateTumbnail(
      file,
      req.body.thumbnailPath
    );

    res.status(200).json("Превью успешно изменено");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
