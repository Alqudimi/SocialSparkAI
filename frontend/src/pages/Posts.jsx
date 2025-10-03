import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Trash2, Send } from 'lucide-react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handlePublish = async (id) => {
    if (window.confirm('Publish this post now? (This is a simulated action in the MVP)')) {
      try {
        await postsAPI.publish(id);
        loadPosts();
      } catch (error) {
        console.error('Error publishing post:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <FileText className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">No posts yet</p>
                  <p className="text-gray-500">Generate your first post to get started!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' :
                            post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created: {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
                        
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.hashtags.map((hashtag, index) => (
                              <span key={index} className="text-sm text-indigo-600">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        )}

                        {post.platforms.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600">Platforms:</span>
                            {post.platforms.map((platform, index) => (
                              <span key={index} className="text-sm px-2 py-1 bg-gray-100 rounded capitalize">
                                {platform}
                              </span>
                            ))}
                          </div>
                        )}

                        {post.scheduled_time && (
                          <p className="text-sm text-gray-600 mt-2">
                            Scheduled for: {new Date(post.scheduled_time).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {!post.is_published && (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish now"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
