import { Calculator, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import api from '../../api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Textarea } from '../ui/Input';
import Modal from '../ui/Modal';

const MathHelper = () => {
  const [formData, setFormData] = useState({
    problem: '',
    grade_level: 'middle school',
    learning_style: 'visual'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const gradeLevels = [
    { value: 'elementary', label: 'Elementary School' },
    { value: 'middle school', label: 'Middle School' },
    { value: 'high school', label: 'High School' },
    { value: 'college', label: 'College Level' },
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual Learner' },
    { value: 'auditory', label: 'Auditory Learner' },
    { value: 'kinesthetic', label: 'Hands-on Learner' },
    { value: 'step-by-step', label: 'Step-by-step' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/skills/math', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error solving math problem:', error);
      alert(error?.response?.data?.message || 'Failed to solve math problem');
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
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calculator className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Math Support</h2>
              <p className="text-gray-600">Step-by-step math problem solving with visual explanations</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              label="Math Problem"
              placeholder="Enter your math problem here (e.g., 'Solve for x: 2x + 5 = 13', 'Find the area of a circle with radius 7cm', 'What is 15% of 240?')..."
              rows={4}
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              description="Be as specific as possible with your math problem"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={formData.grade_level}
                  onChange={(e) => handleInputChange('grade_level', e.target.value)}
                  className="input-field"
                >
                  {gradeLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Style
                </label>
                <select
                  value={formData.learning_style}
                  onChange={(e) => handleInputChange('learning_style', e.target.value)}
                  className="input-field"
                >
                  {learningStyles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.problem.trim()}
              className="w-full"
            >
              <Calculator className="h-5 w-5 mr-2" />
              {loading ? 'Solving Problem' : 'Solve Math Problem'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="success">Solved</Badge>
                <h3 className="text-lg font-semibold">Solution Ready!</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Solution
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const text = result.solution || JSON.stringify(result, null, 2);
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'math-solution.txt';
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
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Math Problem Solution</h4>
              <p className="text-sm text-gray-600">
                A step-by-step solution has been generated with explanations tailored to your learning style 
                and grade level, including visual aids and memory techniques.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Math Solution"
        size="lg"
      >
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="prose prose-lg max-w-none">
                {result.solution ? (
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {result.solution}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-gray-600">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
              
              {result.visual_aids && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-200">
                  <h4 className="font-medium text-gray-900 mb-2">Visual Aids</h4>
                  <div className="whitespace-pre-wrap text-gray-700 text-sm">
                    {result.visual_aids}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                const text = result.solution || JSON.stringify(result, null, 2);
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'math-solution.txt';
                a.click();
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Solution
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MathHelper;