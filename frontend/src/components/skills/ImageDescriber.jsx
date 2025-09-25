import { Download, Eye, Image as ImageIcon, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import api from '../../api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';

const ImageDescriber = () => {
  const [formData, setFormData] = useState({
    context: 'Educational content',
    detail_level: 'detailed'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const detailLevels = [
    { value: 'brief', label: 'Brief Overview' },
    { value: 'detailed', label: 'Detailed Description' },
    { value: 'comprehensive', label: 'Comprehensive Analysis' },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);
    try {
      const base64Image = await toBase64(imageFile);
      const response = await api.post('/skills/describe_image', {
        image_base64: base64Image,
        context: formData.context,
        detail_level: formData.detail_level
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error describing image:', error);
      alert(error?.response?.data?.message || 'Failed to describe image');
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
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Eye className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Image Description</h2>
              <p className="text-gray-600">Generate detailed descriptions for blind and visually impaired students</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-100 rounded-full inline-block">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Choose Image
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload JPG, PNG, or GIF files
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>

            <Input
              label="Context"
              placeholder="Describe the context (e.g., 'Math diagram', 'Historical photo', 'Science experiment')"
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              description="This helps provide more relevant descriptions"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detail Level
              </label>
              <select
                value={formData.detail_level}
                onChange={(e) => handleInputChange('detail_level', e.target.value)}
                className="input-field"
              >
                {detailLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!imageFile}
              className="w-full"
            >
              <Eye className="h-5 w-5 mr-2" />
              {loading ? 'Analyzing Image' : 'Describe Image'}
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
                <h3 className="text-lg font-semibold">Image Description Ready!</h3>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const text = result.result?.description || result.description || 'No description available';
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'image-description.txt';
                  a.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-indigo-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-4">Image Description</h4>
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="text-gray-800 leading-relaxed">
                  {result.result?.description ? (
                    <p className="whitespace-pre-wrap">{result.result.description}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageDescriber;