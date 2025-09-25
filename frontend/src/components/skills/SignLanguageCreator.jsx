import React, { useState } from 'react';
import { Hand, Video, Download, Eye } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const SignLanguageCreator = () => {
  const [formData, setFormData] = useState({
    content: '',
    title: '',
    dialect: 'ASL'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/sign', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error creating sign language video:', error);
      alert(error?.response?.data?.message || 'Failed to create sign language video');
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Hand className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Deaf Support</h2>
              <p className="text-gray-600">Convert text content into sign language video format</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Video Title"
              placeholder="Enter a title for your sign language video"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />

            <Textarea
              label="Content to Sign"
              placeholder="Enter the text content you want to convert to sign language..."
              rows={6}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              description="This content will be converted into a detailed sign language video script"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sign Language Dialect
              </label>
              <select
                value={formData.dialect}
                onChange={(e) => handleInputChange('dialect', e.target.value)}
                className="input-field"
              >
                <option value="ASL">American Sign Language (ASL)</option>
                <option value="BSL">British Sign Language (BSL)</option>
                <option value="ISL">International Sign Language</option>
              </select>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.content.trim()}
              className="w-full"
            >
              <Video className="h-5 w-5 mr-2" />
              {loading ? 'Creating Sign Video' : 'Create Sign Language Video'}
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
                <h3 className="text-lg font-semibold">Sign Language Video Ready!</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Script
                </Button>
                {result.resource?.storageUrl && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(result.resource.storageUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {result.resource?.title || 'Sign Language Video'}
              </h4>
              <p className="text-sm text-gray-600">
                Your content has been converted into a comprehensive sign language video script 
                with timing, gestures, and visual communication notes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Sign Language Script Preview"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {result.resource?.title || 'Sign Language Script'}
              </h3>
              <div className="prose prose-lg max-w-none">
                {result.result?.video_script ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm">
                    {result.result.video_script}
                  </div>
                ) : (
                  <p className="text-gray-600">Sign language script will appear here...</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              {result.resource?.storageUrl && (
                <Button onClick={() => window.open(result.resource.storageUrl, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SignLanguageCreator;