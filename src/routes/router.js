const router = require("express").Router();
const {
  createpost,
  createComment,
  feed,
} = require("../controllers/postController");
const {
  Register,
  SendFriendRequest,
  AcceptFriendRequest,
  RejectFriendRequest,
  getAllFriends,
} = require("../controllers/userController");

router.post("/users/register", Register);
router.post("/users/sendRequest", SendFriendRequest);
router.post("/users/acceptRequest", AcceptFriendRequest);
router.post("/users/rejectRequest", RejectFriendRequest);
router.get("/users/getAllFriends/:id", getAllFriends);

router.post("/post/create", createpost);
router.post("/post/comment/:postId", createComment);
router.get("/post/feed/:userId", feed);

module.exports = router;
