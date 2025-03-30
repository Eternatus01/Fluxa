import supabase from "./../../../lib/supabase/client.js";

export default class StorageAvatarService {
  static async addAvatar(filePath, file) {
    try {
      const fileBuffer = file.buffer;

      const { data, error: uploadError } = await supabase.storage
        .from("Avatars")
        .upload(filePath, fileBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { publicUrl } = supabase.storage
        .from("Avatars")
        .getPublicUrl(filePath);

      return { path: data.path, url: publicUrl };
    } catch (error) {
      console.error("StoreService addAvatar error:", error.message);
      throw error;
    }
  }

  static async updateAvatar(filePath, file) {
    try {
      const fileBuffer = file.buffer;

      const { data, error } = await supabase.storage
        .from("Avatars")
        .update(filePath, fileBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const { publicUrl } = supabase.storage
        .from("Avatars")
        .getPublicUrl(filePath);

      return { path: data.path, url: publicUrl };
    } catch (error) {
      throw error;
    }
  }

  static async removeAvatar(filePath) {
    try {
      const { data, error: deleteError } = await supabase.storage
        .from("Avatars")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      return data;
    } catch (error) {
      throw error;
    }
  }
}
