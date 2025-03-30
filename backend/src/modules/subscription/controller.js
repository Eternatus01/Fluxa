import SubscriptionService from "./service.js";

export const subscribe = async (req, res) => {
  try {
    const target_id = req.body.target_id;
    const user_id = req.user.id;

    const subscription = await SubscriptionService.subscribe(
      user_id,
      target_id
    );
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unSubscribe = async (req, res) => {
  try {
    const target_id = req.body.target_id;
    const user_id = req.user.id;

    await SubscriptionService.unSubscribe(user_id, target_id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkSubscription = async (req, res) => {
  try {
    const target_id = req.query.target_id;
    const user_id = req.user.id;

    const isSubscribed = await SubscriptionService.checkSubscription(
      user_id,
      target_id
    );
    res.status(200).json({ isSubscribed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    const subscriptions = await SubscriptionService.getSubscriptions(user_id);
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
