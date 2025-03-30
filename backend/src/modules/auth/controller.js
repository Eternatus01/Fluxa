import AuthService from "./service.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, username, channel_name } = req.body;

    const user = await AuthService.signUp(
      email,
      password,
      username,
      channel_name
    );
    const token = user.token;

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 96 * 60 * 60 * 1000, // 96 часа
      sameSite: "lax", // или "strict" в зависимости от требований
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AuthService.signIn(email, password);
    const token = user.token;
    const refreshToken = user.refreshToken;

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 96 * 60 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 96 * 60 * 60 * 1000,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    const user = await AuthService.signOut();
    res.clearCookie("session_token", {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax", // или "strict" в зависимости от требований
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: "Отсутствует refresh_token" });
    }

    const result = await AuthService.refreshToken(refresh_token);

    // Устанавливаем новые куки с обновленными токенами
    res.cookie("session_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 96 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 96 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
      },
      message: "Токен успешно обновлен",
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
