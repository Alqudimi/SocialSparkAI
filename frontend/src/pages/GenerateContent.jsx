import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentAPI, postsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Sparkles, RefreshCw, Save } from 'lucide-react';

export default function GenerateContent() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setGenerating(true);
    setError('');
    try {
      const response = await contentAPI.generate({ topic, platform });
      setGeneratedContent(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await postsAPI.create({
        content: generatedContent.content,
        hashtags: generatedContent.hashtags,
        platforms: [platform],
      });
      navigate('/posts');
    } catch (err) {
      setError('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Generate Content</h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Theme
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic (e.g., AI in marketing, productivity tips)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="twitter">Twitter/X</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Sparkles className="h-5 w-5" />
                <span>{generating ? 'Generating...' : 'Generate Content'}</span>
              </button>
            </div>

            {generatedContent && (
              <div className="mt-8 bg-white rounded-lg shadow p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Generated Content</h2>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{generatedContent.content}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggested Hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((hashtag, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
