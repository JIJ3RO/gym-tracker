import { useState } from 'react';
import { Dumbbell, Calendar, BarChart3 } from 'lucide-react';
import { useWorkout } from './hooks/useWorkout';
import Dashboard from './components/Dashboard';
import HistoryTab from './components/HistoryTab';
import StatsTab from './components/StatsTab';
import RestTimer from './components/RestTimer';

function App() {
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'history' | 'stats'
  const workoutState = useWorkout();

  // Rest Timer State
  const [restDuration, setRestDuration] = useState(0);
  const [timerTrigger, setTimerTrigger] = useState(0);

  const triggerRestTimer = (secs) => {
    setRestDuration(secs);
    setTimerTrigger(prev => prev + 1);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'history':
        return 'Historial';
      case 'stats':
        return 'Progreso';
      case 'workout':
      default:
        return 'Gym Tracker';
    }
  };

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '8px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
          }}>
            <Dumbbell size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{getHeaderTitle()}</h1>
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 135px)' }}>
        {activeTab === 'workout' && (
          <Dashboard 
            {...workoutState} 
            onSetAdded={triggerRestTimer} 
          />
        )}
        
        {activeTab === 'history' && (
          <HistoryTab 
            history={workoutState.history} 
            onRemoveWorkout={workoutState.removeHistoryWorkout}
            onClearAll={workoutState.clearHistory}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab 
            history={workoutState.history} 
          />
        )}
      </main>

      {/* Floating Rest Timer */}
      {restDuration > 0 && (
        <RestTimer 
          key={timerTrigger}
          duration={restDuration} 
          onClose={() => setRestDuration(0)} 
        />
      )}

      {/* Bottom Navigation Menu */}
      <nav className="bottom-nav">
        <button 
          className={`bottom-nav-item ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <Dumbbell size={20} />
          <span>Entrenar</span>
        </button>

        <button 
          className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Calendar size={20} />
          <span>Historial</span>
        </button>

        <button 
          className={`bottom-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={20} />
          <span>Progreso</span>
        </button>
      </nav>
    </>
  );
}

export default App;
