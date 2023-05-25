const Post = require("../models/postModels");
const User = require("../models/userModels");

const createpost = async (req, res) => {
  try {
    const { creatorId, content } = req.body;
    const post = new Post({ creator: creatorId, content });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error in creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;
    // Find the post and add a comment
    const post = await Post.findById(postId);
    post.comments.push({ user: userId, content });
    await post.save();

    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

const feed = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const friendIds = user.friends;

    const posts = await Post.find({ creator: { $in: friendIds } })
      .populate("creator", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};
module.exports = { createpost, createComment, feed };
