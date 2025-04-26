import StoragePlaylistService from "./service.js";

export const uploadCover = async (req, res) => {
  try {
    const file = req.file;
    await StoragePlaylistService.uploadCover(file, req.body.coverPath);
    res.status(200).json("Обложка успешно загружена");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
