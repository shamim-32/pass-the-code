import { Download, Eye, Grid, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import api from '../../api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Textarea } from '../ui/Input';
import Modal from '../ui/Modal';

const CommunicationBoard = () => {
  const [formData, setFormData] = useState({
    vocabulary_focus: 'basic needs',
    age_level: 'child',
    communication_goals: 'daily communication'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const vocabularyFocus = [
    { value: 'basic needs', label: 'Basic Needs (eat, drink, help)' },
    { value: 'emotions', label: 'Emotions & Feelings' },
    { value: 'school', label: 'School & Learning' },
    { value: 'social', label: 'Social Interactions' },
    { value: 'activities', label: 'Activities & Play' },
    { value: 'family', label: 'Family & Home' },
  ];

  const ageLevels = [
    { value: 'toddler', label: 'Toddler (2-4 years)' },
    { value: 'child', label: 'Child (5-11 years)' },
    { value: 'teen', label: 'Teen (12-17 years)' },
    { value: 'adult', label: 'Adult (18+ years)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await api.post('/skills/comm_board', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error creating communication board:', error);
      alert(error?.response?.data?.message || 'Failed to create communication board');
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
            <div className="p-2 bg-cyan-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Communication Board</h2>
              <p className="text-gray-600">Create personalized AAC boards for students with speech disorders</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vocabulary Focus
              </label>
              <select
                value={formData.vocabulary_focus}
                onChange={(e) => handleInputChange('vocabulary_focus', e.target.value)}
                className="input-field"
              >
                {vocabularyFocus.map(focus => (
                  <option key={focus.value} value={focus.value}>
                    {focus.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose the main category of words to focus on
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Level
              </label>
              <select
                value={formData.age_level}
                onChange={(e) => handleInputChange('age_level', e.target.value)}
                className="input-field"
              >
                {ageLevels.map(age => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Communication Goals"
              placeholder="Describe specific communication goals or needs (e.g., 'requesting help in classroom', 'expressing emotions during therapy', 'ordering food at restaurants')..."
              rows={4}
              value={formData.communication_goals}
              onChange={(e) => handleInputChange('communication_goals', e.target.value)}
              description="This helps create a more targeted communication board"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              <Grid className="h-5 w-5 mr-2" />
              {loading ? 'Creating Board' : 'Create Communication Board'}
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
                <h3 className="text-lg font-semibold">Communication Board Ready!</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Board
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const text = result.result?.comm_board_layout || JSON.stringify(result, null, 2);
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'communication-board.txt';
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-cyan-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {result.resource?.title || 'Communication Board'}
              </h4>
              <p className="text-sm text-gray-600">
                A personalized AAC communication board has been created with vocabulary organized by categories, 
                including core words, social phrases, and emergency requests tailored for the specified age and goals.
              </p>
              
              {result.result?.vocabulary_list && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Sample Vocabulary</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.result.vocabulary_list.slice(0, 8).map((word, index) => (
                      <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
                    {result.result.vocabulary_list.length > 8 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{result.result.vocabulary_list.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Communication Board Preview"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {result.resource?.title || 'Communication Board'}
              </h3>
              
              {result.result?.comm_board_layout && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Board Layout</h4>
                  <div className="bg-white rounded-lg p-4 border border-cyan-200">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm">
                      {result.result.comm_board_layout}
                    </div>
                  </div>
                </div>
              )}

              {result.result?.vocabulary_list && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Complete Vocabulary List</h4>
                  <div className="bg-white rounded-lg p-4 border border-cyan-200">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {result.result.vocabulary_list.map((word, index) => (
                        <span key={index} className="px-3 py-2 bg-cyan-50 text-cyan-800 rounded-lg text-sm text-center">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result.result?.comm_board_layout && !result.result?.vocabulary_list && (
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
                const text = result.result?.comm_board_layout || JSON.stringify(result, null, 2);
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'communication-board.txt';
                a.click();
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Board
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommunicationBoard;