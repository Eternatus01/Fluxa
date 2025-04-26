import supabase from "./../../../lib/supabase/client.js";
import { fileTypeFromBuffer } from "file-type";

export default class StoragePlaylistService {
  static async uploadCover(file, coverPath) {
    try {
      const coverBuffer = file.buffer;
      const type = await fileTypeFromBuffer(coverBuffer);

      const { error } = await supabase.storage
        .from("playlists")
        .upload(coverPath, coverBuffer, {
          upsert: true,
          contentType: type?.mime || "image/jpeg",
        });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}
