import UserService from "./service.js";

export const getUser = async (req, res) => {
  try {
    const user = await UserService.getUser(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    console.log("user", req.query)
    const { user_id } = req.query;
    const user = await UserService.getUser(user_id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const { users_id } = req.query;
    const user = await UserService.getUsers(users_id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await UserService.getUserByUsername(username);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
