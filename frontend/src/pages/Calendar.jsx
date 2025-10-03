import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Calendar as CalendarIcon } from 'lucide-react';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Calendar() {
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data.filter(p => p.scheduled_time));
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostsForDate = (date) => {
    return posts.filter(post => {
      if (!post.scheduled_time) return false;
      const postDate = new Date(post.scheduled_time);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date }) => {
    const postsOnDate = getPostsForDate(date);
    if (postsOnDate.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  const selectedDatePosts = getPostsForDate(selectedDate);

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
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Scheduled Posts Calendar</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <CalendarComponent
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full border-none"
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Posts on {selectedDate.toLocaleDateString()}
                </h2>

                <div className="space-y-4">
                  {selectedDatePosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No posts scheduled for this date
                    </p>
                  ) : (
                    selectedDatePosts.map((post) => (
                      <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(post.scheduled_time).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2 line-clamp-3">{post.content}</p>
                        {post.platforms.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.platforms.map((platform, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
                                {platform}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
