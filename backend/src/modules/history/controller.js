import HistoryService from "./service.js";

export const addToHistory = async (req, res) => {
  try {
    const { video_id } = req.body;
    const userId = req.user?.id;

    await HistoryService.addToHistory(userId, video_id);
    res.status(200).json({ message: "Видео добавлено в историю" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { user_id } = req.query;
    const history = await HistoryService.getHistory(user_id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await HistoryService.clearHistory(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
