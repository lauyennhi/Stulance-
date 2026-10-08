import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryText,
  onSecondaryAction,
}) => {
  return (
    <div className="stulance-card p-10 text-center flex flex-col items-center justify-center border border-[#DCE8F8] bg-white max-w-lg mx-auto my-6">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] flex items-center justify-center text-[#3D7DD8] mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="font-heading font-semibold text-lg text-[#16243D] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#5B6B85] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="px-5 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
            >
              {actionText}
            </button>
          )}
          {secondaryText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-5 py-2.5 bg-[#F5F9FF] hover:bg-[#EAF2FC] text-[#16243D] border border-[#DCE8F8] text-xs font-medium rounded-full transition-colors"
            >
              {secondaryText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
