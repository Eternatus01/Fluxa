import TagService from "../service/TagService.js";

// Добавление тегов к видео
export const addTagsToVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { tags } = req.body;

    const result = await TagService.addTagsToVideo(videoId, tags);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение тегов для видео
export const getTagsForVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const tags = await TagService.getTagsForVideo(videoId);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удаление тега из видео
export const removeTagFromVideo = async (req, res) => {
  try {
    const { videoId, tagId } = req.params;

    const result = await TagService.removeTagFromVideo(videoId, tagId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};