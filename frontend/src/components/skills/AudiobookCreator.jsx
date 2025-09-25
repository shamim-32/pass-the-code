import React, { useState } from 'react';
import { Headphones, Play, Download, Volume2 } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';

const AudiobookCreator = () => {
  const [formData, setFormData] = useState({
    content: '',
    title: '',
    voice_preference: 'alloy'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const voiceOptions = [
    { value: 'alloy', label: 'Alloy (Neutral)' },
    { value: 'echo', label: 'Echo (Male)' },
    { value: 'fable', label: 'Fable (British Male)' },
    { value: 'onyx', label: 'Onyx (Deep Male)' },
    { value: 'nova', label: 'Nova (Female)' },
    { value: 'shimmer', label: 'Shimmer (Soft Female)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/audiobook', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error creating audiobook:', error);
      alert(error?.response?.data?.message || 'Failed to create audiobook');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Blind Support</h2>
              <p className="text-gray-600">Convert text content into high-quality audiobooks</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Audiobook Title"
              placeholder="Enter a title for your audiobook"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

            <Textarea
              label="Content to Narrate"
              placeholder="Paste your text content here to convert into an audiobook..."
              rows={8}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              description="This content will be converted into a professional audiobook with clear narration"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Preference
              </label>
              <select
                value={formData.voice_preference}
                onChange={(e) => handleInputChange('voice_preference', e.target.value)}
                className="input-field"
              >
                {voiceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose a voice that's comfortable for extended listening
              </p>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.content.trim()}
              className="w-full"
            >
              <Volume2 className="h-5 w-5 mr-2" />
              {loading ? 'Creating Audiobook' : 'Create Audiobook'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="success">Generated</Badge>
                <h3 className="text-lg font-semibold">Audiobook Ready!</h3>
              </div>
              <div className="flex space-x-2">
                {result.resource?.storageUrl && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const audio = new Audio(result.resource.storageUrl);
                        audio.play();
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.open(result.resource.storageUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {result.resource?.title || 'Generated Audiobook'}
              </h4>
              <p className="text-sm text-gray-600">
                Your content has been converted into a high-quality audiobook with professional narration, 
                clear pronunciation, and natural pacing optimized for blind and visually impaired learners.
              </p>
              
              {result.resource?.storageUrl && (
                <div className="mt-4">
                  <audio controls className="w-full">
                    <source src={result.resource.storageUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudiobookCreator;