import React, { useState } from 'react';
import { Heart, MessageCircle, Download, Eye } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const EmotionCoach = () => {
  const [formData, setFormData] = useState({
    emotion_input: '',
    situation: 'general',
    age_group: 'teen'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const situations = [
    { value: 'general', label: 'General Support' },
    { value: 'school', label: 'School Related' },
    { value: 'family', label: 'Family Issues' },
    { value: 'social', label: 'Social Situations' },
    { value: 'academic', label: 'Academic Stress' },
    { value: 'transition', label: 'Life Transitions' },
  ];

  const ageGroups = [
    { value: 'child', label: 'Child (6-11)' },
    { value: 'teen', label: 'Teen (12-17)' },
    { value: 'young_adult', label: 'Young Adult (18-25)' },
    { value: 'adult', label: 'Adult (25+)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emotion_input.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/emotion', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error getting emotional support:', error);
      alert(error?.response?.data?.message || 'Failed to get emotional support');
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
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Emotion Coaching</h2>
              <p className="text-gray-600">Get emotional support and coping strategies for challenging situations</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-yellow-200 rounded-full">
                <MessageCircle className="h-4 w-4 text-yellow-700" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This tool provides educational emotional support only. For serious mental health concerns, 
                  please contact a qualified mental health professional or crisis helpline.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              label="How are you feeling?"
              placeholder="Describe what you're feeling or going through right now. Be as specific as you'd like (e.g., 'I'm feeling anxious about my upcoming presentation', 'I'm sad because my friend moved away', 'I'm overwhelmed with schoolwork')..."
              rows={5}
              value={formData.emotion_input}
              onChange={(e) => handleInputChange('emotion_input', e.target.value)}
              description="Share your feelings in a safe, supportive environment"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation Type
                </label>
                <select
                  value={formData.situation}
                  onChange={(e) => handleInputChange('situation', e.target.value)}
                  className="input-field"
                >
                  {situations.map(situation => (
                    <option key={situation.value} value={situation.value}>
                      {situation.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  value={formData.age_group}
                  onChange={(e) => handleInputChange('age_group', e.target.value)}
                  className="input-field"
                >
                  {ageGroups.map(age => (
                    <option key={age.value} value={age.value}>
                      {age.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.emotion_input.trim()}
              className="w-full"
            >
              <Heart className="h-5 w-5 mr-2" />
              {loading ? 'Getting Support' : 'Get Emotional Support'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="success">Support Ready</Badge>
                <h3 className="text-lg font-semibold">Emotional Support & Strategies</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Support
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const text = result.support_response || JSON.stringify(result, null, 2);
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'emotional-support.txt';
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-pink-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Personalized Support</h4>
              <p className="text-sm text-gray-600">
                Compassionate guidance and practical coping strategies have been generated based on your 
                feelings and situation, with age-appropriate advice and resources.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Emotional Support & Coping Strategies"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Personalized Support</h3>
              
              {result.support_response && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Emotional Support</h4>
                  <div className="bg-white rounded-lg p-4 border border-pink-200">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {result.support_response}
                    </div>
                  </div>
                </div>
              )}

              {result.coping_strategies && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Coping Strategies</h4>
                  <div className="bg-white rounded-lg p-4 border border-pink-200">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {Array.isArray(result.coping_strategies) 
                        ? result.coping_strategies.join('\n• ')
                        : result.coping_strategies}
                    </div>
                  </div>
                </div>
              )}

              {result.resources && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Additional Resources</h4>
                  <div className="bg-white rounded-lg p-4 border border-pink-200">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {Array.isArray(result.resources) 
                        ? result.resources.join('\n• ')
                        : result.resources}
                    </div>
                  </div>
                </div>
              )}

              {!result.support_response && !result.coping_strategies && !result.resources && (
                <pre className="whitespace-pre-wrap text-sm text-gray-600">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                const text = result.support_response || JSON.stringify(result, null, 2);
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'emotional-support.txt';
                a.click();
              }}>
                <Download className="h-4 w-4 mr-2" />
                Save Support
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmotionCoach;