import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PostCard from "./PostCard";

import type { PostListItem } from "../../../types/post";
import type { PostFilters, PostSortKey } from "../../../types/filter";
import { getPostList } from "../../../services/PostService";

interface CommunityPanelProps {
  filters?: PostFilters;
  onSelectPost: (post: PostListItem) => void;
}

export default function PostPanel({ filters, onSelectPost }: CommunityPanelProps) {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostList().then((result) => {
      if (result.ok) {
        const sharedPosts = result.data.board.filter((p) => p.share === 1);
        setPosts(sharedPosts);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-gray-300 text-center py-20">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg"
      >
        <p className="text-lg font-medium">아직 공유된 악보가 없습니다 🎶</p>
        <p className="text-sm mt-2 text-gray-500">
          My Tabs에서 <span className="text-blue-400 font-semibold">Share</span> 버튼을 눌러보세요!
        </p>
      </motion.div>
    );
  }

  const activeInstruments = Object.entries(filters?.instrument ?? {})
    .filter(([, active]) => active)
    .map(([key]) => key);

  const activeDifficulties = Object.entries(filters?.difficulty ?? {})
    .filter(([, active]) => active)
    .map(([key]) => key);

  let filteredPosts = posts.filter((post) => {
    return (
      activeInstruments.includes(post.instrument) &&
      activeDifficulties.includes(post.difficulty)
    );
  });

  const sortMode: PostSortKey = filters?.sort ?? "LATEST";

  filteredPosts = [...filteredPosts].sort((a, b) => {
    switch (sortMode) {
      case "LATEST":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "OLDEST":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "HIGHEST_RATED":
        return b.rating - a.rating;
      case "LOWEST_RATED":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  if (filteredPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 py-12 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-inner"
      >
        <p>No posts match the selected filters 🎼</p>
      </motion.div>
    );
  }

  /** ------------------------------
   * 🔥 6) 렌더링
   * ------------------------------ */
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-8 text-white mb-4"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Community
        </motion.h2>

        <p className="text-gray-400 max-w-xl">
          Browse shared posts and explore community music sheets!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredPosts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            onSelect={() => onSelectPost(post)}
          />
        ))}
      </motion.div>
    </>
  );
}
