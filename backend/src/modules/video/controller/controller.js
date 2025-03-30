import VideoService from "../service/service.js";

export const uploadVideo = async (req, res) => {
  try {
    const {
      user_id,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags,
      videoType,
    } = req.body;

    const video = await VideoService.uploadVideo(
      user_id,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags,
      videoType
    );
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideoService.getAllVideos();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserVideos = async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log("id", user_id);
    const videos = await VideoService.getUserVideos(user_id);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const { id, user_id } = req.query;
    const video = await VideoService.getVideo(id, user_id);
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const {
      video_id,
      user_id,
      title,
      description,
      thumbnailUrl,
      video_url,
      tags,
      type,
    } = req.body;
    await VideoService.updateVideo(
      video_id,
      user_id,
      title,
      description,
      thumbnailUrl,
      video_url,
      tags,
      type
    );
    res.status(200).json("Видео успешно обновлено");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Поисковый запрос обязателен" });
    }
    const videos = await VideoService.searchVideos(query);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
