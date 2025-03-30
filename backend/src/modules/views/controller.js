import ViewService from "./service.js";

export const addView = async (req, res) => {
  try {
    const { video_id, user_id } = req.body;

    let clientId = req.cookies.client_id;

    if (!clientId) {
      clientId = crypto.randomUUID();
      res.cookie("client_id", clientId, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 год
        secure: false,
      });
    }

    await ViewService.addView(video_id, user_id, clientId);
    res.status(200).json("Просмотр успешно добавлен");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
