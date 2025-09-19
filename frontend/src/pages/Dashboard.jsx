import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostService from "../api/PostService";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await PostService.getPosts(user.token);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdPost = await PostService.createPost(
        { text: newPost },
        user.token
      );
      setPosts([...posts, createdPost]);
      setNewPost("");
    } catch (error) {
      console.error("Failed to Post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await PostService.deletePost(postId, user.token);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete Post:", error);
    }
  };

  return (
    <div>
      <h1>DevConnect Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="newPost"
          value={newPost}
          placeholder="What's on your mind?"
          onChange={(e) => setNewPost(e.target.value)}
          required
        ></textarea>
        <button type="submit">Post</button>
      </form>

      <div>
        <h2>All posts</h2>
        {posts.map((post) => (
          <div key={post._id}>
            <p>{post.text}</p>
            <p>By: {post.user.name}</p>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
