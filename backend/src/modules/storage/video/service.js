import supabase from "./../../../lib/supabase/client.js";
import { fileTypeFromBuffer } from "file-type"; // Импортируем библиотеку

export default class StorageVideoService {
  static async uploadVideo(video, tumbnail, videoPath, thumbnailPath) {
    try {
      const videoBuffer = video.buffer;
      const tumbnailBuffer = tumbnail.buffer;

      const typeVideo = await fileTypeFromBuffer(videoBuffer);

      const { error: errorVideo } = await supabase.storage
        .from("Videos")
        .upload(videoPath, videoBuffer, {
          upsert: true,
          contentType: typeVideo.mime,
        });

      if (errorVideo) throw errorVideo;

      const { error: errorThumbnail } = await supabase.storage
        .from("Thumbnails")
        .upload(thumbnailPath, tumbnailBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (errorThumbnail) throw errorThumbnail;
    } catch (error) {
      throw error;
    }
  }

  static async updateTumbnail(file, thumbnailPath) {
    try {
      const tumbnailBuffer = file.buffer;

      const { error: errorThumbnail } = await supabase.storage
        .from("Thumbnails")
        .upload(thumbnailPath, tumbnailBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (errorThumbnail) throw errorThumbnail;
    } catch (error) {
      throw error;
    }
  }
}
