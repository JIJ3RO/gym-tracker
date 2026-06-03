import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Calendar, Dumbbell } from 'lucide-react';

export default function HistoryTab({ history, onRemoveWorkout, onClearAll }) {
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  const getMuscleBadgeClass = (category) => {
    if (!category) return 'badge-general';
    return `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  if (history.length === 0) {
    return (
      <div className="layout-padding flex-col gap-4" style={{ paddingBottom: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginTop: '3rem', marginBottom: '1rem' }}>📅</div>
        <h3>Tu Historial está vacío</h3>
        <p>Aún no tienes entrenamientos guardados. Completa y guarda un entrenamiento para verlo aquí.</p>
      </div>
    );
  }

  return (
    <div className="layout-padding flex-col gap-4" style={{ paddingBottom: '100px' }}>
      <div className="flex-between">
        <h2 style={{ fontSize: '1.25rem' }}>Historial ({history.length})</h2>
        <button 
          onClick={onClearAll} 
          className="btn" 
          style={{ 
            width: 'auto', 
            padding: '0.5rem 1rem', 
            fontSize: '0.85rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            borderRadius: '8px'
          }}
        >
          Borrar todo
        </button>
      </div>

      <div className="flex-col gap-3">
        {history.map((workout) => {
          const isExpanded = !!expandedIds[workout.id];
          const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

          return (
            <div key={workout.id} className="history-workout-card animate-slide-up">
              <div 
                className="history-header" 
                onClick={() => toggleExpand(workout.id)}
              >
                <div className="flex-col gap-1" style={{ flex: 1 }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white' }}>
                    {workout.name || 'Entrenamiento'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {formatDate(workout.date)}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Dumbbell size={12} /> {workout.exercises.length} ejer. ({totalSets} ser.)
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWorkout(workout.id);
                    }} 
                    className="btn-icon" 
                    style={{ 
                      width: '2rem', 
                      height: '2rem', 
                      padding: 0, 
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <Trash2 size={14} color="var(--danger)" />
                  </button>
                  {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
              </div>

              {isExpanded && (
                <div className="history-details">
                  {workout.exercises.map((ex, exIndex) => (
                    <div key={ex.id || exIndex} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
                      <div className="flex-between">
                        <span style={{ fontWeight: '600', color: 'white' }}>{ex.name}</span>
                        <span className={`category-badge ${getMuscleBadgeClass(ex.category)}`}>
                          {ex.category || 'General'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {ex.sets.map((set, setIndex) => (
                          <div 
                            key={set.id || setIndex} 
                            style={{ 
                              background: 'rgba(255,255,255,0.02)', 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: '6px', 
                              fontSize: '0.85rem',
                              border: '1px solid rgba(255,255,255,0.04)',
                              color: 'var(--text-muted)',
                              display: 'flex',
                              gap: '0.5rem'
                            }}
                          >
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{setIndex + 1}</span>
                            <span style={{ color: 'white' }}>{set.weight} {set.unit || 'kg'}</span>
                            <span>×</span>
                            <span style={{ color: 'white' }}>{set.reps} reps</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
