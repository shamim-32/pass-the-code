import {
  ArrowUp,
  BookOpen,
  Calculator,
  Captions,
  Clock,
  Eye,
  Hand,
  Headphones,
  Heart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SkillCard from '../components/SkillCard';
import AudiobookCreator from '../components/skills/AudiobookCreator';
import CommunicationBoard from '../components/skills/CommunicationBoard';
import EmotionCoach from '../components/skills/EmotionCoach';
import ImageDescriber from '../components/skills/ImageDescriber';
import LiveCaptioning from '../components/skills/LiveCaptioning';
import MathHelper from '../components/skills/MathHelper';
import SignLanguageCreator from '../components/skills/SignLanguageCreator';
import SocialStoryCreator from '../components/skills/SocialStoryCreator';
import StorybookCreator from '../components/skills/StorybookCreator';
import Badge from '../components/ui/Badge';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

const Dashboard = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const skills = [
    {
      id: 'storybook',
      title: 'Dyslexic Support',
      description: 'Transform complex text into engaging, easy-to-read storybooks with simple sentences and clear structure.',
      icon: BookOpen,
      category: 'Learning',
      component: StorybookCreator,
    },
    {
      id: 'sign',
      title: 'Deaf Support',
      description: 'Convert text content into comprehensive sign language video scripts with timing and gesture notes.',
      icon: Hand,
      category: 'Communication',
      component: SignLanguageCreator,
    },
    {
      id: 'audiobook',
      title: 'Blind Support',
      description: 'Create high-quality audiobooks with professional narration and clear audio navigation cues.',
      icon: Headphones,
      category: 'Audio',
      component: AudiobookCreator,
    },
    {
      id: 'live_caption',
      title: 'Live Captioning',
      description: 'Real-time speech-to-text transcription for lectures, meetings, and conversations.',
      icon: Captions,
      category: 'Real-time',
      component: LiveCaptioning,
    },
    {
      id: 'social_story',
      title: 'Social Stories',
      description: 'Create personalized social stories to help students with autism navigate social situations.',
      icon: Users,
      category: 'Social',
      component: SocialStoryCreator,
    },
    {
      id: 'describe_image',
      title: 'Image Description',
      description: 'Generate detailed descriptions of images, diagrams, and visual content for blind students.',
      icon: Eye,
      category: 'Visual',
      component: ImageDescriber,
    },
    {
      id: 'math',
      title: 'Math Support',
      description: 'Step-by-step math problem solving with visual explanations for students with dyscalculia.',
      icon: Calculator,
      category: 'Academic',
      component: MathHelper,
    },
    {
      id: 'emotion',
      title: 'Emotion Coaching',
      description: 'Provide emotional support, coping strategies, and mental health guidance for students.',
      icon: Heart,
      category: 'Wellness',
      component: EmotionCoach,
    },
    {
      id: 'comm_board',
      title: 'Communication Board',
      description: 'Generate personalized AAC communication boards for students with speech disorders.',
      icon: MessageSquare,
      category: 'Communication',
      component: CommunicationBoard,
    },
  ];

  const stats = [
    { label: 'Students Helped', value: '2,847', icon: Users, color: 'text-blue-600' },
    { label: 'Content Created', value: '1,293', icon: Sparkles, color: 'text-purple-600' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Avg. Response', value: '2.3s', icon: Clock, color: 'text-orange-600' },
  ];

  const ActiveComponent = activeSkill ? skills.find(s => s.id === activeSkill)?.component : null;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-primary-700 font-medium">AI-Powered Accessibility Assistant</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to <span className="gradient-text">Sohopathi</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform learning content into accessible formats for students with disabilities. 
            Choose a skill below to get started with personalized educational support.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg bg-gray-50 mb-2`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills Grid - Horizontal Layout */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Accessibility Skills
                </h2>
                <p className="text-gray-600 text-lg">
                  Select a skill to create accessible content for students with disabilities
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <SkillCard
                      title={skill.title}
                      description={skill.description}
                      icon={skill.icon}
                      category={skill.category}
                      isActive={activeSkill === skill.id}
                      onClick={() => {
                        setActiveSkill(skill.id);
                        // Auto-scroll to the active skill component
                        setTimeout(() => {
                          const activeSection = document.getElementById('active-skill-section');
                          if (activeSection) {
                            activeSection.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start',
                              inline: 'nearest'
                            });
                          }
                        }, 100);
                      }}
                      className={`w-full h-full transition-all duration-300 ${
                        activeSkill === skill.id 
                          ? 'ring-2 ring-primary-500 shadow-lg scale-105' 
                          : 'hover:scale-105 hover:shadow-md'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Skill Component */}
          {activeSkill && (
            <div id="active-skill-section" className="scroll-mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {(() => {
                      const skill = skills.find(s => s.id === activeSkill);
                      const Icon = skill?.icon;
                      return Icon ? <Icon className="h-6 w-6 text-primary-600" /> : null;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {skills.find(s => s.id === activeSkill)?.title}
                    </h3>
                    <p className="text-gray-600">Create accessible content</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  ← Back to Skills
                </button>
              </div>
              {ActiveComponent ? (
                <div className="animate-fadeIn">
                  <ActiveComponent />
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                      <Sparkles className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Skill Under Development
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                      This accessibility skill is currently being developed and will be available soon.
                    </p>
                    <Badge variant="warning">Coming Soon</Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Default message when no skill is selected */}
          {!activeSkill && (
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="text-center">
                <div className="p-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full inline-block mb-4">
                  <Sparkles className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Create Accessible Content?
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Select any accessibility skill above to begin creating personalized educational content 
                  that supports students with different learning needs and disabilities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </Layout>
  );
};

export default Dashboard;