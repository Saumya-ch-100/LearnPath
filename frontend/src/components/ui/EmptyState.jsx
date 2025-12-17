import { Plus } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10'
}) => (
  <Card className="text-center py-20">
    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${iconBg} mb-6`}>
      <Icon className={iconColor} size={40} strokeWidth={2} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
    {actionLabel && (
      <Button onClick={onAction} className="gap-2">
        <Plus size={20} />
        {actionLabel}
      </Button>
    )}
  </Card>
);

export default EmptyState;
