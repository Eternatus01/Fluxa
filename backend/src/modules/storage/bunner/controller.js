import StorageBunnerService from "./service.js";

export const updateBunner = async (req, res) => {
  try {
    const file = req.file;
    const filePath = req.body.filePath;

    const url = await StorageBunnerService.updateBunner(filePath, file);
    res.status(200).json(url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
