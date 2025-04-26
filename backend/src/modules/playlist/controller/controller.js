import PlaylistService from "../service/service.js";

export const createPlaylist = async (req, res) => {
  try {
    const { user_id, title, description, is_public, thumbnail_url } = req.body;
    const playlist = await PlaylistService.createPlaylist(
      user_id,
      title,
      description,
      is_public,
      thumbnail_url
    );
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const playlist = await PlaylistService.getPlaylist(id, user_id);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const { user_id } = req.params;
    const playlists = await PlaylistService.getUserPlaylists(user_id);
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicPlaylists = async (req, res) => {
  try {
    const playlists = await PlaylistService.getPublicPlaylists();
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlist_id, video_id, user_id } = req.body;
    const result = await PlaylistService.addVideoToPlaylist(
      playlist_id,
      video_id,
      user_id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlist_id, video_id, user_id } = req.body;
    const result = await PlaylistService.removeVideoFromPlaylist(
      playlist_id,
      video_id,
      user_id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlist_id, user_id } = req.body;
    const result = await PlaylistService.deletePlaylist(playlist_id, user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const {
      playlist_id,
      user_id,
      title,
      description,
      is_public,
      thumbnail_url,
    } = req.body;
    const playlist = await PlaylistService.updatePlaylist(
      playlist_id,
      user_id,
      title,
      description,
      is_public,
      thumbnail_url
    );
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const subscribeToPlaylist = async (req, res) => {
  try {
    const { user_id, playlist_id } = req.body;
    const result = await PlaylistService.subscribeToPlaylist(
      user_id,
      playlist_id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unsubscribeFromPlaylist = async (req, res) => {
  try {
    const { user_id, playlist_id } = req.body;
    const result = await PlaylistService.unsubscribeFromPlaylist(
      user_id,
      playlist_id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubscribedPlaylists = async (req, res) => {
  try {
    const { user_id } = req.params;
    const playlists = await PlaylistService.getSubscribedPlaylists(user_id);
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const isSubscribedToPlaylist = async (req, res) => {
  try {
    const { user_id, playlist_id } = req.params;
    const result = await PlaylistService.isSubscribedToPlaylist(
      user_id,
      playlist_id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserPlaylists = async (req, res) => {
  try {
    const { user_id } = req.params;
    const playlists = await PlaylistService.getAllUserPlaylists(user_id);
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
