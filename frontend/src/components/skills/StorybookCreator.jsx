import React, { useState } from 'react';
import { BookOpen, Wand2, Download, Eye } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const StorybookCreator = () => {
  const [formData, setFormData] = useState({
    content: '',
    title: '',
    options: {
      age: '10',
      reading_level: 'grade5',
      include_images: true,
    }
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/storybook', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error creating storybook:', error);
      alert(error?.response?.data?.message || 'Failed to create storybook');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Dyslexic Support</h2>
              <p className="text-gray-600">Transform complex text into engaging, easy-to-read storybooks</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Story Title"
              placeholder="Enter a title for your storybook"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-lg"
            />

            <Textarea
              label="Educational Content"
              placeholder="Paste your lesson text, article, or educational content here..."
              rows={8}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              description="This content will be transformed into an engaging storybook format suitable for dyslexic learners"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Age
                </label>
                <select
                  value={formData.options.age}
                  onChange={(e) => handleInputChange('options.age', e.target.value)}
                  className="input-field"
                >
                  <option value="6">6 years</option>
                  <option value="8">8 years</option>
                  <option value="10">10 years</option>
                  <option value="12">12 years</option>
                  <option value="14">14 years</option>
                  <option value="16">16+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Level
                </label>
                <select
                  value={formData.options.reading_level}
                  onChange={(e) => handleInputChange('options.reading_level', e.target.value)}
                  className="input-field"
                >
                  <option value="grade1">Grade 1</option>
                  <option value="grade3">Grade 3</option>
                  <option value="grade5">Grade 5</option>
                  <option value="grade8">Grade 8</option>
                  <option value="high_school">High School</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="include_images"
                  checked={formData.options.include_images}
                  onChange={(e) => handleInputChange('options.include_images', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="include_images" className="text-sm font-medium text-gray-700">
                  Include image descriptions
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.content.trim()}
                className="flex-1"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                {loading ? 'Creating Storybook' : 'Create Storybook'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="success">Generated</Badge>
                <h3 className="text-lg font-semibold">Your Storybook is Ready!</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                {result.resource?.storageUrl && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(result.resource.storageUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {result.resource?.title || 'Generated Storybook'}
              </h4>
              <p className="text-sm text-gray-600">
                Your content has been transformed into a dyslexia-friendly storybook with simple sentences, 
                clear transitions, and engaging narrative elements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Storybook Preview"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {result.resource?.title || 'Your Storybook'}
              </h3>
              <div className="prose prose-lg max-w-none">
                {result.result?.storybook_content ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {result.result.storybook_content}
                  </div>
                ) : (
                  <p className="text-gray-600">Storybook content will appear here...</p>
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
                  Download Full Version
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StorybookCreator;