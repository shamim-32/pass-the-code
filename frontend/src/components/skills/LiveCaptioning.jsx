import React, { useState, useRef } from 'react';
import { Mic, MicOff, Upload, Download, Captions } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import Badge from '../ui/Badge';

const LiveCaptioning = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
        setAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
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

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setLoading(true);
    try {
      const base64Audio = await toBase64(audioFile);
      const response = await api.post('/skills/live_caption', {
        audio_base64: base64Audio,
        language: language
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert(error?.response?.data?.message || 'Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Captions className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Live Captioning</h2>
              <p className="text-gray-600">Real-time speech-to-text transcription for lectures and conversations</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">Record Audio</h3>
                <div className="space-y-3">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? 'error' : 'primary'}
                    className="w-full"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">Recording...</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">Upload Audio File</h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    className="w-full"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Choose Audio File
                  </Button>
                  {audioFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {audioFile.name}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {audioFile && (
              <div className="text-center">
                <Button
                  onClick={handleTranscribe}
                  loading={loading}
                  size="lg"
                >
                  <Captions className="h-5 w-5 mr-2" />
                  {loading ? 'Transcribing Audio' : 'Generate Captions'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="success">Transcribed</Badge>
                <h3 className="text-lg font-semibold">Live Captions Generated</h3>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const text = result.text || JSON.stringify(result, null, 2);
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'captions.txt';
                  a.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-4">Transcription Result</h4>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-gray-800 leading-relaxed">
                  {result.text ? (
                    <p className="text-lg">{result.text}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
              
              {result.words && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Word-level Timestamps</h5>
                  <div className="bg-white rounded-lg p-3 border border-green-200 max-h-40 overflow-y-auto">
                    <div className="space-y-1 text-sm">
                      {result.words.map((word, index) => (
                        <span key={index} className="inline-block mr-2 mb-1">
                          <span className="text-gray-800">{word.word}</span>
                          <span className="text-gray-500 text-xs ml-1">
                            ({word.start}s)
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveCaptioning;