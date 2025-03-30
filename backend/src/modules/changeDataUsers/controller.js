import ChangeService from "./service.js";

export const changeAvatar = async (req, res) => {
  try {
    const { id, avatar_url } = req.body;
    const url = await ChangeService.changeAvatar(id, avatar_url);
    res.status(200).json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeBunner = async (req, res) => {
  try {
    const { id, bunner_url } = req.body;
    const url = await ChangeService.changeBunner(id, bunner_url);
    res.status(200).json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeChannelName = async (req, res) => {
  try {
    const { id, channel_name } = req.body;
    const url = await ChangeService.changeChannelName(id, channel_name);
    res.status(200).json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
