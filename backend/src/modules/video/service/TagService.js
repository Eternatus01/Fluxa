import supabase from "./../../../lib/supabase/client.js";

export default class TagService {
  // Добавление тегов к видео
  static async addTagsToVideo(videoId, tags) {
    try {
      // Получаем существующие теги из базы данных
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", tags);

      const existingTagNames = existingTags.map((tag) => tag.name);
      const newTags = tags.filter((tag) => !existingTagNames.includes(tag));

      if (newTags.length > 0) {
        const { data: insertedTags } = await supabase
          .from("tags")
          .insert(newTags.map((name) => ({ name })))
          .select();

        existingTags.push(...insertedTags);
      }

      // Получаем существующие связи тегов с видео
      const { data: existingVideoTags } = await supabase
        .from("video_tags")
        .select("tag_id")
        .eq("video_id", videoId);
      
      const existingTagIds = existingVideoTags.map(vt => vt.tag_id);
      
      // Фильтруем только новые теги, которых еще нет у видео
      const tagIds = existingTags.map((tag) => tag.id);
      const newTagIds = tagIds.filter(id => !existingTagIds.includes(id));
      
      // Если есть новые теги для добавления
      if (newTagIds.length > 0) {
        const { error } = await supabase
          .from("video_tags")
          .insert(newTagIds.map((tagId) => ({ video_id: videoId, tag_id: tagId })));

        if (error) throw error;
      }

      return { message: "Теги успешно добавлены" };
    } catch (error) {
      console.error("Ошибка при добавлении тегов:", error);
      throw error;
    }
  }

  // Получение тегов для видео
  static async getTagsForVideo(videoId) {
    try {
      const { data, error } = await supabase
        .from("video_tags")
        .select("tags(name)")
        .eq("video_id", videoId);

      if (error) throw error;

      const tags = data.map((row) => row.tags.name);
      return tags;
    } catch (error) {
      console.error("Ошибка при получении тегов:", error);
      throw error;
    }
  }

  // Удаление тега из видео
  static async removeTagFromVideo(videoId, tagId) {
    try {
      const { error } = await supabase
        .from("video_tags")
        .delete()
        .eq("video_id", videoId)
        .eq("tag_id", tagId);

      if (error) throw error;

      return { message: "Тег успешно удален" };
    } catch (error) {
      console.error("Ошибка при удалении тега:", error);
      throw error;
    }
  }
}
