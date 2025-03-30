import supabase from "../../lib/supabase/client.js";

export default class SubscriptionService {
  static async subscribe(user_id, target_id) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          subscriber_id: user_id,
          target_user_id: target_id,
        })
        .select()
        .single();

      if (error) throw error;
      await supabase.rpc('increment_subscribers', { user_id: target_id });
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async unSubscribe(user_id, target_id) {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_id", user_id)
        .eq("target_user_id", target_id);

      if (error) throw error;
      await supabase.rpc('decrement_subscribers', { user_id: target_id });
    } catch (error) {
      throw error;
    }
  }

  static async checkSubscription(user_id, target_id) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select()
        .eq("subscriber_id", user_id)
        .eq("target_user_id", target_id)
        .single();

      return !!data && !error;
    } catch (error) {
      throw error;
    }
  }

  static async getSubscriptions(user_id) {
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("target_user_id")
        .eq("subscriber_id", user_id);

      if (error) throw error;

      return data?.map((item) => item.target_user_id) || [];
    } catch (error) {
      throw error;
    }
  }
}
