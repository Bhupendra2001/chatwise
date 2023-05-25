const userModels = require("../models/userModels");

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username)
      return res.status(400).json({ error: "please enter the username " });
    if (!email)
      return res.status(400).json({ error: "please enter the email " });
    if (!password)
      return res.status(400).json({ error: "please enter the password " });

    const checkEmailUnique = await userModels.findOne({ email });
    if (checkEmailUnique)
      return res.status(400).json({ error: "User alredy exits " });
    const user = new userModels({ username, email, password });
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.error("Error registering user :", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

const SendFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    await userModels.findByIdAndUpdate(senderId, {
      $push: { friendRequests: { sender: recipientId, status: "pending" } },
    });

    await userModels.findByIdAndUpdate(recipientId, {
      $push: { friendRequests: { sender: senderId, status: "received" } },
    });

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error Sending Friend Request :", error);
    return res.status(500).json({ error: "Failed to send friend request" });
  }
};

const AcceptFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    await userModels.findByIdAndUpdate(senderId, {
      $push: { friends: recipientId },
      $pull: { friendRequests: { sender: recipientId } },
    });

    await userModels.findByIdAndUpdate(recipientId, {
      $push: { friends: senderId },
      $pull: { friendRequests: { sender: senderId } },
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error Accepting Friend Request :", error);
    return res.status(500).json({ error: "Failed to accept friend request" });
  }
};

const RejectFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    await userModels.findByIdAndUpdate(senderId, {
      $pull: { friendRequests: { sender: recipientId } },
    });

    await userModels.findByIdAndUpdate(recipientId, {
      $pull: { friendRequests: { sender: senderId } },
    });

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return res.status(500).json({ error: "Failed to reject friend request" });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModels.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const friends = await userModels.populate(user, {
      path: "friends",
      select: "username email",
    });

    const friendsDetails = friends.friends.map((friend) => ({
      username: friend.username,
      email: friend.email,
    }));
    return res.status(200).send({ data: friendsDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Failed to getALLfriends " });
  }
};
module.exports = {
  Register,
  SendFriendRequest,
  AcceptFriendRequest,
  RejectFriendRequest,
  getAllFriends,
};
