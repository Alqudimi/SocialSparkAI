import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialAccountsAPI, postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Plus, Twitter, Facebook, Instagram, Linkedin, Calendar, FileText } from 'lucide-react';

const platformIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: 'twitter', account_name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accountsRes, postsRes] = await Promise.all([
        socialAccountsAPI.getAll(),
        postsAPI.getAll(),
      ]);
      setSocialAccounts(accountsRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await socialAccountsAPI.create(newAccount);
      setNewAccount({ platform: 'twitter', account_name: '' });
      setShowAddAccount(false);
      loadData();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Are you sure you want to remove this account?')) {
      try {
        await socialAccountsAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting account:', error);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Connected Accounts</p>
                    <p className="text-3xl font-bold text-indigo-600">{socialAccounts.length}</p>
                  </div>
                  <div className="bg-indigo-100 rounded-full p-3">
                    <Twitter className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Posts</p>
                    <p className="text-3xl font-bold text-green-600">{posts.length}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Scheduled</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {posts.filter(p => p.status === 'scheduled').length}
                    </p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Social Accounts</h2>
                  <button
                    onClick={() => setShowAddAccount(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Account</span>
                  </button>
                </div>

                {showAddAccount && (
                  <form onSubmit={handleAddAccount} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <select
                        value={newAccount.platform}
                        onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="twitter">Twitter/X</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Account name"
                        value={newAccount.account_name}
                        onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                      <div className="flex space-x-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddAccount(false)}
                          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {socialAccounts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No social accounts connected yet</p>
                  ) : (
                    socialAccounts.map((account) => {
                      const Icon = platformIcons[account.platform] || Twitter;
                      return (
                        <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-semibold capitalize">{account.platform}</p>
                              <p className="text-sm text-gray-600">@{account.account_name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                  <Link to="/posts" className="text-indigo-600 hover:text-indigo-700">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {posts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No posts yet</p>
                  ) : (
                    posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' :
                            post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/generate"
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">Generate Content</h4>
                  <p className="text-sm text-gray-600">Create AI-powered posts</p>
                </Link>
                <Link
                  to="/preferences"
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">Set Preferences</h4>
                  <p className="text-sm text-gray-600">Configure content style</p>
                </Link>
                <Link
                  to="/calendar"
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">View Calendar</h4>
                  <p className="text-sm text-gray-600">Schedule your posts</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
