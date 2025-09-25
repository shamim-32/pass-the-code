import React, { useState } from 'react';
import { Users, BookOpen, Download, Eye } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const SocialStoryCreator = () => {
  const [formData, setFormData] = useState({
    situation: '',
    student_name: '',
    specific_needs: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.situation.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/social_story', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error creating social story:', error);
      alert(error?.response?.data?.message || 'Failed to create social story');
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Social Story Creator</h2>
              <p className="text-gray-600">Create personalized social stories for students with autism</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Student Name"
              placeholder="Enter the student's name"
              value={formData.student_name}
              onChange={(e) => handleInputChange('student_name', e.target.value)}
              description="This will personalize the story for the student"
            />

            <Textarea
              label="Situation or Scenario"
              placeholder="Describe the situation the student needs help with (e.g., 'going to the dentist', 'starting a new school', 'dealing with loud noises')..."
              rows={4}
              value={formData.situation}
              onChange={(e) => handleInputChange('situation', e.target.value)}
              description="Be specific about the situation that needs a social story"
            />

            <Textarea
              label="Specific Needs or Considerations"
              placeholder="Describe any specific needs, triggers, or considerations for this student (e.g., 'sensitive to loud sounds', 'needs extra time to process', 'prefers visual cues')..."
              rows={4}
              value={formData.specific_needs}
              onChange={(e) => handleInputChange('specific_needs', e.target.value)}
              description="This helps create a more targeted and effective social story"
            />

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.situation.trim()}
              className="w-full"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              {loading ? 'Creating Social Story' : 'Create Social Story'}
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
                <h3 className="text-lg font-semibold">Social Story Ready!</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Story
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
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {result.resource?.title || `Social Story for ${formData.student_name}`}
              </h4>
              <p className="text-sm text-gray-600">
                A personalized social story has been created to help {formData.student_name || 'the student'} 
                understand and navigate the situation with clear, simple language and positive guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Social Story Preview"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {result.resource?.title || `Social Story for ${formData.student_name}`}
              </h3>
              <div className="prose prose-lg max-w-none">
                {result.result?.social_story ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {result.result.social_story}
                  </div>
                ) : (
                  <p className="text-gray-600">Social story content will appear here...</p>
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
                  Download Full Story
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SocialStoryCreator;