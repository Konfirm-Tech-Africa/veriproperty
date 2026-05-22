"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2, AlertTriangle } from 'lucide-react';

// Message types
export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Message {
  id: string;
  type: MessageType;
  title?: string;
  content: string;
  duration?: number;
  dismissible?: boolean;
}

interface MessageCenterContextType {
  showMessage: (message: Omit<Message, 'id'>) => void;
  showSuccess: (content: string, title?: string, duration?: number) => void;
  showError: (content: string, title?: string, duration?: number) => void;
  showWarning: (content: string, title?: string, duration?: number) => void;
  showInfo: (content: string, title?: string, duration?: number) => void;
  showLoading: (content: string, title?: string) => void;
  dismissMessage: (id: string) => void;
  dismissAll: () => void;
}

const MessageCenterContext = createContext<MessageCenterContextType | undefined>(undefined);

// Hook to use the message center
export const useMessageCenter = () => {
  const context = useContext(MessageCenterContext);
  if (context === undefined) {
    throw new Error('useMessageCenter must be used within a MessageCenterProvider');
  }
  return context;
};

// Provider component
interface MessageCenterProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxMessages?: number;
}

export const MessageCenterProvider: React.FC<MessageCenterProviderProps> = ({
  children,
  position = 'top-right',
  maxMessages = 5
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showMessage = (message: Omit<Message, 'id'>) => {
    const id = generateId();
    const newMessage: Message = {
      id,
      dismissible: true,
      duration: 2000, // Default 2 seconds
      ...message
    };

    setMessages(prev => {
      const updated = [newMessage, ...prev];
      return updated.slice(0, maxMessages);
    });

    // Auto-dismiss if duration is set
    if (newMessage.duration && newMessage.duration > 0) {
      setTimeout(() => {
        dismissMessage(id);
      }, newMessage.duration);
    }
  };

  const showSuccess = (content: string, title?: string) => {
    showMessage({
      type: 'success',
      title: title || 'Success',
      content,
      duration: 2000
    });
  };

  const showError = (content: string, title?: string, duration?: number) => {
    showMessage({
      type: 'error',
      title: title || 'Error',
      content,
      duration: duration || 5000 // Longer default for errors
    });
  };

  const showWarning = (content: string, title?: string, duration?: number) => {
    showMessage({
      type: 'warning',
      title: title || 'Warning',
      content,
      duration
    });
  };

  const showInfo = (content: string, title?: string, duration?: number) => {
    showMessage({
      type: 'info',
      title: title || 'Information',
      content,
      duration
    });
  };

  const showLoading = (content: string, title?: string) => {
    showMessage({
      type: 'loading',
      title: title || 'Loading',
      content,
      duration: 2000,
      dismissible: false
    });
  };

  const dismissMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  const dismissAll = () => {
    setMessages([]);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMessageStyles = (type: MessageType) => {
    const baseStyles = "bg-white rounded-lg shadow-lg border p-4 min-w-80 max-w-md";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200`;
      case 'error':
        return `${baseStyles} border-red-200`;
      case 'warning':
        return `${baseStyles} border-yellow-200`;
      case 'info':
        return `${baseStyles} border-blue-200`;
      case 'loading':
        return `${baseStyles} border-gray-200`;
      default:
        return `${baseStyles} border-gray-200`;
    }
  };

  return (
    <MessageCenterContext.Provider value={{
      showMessage,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLoading,
      dismissMessage,
      dismissAll
    }}>
      {children}
      
      {/* Message Container */}
      {messages.length > 0 && (
        <div className={`fixed z-50 space-y-3 ${getPositionClasses()}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={getMessageStyles(message.type)}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getMessageIcon(message.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {message.title && (
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {message.title}
                    </h4>
                  )}
                  <p className="text-sm text-gray-700">{message.content}</p>
                </div>
                
                {/* Dismiss Button */}
                {message.dismissible && (
                  <button
                    onClick={() => dismissMessage(message.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MessageCenterContext.Provider>
  );
};

// Standalone Loading Component (for your specific use case)
interface LoadingOverlayProps {
  message?: string;
  show?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Loading...", 
  show = true 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 flex items-center gap-3 shadow-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        <span className="text-gray-700 font-medium">{message}</span>
      </div>
    </div>
  );
};

// Quick action hooks for common scenarios
export const useQuickMessages = () => {
  const messageCenter = useMessageCenter();

  return {
    // Property operations
    propertyListingSuccess: () => 
      messageCenter.showSuccess('Property listed successfully!', 'Success'),
    
    propertyUpdateSuccess: () => 
      messageCenter.showSuccess('Property updated successfully!', 'Success'),
    
    propertyDeleteSuccess: () => 
      messageCenter.showSuccess('Property deleted successfully!', 'Success'),
    
    propertyError: (error: string) => 
      messageCenter.showError(error, 'Property Error'),
    
    // Subscription operations
    subscriptionSuccess: (planName: string) => 
      messageCenter.showSuccess(`Successfully subscribed to ${planName}`, 'Subscription'),
    
    subscriptionError: (error: string) => 
      messageCenter.showError(error, 'Subscription Error'),
    
    // Profile operations
    profileUpdateSuccess: () => 
      messageCenter.showSuccess('Profile updated successfully!', 'Profile'),
    
    profileUpdateError: (error: string) => 
      messageCenter.showError(error, 'Profile Update Error'),
    
    // Generic operations
    operationSuccess: (message: string) => 
      messageCenter.showSuccess(message, 'Success'),
    
    operationError: (message: string) => 
      messageCenter.showError(message, 'Error'),
    
    // Loading states
    startLoading: (message: string = 'Processing...') => 
      messageCenter.showLoading(message, 'Loading'),
    
    stopLoading: () => 
      messageCenter.dismissAll()
  };
};