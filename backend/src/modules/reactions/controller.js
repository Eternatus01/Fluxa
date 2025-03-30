import ReactionService from "./service.js";

export const addReaction = async (req, res) => {
  try {
    const { video_id, user_id, type } = req.body;
    const data = await ReactionService.addReaction(video_id, user_id, type);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReactions = async (req, res) => {
  try {
    const { video_id } = req.query;
    const data = await ReactionService.getReactions(video_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addReactionComment = async (req, res) => {
  try {
    const { comment_id, user_id, type } = req.body;
    const data = await ReactionService.addReactionComment(comment_id, user_id, type);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReactionsComment = async (req, res) => {
  try {
    const { comment_id } = req.query;
    const data = await ReactionService.getReactionsComment(comment_id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
