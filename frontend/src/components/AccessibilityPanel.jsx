import { Eye, Settings, Type, Volume2, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Modal from './ui/Modal';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  const accessibilityOptions = [
    {
      key: 'highContrast',
      label: 'High Contrast',
      description: 'Increase contrast for better visibility',
      icon: Eye,
    },
    {
      key: 'largeText',
      label: 'Large Text',
      description: 'Increase text size for easier reading',
      icon: Type,
    },
    {
      key: 'dyslexiaFriendly',
      label: 'Dyslexia-Friendly Font',
      description: 'Use fonts designed for dyslexic readers',
      icon: Type,
    },
    {
      key: 'reducedMotion',
      label: 'Reduce Motion',
      description: 'Minimize animations and transitions',
      icon: Zap,
    },
    {
      key: 'screenReader',
      label: 'Screen Reader Mode',
      description: 'Optimize for screen reader compatibility',
      icon: Volume2,
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-white shadow-lg border border-gray-200 hover:shadow-xl"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Accessibility Settings"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Customize your experience to make Sohopathi more accessible for your needs.
          </p>
          
          <div className="space-y-3">
            {accessibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.key} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings[option.key]}
                        onChange={(e) => updateSetting(option.key, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                Object.keys(settings).forEach(key => updateSetting(key, false));
              }}
              className="w-full"
            >
              Reset All Settings
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AccessibilityPanel;