import React from 'react';
import { Card, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import { cn } from '../utils/cn';

const SkillCard = ({ 
  title, 
  description, 
  icon: Icon, 
  category,
  isActive = false,
  onClick,
  className 
}) => {
  return (
    <Card 
      hover 
      className={cn(
        'transition-all duration-300 cursor-pointer',
        isActive && 'ring-2 ring-primary-500 bg-primary-50',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'p-3 rounded-xl transition-colors',
            isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
          )}>
            <Icon className="h-6 w-6" />
          </div>
          {category && (
            <Badge variant={isActive ? 'primary' : 'default'} size="sm">
              {category}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Click to use</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-success-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillCard;