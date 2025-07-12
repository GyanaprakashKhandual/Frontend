'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  Bell,
  Loader2,
  X,
  Volume2,
  VolumeX,
  Zap,
  Heart,
  Star,
  Sparkles
} from 'lucide-react';

// Alert Context and Provider
const AlertContext = React.createContext();

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [globalPosition, setGlobalPosition] = useState('top-right');

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    // Create audio context for sound feedback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different alert types
    const frequencies = {
      success: 880,
      error: 220,
      warning: 440,
      info: 660,
      loading: 330
    };
    
    oscillator.frequency.value = frequencies[type] || 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [soundEnabled]);

  const addAlert = useCallback((alert) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      timestamp: new Date(),
      ...alert
    };
    
    setAlerts(prev => [...prev, newAlert]);
    playSound(alert.type);
    
    // Auto remove after duration
    if (alert.duration !== 0) {
      setTimeout(() => {
        removeAlert(id);
      }, alert.duration || 5000);
    }
    
    return id;
  }, [playSound]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const updateAlert = useCallback((id, updates) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  }, []);

  return (
    <AlertContext.Provider value={{
      alerts,
      addAlert,
      removeAlert,
      clearAll,
      updateAlert,
      soundEnabled,
      setSoundEnabled,
      globalPosition,
      setGlobalPosition
    }}>
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use alerts
const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

// Alert Component
const Alert = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (alert.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (alert.duration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [alert.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(alert.id), 300);
  };

  const getAlertStyles = () => {
    const baseStyles = "relative overflow-hidden backdrop-blur-sm border shadow-lg rounded-xl p-4 mb-3 transition-all duration-300 transform";
    
    const typeStyles = {
      success: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800",
      error: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800",
      warning: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-800",
      info: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800",
      loading: "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-800",
      special: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-800"
    };

    const hoverStyles = isHovered ? "scale-105 shadow-xl" : "";
    const visibilityStyles = isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full";

    return `${baseStyles} ${typeStyles[alert.type] || typeStyles.info} ${hoverStyles} ${visibilityStyles}`;
  };

  const getIcon = () => {
    const iconProps = { size: 24, className: "flex-shrink-0" };
    
    const icons = {
      success: <CheckCircle2 {...iconProps} className="text-green-500" />,
      error: <XCircle {...iconProps} className="text-red-500" />,
      warning: <AlertTriangle {...iconProps} className="text-amber-500" />,
      info: <Info {...iconProps} className="text-blue-500" />,
      loading: <Loader2 {...iconProps} className="text-gray-500 animate-spin" />,
      special: <Sparkles {...iconProps} className="text-purple-500" />
    };

    return icons[alert.type] || icons.info;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={getAlertStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar */}
      {alert.duration > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-xl">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-linear rounded-t-xl"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="relative">
          {getIcon()}
          {alert.type === 'special' && (
            <div className="absolute -top-1 -right-1 animate-pulse">
              <Star size={12} className="text-yellow-400 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm capitalize">
                  {alert.title || alert.type}
                </h4>
                <span className="text-xs opacity-60">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                {alert.message}
              </p>
              
              {alert.actions && (
                <div className="flex gap-2 mt-3">
                  {alert.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => action.onClick()}
                      className="px-3 py-1 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-md text-xs font-medium transition-all duration-200 border border-current border-opacity-20"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white hover:bg-opacity-30 rounded-full transition-all duration-200 ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Special effects for special alerts */}
      {alert.type === 'special' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 animate-bounce">
            <Heart size={12} className="text-pink-400 fill-current" />
          </div>
          <div className="absolute bottom-2 left-2 animate-pulse">
            <Zap size={12} className="text-yellow-400 fill-current" />
          </div>
        </div>
      )}
    </div>
  );
};

// Alert Container
const AlertContainer = () => {
  const { alerts, globalPosition } = useAlert();

  const getPositionStyles = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    };

    return positions[globalPosition] || positions['top-right'];
  };

  if (alerts.length === 0) return null;

  return (
    <div className={`fixed z-50 max-w-sm w-full ${getPositionStyles()}`}>
      {alerts.map(alert => (
        <Alert key={alert.id} alert={alert} onClose={() => {}} />
      ))}
    </div>
  );
};

// Control Panel
const AlertControlPanel = () => {
  const { 
    alerts, 
    clearAll, 
    soundEnabled, 
    setSoundEnabled, 
    globalPosition, 
    setGlobalPosition 
  } = useAlert();

  const positions = [
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Alert Controls</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sound Effects</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-sm">{soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Position</label>
          <select
            value={globalPosition}
            onChange={(e) => setGlobalPosition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {positions.map(pos => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Active Alerts: {alerts.length}</span>
          {alerts.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo Component
const AlertDemo = () => {
  const { addAlert } = useAlert();

  const showAlert = (type, message, options = {}) => {
    return addAlert({
      type,
      message,
      ...options
    });
  };

  const demoAlerts = [
    {
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
      action: () => showAlert('success', 'Operation completed successfully! 🎉')
    },
    {
      type: 'error',
      title: 'Error Alert',
      message: 'Something went wrong. Please try again.',
      action: () => showAlert('error', 'Failed to process your request. Please check your connection.')
    },
    {
      type: 'warning',
      title: 'Warning',
      message: 'Your session will expire in 5 minutes.',
      action: () => showAlert('warning', 'Low disk space detected. Please free up some space.')
    },
    {
      type: 'info',
      title: 'Info',
      message: 'New features are available in the latest update.',
      action: () => showAlert('info', 'System maintenance scheduled for tonight at 2 AM.')
    },
    {
      type: 'loading',
      title: 'Loading',
      message: 'Processing your request...',
      action: () => {
        const loadingId = showAlert('loading', 'Uploading files...', { duration: 0 });
        setTimeout(() => {
          showAlert('success', 'Files uploaded successfully!');
        }, 3000);
      }
    },
    {
      type: 'special',
      title: 'Special',
      message: 'Premium feature unlocked!',
      action: () => showAlert('special', 'Congratulations! You\'ve earned a special badge! ✨', {
        duration: 7000,
        actions: [
          { label: 'View Badge', onClick: () => showAlert('info', 'Badge details coming soon!') },
          { label: 'Share', onClick: () => showAlert('success', 'Badge shared successfully!') }
        ]
      })
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Rich Alert System
          </h1>
          <p className="text-gray-600 text-lg">
            Advanced notification system with sound effects, animations, and rich interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Try Different Alerts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAlerts.map((alert, index) => (
                <button
                  key={index}
                  onClick={alert.action}
                  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      {alert.type === 'success' && <CheckCircle2 size={16} className="text-white" />}
                      {alert.type === 'error' && <XCircle size={16} className="text-white" />}
                      {alert.type === 'warning' && <AlertTriangle size={16} className="text-white" />}
                      {alert.type === 'info' && <Info size={16} className="text-white" />}
                      {alert.type === 'loading' && <Loader2 size={16} className="text-white" />}
                      {alert.type === 'special' && <Sparkles size={16} className="text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">{alert.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
            <AlertControlPanel />
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Sound feedback system</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap size={16} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Smooth animations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star size={16} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Multiple alert types</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Bell size={16} className="text-amber-600" />
              </div>
              <span className="text-sm text-gray-700">Custom actions</span>
            </div>
          </div>
        </div>
      </div>

      <AlertContainer />
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AlertProvider>
      <AlertDemo />
    </AlertProvider>
  );
};

export default App;
