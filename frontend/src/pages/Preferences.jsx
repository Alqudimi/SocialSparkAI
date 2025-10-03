import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preferencesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Settings, Save } from 'lucide-react';

export default function Preferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    topics: [],
    hashtags: [],
    posting_style: 'professional',
    tone: 'friendly',
    content_length: 'medium',
    include_emojis: true,
  });
  const [topicInput, setTopicInput] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await preferencesAPI.get();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (topicInput.trim() && !preferences.topics.includes(topicInput.trim())) {
      setPreferences({
        ...preferences,
        topics: [...preferences.topics, topicInput.trim()],
      });
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (topic) => {
    setPreferences({
      ...preferences,
      topics: preferences.topics.filter((t) => t !== topic),
    });
  };

  const handleAddHashtag = (e) => {
    e.preventDefault();
    let hashtag = hashtagInput.trim();
    if (!hashtag.startsWith('#')) hashtag = '#' + hashtag;
    if (hashtag.length > 1 && !preferences.hashtags.includes(hashtag)) {
      setPreferences({
        ...preferences,
        hashtags: [...preferences.hashtags, hashtag],
      });
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (hashtag) => {
    setPreferences({
      ...preferences,
      hashtags: preferences.hashtags.filter((h) => h !== hashtag),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await preferencesAPI.update(preferences);
      setMessage('Preferences saved successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Settings className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Content Preferences</h1>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topics of Interest
                </label>
                <form onSubmit={handleAddTopic} className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Add a topic (e.g., Technology, Marketing)"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {preferences.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center space-x-2"
                    >
                      <span>{topic}</span>
                      <button onClick={() => handleRemoveTopic(topic)} className="text-indigo-900 hover:text-indigo-700">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Hashtags
                </label>
                <form onSubmit={handleAddHashtag} className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="Add a hashtag (e.g., marketing)"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                  />
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {preferences.hashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center space-x-2"
                    >
                      <span>{hashtag}</span>
                      <button onClick={() => handleRemoveHashtag(hashtag)} className="text-purple-900 hover:text-purple-700">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Style
                </label>
                <select
                  value={preferences.posting_style}
                  onChange={(e) => setPreferences({ ...preferences, posting_style: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="educational">Educational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={preferences.tone}
                  onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Length
                </label>
                <select
                  value={preferences.content_length}
                  onChange={(e) => setPreferences({ ...preferences, content_length: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="short">Short (under 100 characters)</option>
                  <option value="medium">Medium (100-200 characters)</option>
                  <option value="long">Long (200-280 characters)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include_emojis"
                  checked={preferences.include_emojis}
                  onChange={(e) => setPreferences({ ...preferences, include_emojis: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <label htmlFor="include_emojis" className="text-sm text-gray-700">
                  Include emojis in generated content
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
