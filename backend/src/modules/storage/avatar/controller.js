import StorageAvatarService from "./service.js";

export const addAvatar = async (req, res) => {
  try {
    const file = req.file;
    const filePath = req.body.filePath;

    const url = await StorageAvatarService.addAvatar(filePath, file);
    res.status(200).json(url);
  } catch (err) {
    console.error("addAvatar error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const file = req.file;
    const filePath = req.body.filePath;
    console.log("data", file, filePath);

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!filePath) {
      return res.status(400).json({ error: "filePath is required" });
    }

    const url = await StorageAvatarService.updateAvatar(filePath, file);
    res.status(200).json(url);
  } catch (err) {
    console.error("updateAvatar error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const removeAvatar = async (req, res) => {
  try {
    const filePath = req.body.filePath;

    if (!filePath) {
      return res.status(400).json({ error: "filePath is required" });
    }

    const data = await StorageAvatarService.removeAvatar(filePath);
    res.status(200).json({ message: "File deleted successfully", data });
  } catch (err) {
    console.error("RemoveAvatar error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
