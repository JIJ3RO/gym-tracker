import { useState } from 'react';
import { Trophy, Activity, Calendar, Dumbbell, BarChart3 } from 'lucide-react';

export default function StatsTab({ history }) {
  const [preferredUnit, setPreferredUnit] = useState('kg');

  // Convert weight to kg for comparison
  const toKg = (weight, unit) => {
    if (unit === 'lbs') {
      return weight / 2.20462;
    }
    return weight;
  };

  // Convert weight from kg to desired unit
  const fromKg = (weightInKg, unit) => {
    if (unit === 'lbs') {
      return weightInKg * 2.20462;
    }
    return weightInKg;
  };

  // Estimate 1RM (Epley formula)
  const estimate1RM = (weight, reps) => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
  };

  if (history.length === 0) {
    return (
      <div className="layout-padding flex-col gap-4" style={{ paddingBottom: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginTop: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3>Sin Estadísticas Disponibles</h3>
        <p>Completa entrenamientos para ver tu progreso, récords personales (PRs) y estadísticas detalladas.</p>
      </div>
    );
  }

  // Calculate global stats
  const totalWorkouts = history.length;
  let totalSets = 0;
  let totalVolumeKg = 0; // Cumulative volume in kg
  const muscleGroupCounts = {
    Pecho: 0,
    Espalda: 0,
    Piernas: 0,
    Hombros: 0,
    Brazos: 0,
    Core: 0,
    Cardio: 0,
    General: 0
  };

  // Store PRs by exercise name
  // Structure: { [exerciseName]: { maxWeight: 0, maxWeightUnit: 'kg', maxWeightKg: 0, repsForMax: 0, max1RM: 0, max1RMUnit: 'kg', date: '' } }
  const prs = {};

  history.forEach(workout => {
    workout.exercises.forEach(ex => {
      const category = ex.category || 'General';
      
      ex.sets.forEach(set => {
        totalSets += 1;
        
        const setWeightKg = toKg(set.weight, set.unit || 'kg');
        totalVolumeKg += setWeightKg * set.reps;

        // Count muscle groups
        if (muscleGroupCounts[category] !== undefined) {
          muscleGroupCounts[category] += 1;
        } else {
          muscleGroupCounts['General'] += 1;
        }

        // PR calculations
        const exNameNorm = ex.name.trim();
        const oneRMKg = toKg(estimate1RM(set.weight, set.reps), set.unit || 'kg');

        if (!prs[exNameNorm]) {
          prs[exNameNorm] = {
            maxWeight: set.weight,
            maxWeightUnit: set.unit || 'kg',
            maxWeightKg: setWeightKg,
            repsForMax: set.reps,
            max1RMKg: oneRMKg,
            max1RMOriginal: estimate1RM(set.weight, set.reps),
            max1RMUnit: set.unit || 'kg',
            date: workout.date
          };
        } else {
          const currentPR = prs[exNameNorm];
          
          // Check if this set has a higher weight in kg
          if (setWeightKg > currentPR.maxWeightKg) {
            currentPR.maxWeight = set.weight;
            currentPR.maxWeightUnit = set.unit || 'kg';
            currentPR.maxWeightKg = setWeightKg;
            currentPR.repsForMax = set.reps;
            currentPR.date = workout.date;
          }
          
          // Check if this set has a higher estimated 1RM
          if (oneRMKg > currentPR.max1RMKg) {
            currentPR.max1RMKg = oneRMKg;
            currentPR.max1RMOriginal = estimate1RM(set.weight, set.reps);
            currentPR.max1RMUnit = set.unit || 'kg';
          }
        }
      });
    });
  });

  // Calculate muscle group percentages
  const muscleGroupsList = Object.entries(muscleGroupCounts)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalSets > 0 ? (count / totalSets) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);

  const getMuscleColor = (muscle) => {
    const colors = {
      Pecho: 'var(--muscle-pecho)',
      Espalda: 'var(--muscle-espalda)',
      Piernas: 'var(--muscle-piernas)',
      Hombros: 'var(--muscle-hombros)',
      Brazos: 'var(--muscle-brazos)',
      Core: 'var(--muscle-core)',
      Cardio: 'var(--muscle-cardio)',
      General: 'var(--muscle-general)'
    };
    return colors[muscle] || 'var(--muscle-general)';
  };

  const getMuscleBadgeClass = (category) => {
    if (!category) return 'badge-general';
    return `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="layout-padding flex-col gap-4" style={{ paddingBottom: '100px' }}>
      
      {/* Selector de Unidad Preferida para Volumen */}
      <div className="flex-between">
        <h2 style={{ fontSize: '1.25rem' }}>Progreso y Estadísticas</h2>
        <div className="unit-toggle-container">
          <button 
            className={`unit-toggle-btn ${preferredUnit === 'kg' ? 'active' : ''}`}
            onClick={() => setPreferredUnit('kg')}
          >
            KG
          </button>
          <button 
            className={`unit-toggle-btn ${preferredUnit === 'lbs' ? 'active' : ''}`}
            onClick={() => setPreferredUnit('lbs')}
          >
            LBS
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Generales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        <div className="glass-card flex-col gap-1" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} /> Entrenamientos
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>{totalWorkouts}</span>
        </div>

        <div className="glass-card flex-col gap-1" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Dumbbell size={14} /> Series Totales
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>{totalSets}</span>
        </div>

        <div className="glass-card flex-col gap-1" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', gridColumn: 'span 2' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Activity size={14} /> Volumen Total Levantado
          </span>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {preferredUnit === 'kg' 
              ? `${Math.round(totalVolumeKg).toLocaleString()} kg`
              : `${Math.round(totalVolumeKg * 2.20462).toLocaleString()} lbs`
            }
          </span>
        </div>
      </div>

      {/* Distribución de Grupos Musculares */}
      {muscleGroupsList.length > 0 && (
        <div className="glass-card flex-col gap-3">
          <h3 style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={16} color="var(--accent-primary)" /> Distribución de Músculos (Series)
          </h3>
          <div className="flex-col gap-2">
            {muscleGroupsList.map(muscle => (
              <div key={muscle.name} className="flex-col gap-1">
                <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '500', color: 'white' }}>{muscle.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{muscle.count} ser. ({Math.round(muscle.percentage)}%)</span>
                </div>
                <div className="stats-bar-container">
                  <div 
                    className="stats-bar-fill" 
                    style={{ 
                      width: `${muscle.percentage}%`, 
                      background: getMuscleColor(muscle.name) 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Récords Personales (PRs) */}
      <div className="glass-card flex-col gap-3">
        <h3 style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={16} color="gold" /> Récords Personales (PRs)
        </h3>
        
        {Object.keys(prs).length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
            No hay récords registrados aún.
          </p>
        ) : (
          <div className="flex-col gap-2" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {Object.entries(prs).map(([name, data]) => {
              const displayMax1RM = preferredUnit === 'kg'
                ? `${Math.round(fromKg(data.max1RMKg, 'kg'))} kg`
                : `${Math.round(fromKg(data.max1RMKg, 'lbs'))} lbs`;

              return (
                <div 
                  key={name} 
                  style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div className="flex-between">
                    <span style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>{name}</span>
                    <span className={`category-badge ${getMuscleBadgeClass(history.find(w => w.exercises.some(e => e.name === name))?.exercises.find(e => e.name === name)?.category)}`}>
                      {history.find(w => w.exercises.some(e => e.name === name))?.exercises.find(e => e.name === name)?.category || 'General'}
                    </span>
                  </div>
                  
                  <div className="flex-between" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <span>PR Máx:</span>
                      <strong style={{ color: 'white' }}>{data.maxWeight} {data.maxWeightUnit}</strong>
                      <span>× {data.repsForMax} reps</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <span>Est. 1RM:</span>
                      <strong style={{ color: 'var(--success)', marginLeft: '0.25rem' }}>{displayMax1RM}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
