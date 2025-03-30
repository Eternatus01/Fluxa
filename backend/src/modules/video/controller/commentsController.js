import CommentsService from "../service/commentsService.js";

// Добавление тегов к видео
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.query;
    const comments = await CommentsService.getComments(videoId);
    res.status(201).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение тегов для видео
export const addComment = async (req, res) => {
  try {
    const { videoId, userId, text, parentCommentId } = req.body;

    const comment = await CommentsService.addComment(
      videoId,
      userId,
      text,
      parentCommentId
    );
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: "Пользователь не авторизован" });
    }

    const result = await CommentsService.deleteComment(comment_id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { comment_id } = req.query;

    const comment = await CommentsService.getReplies(comment_id);

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
