import supabase from "./../../../lib/supabase/client.js";

export default class StorageBunnerService {
  static async updateBunner(filePath, file) {
    try {
      const fileBuffer = file.buffer;

      const { data, error } = await supabase.storage
        .from("Bunners")
        .update(filePath, fileBuffer, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const { publicUrl } = supabase.storage
        .from("Bunners")
        .getPublicUrl(filePath);

      return { path: data.path, url: publicUrl };
    } catch (error) {
      throw error;
    }
  }
}
