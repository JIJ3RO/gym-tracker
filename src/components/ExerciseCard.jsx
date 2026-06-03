import { useState } from 'react';
import { Trash2, Plus, Check, X } from 'lucide-react';

export default function ExerciseCard({ 
  exercise, 
  onAddSet, 
  onRemoveSet, 
  onRemove, 
  onEditExercise, 
  onEditSet 
}) {
  const [unit, setUnit] = useState(() => {
    if (exercise.sets && exercise.sets.length > 0) {
      return exercise.sets[exercise.sets.length - 1].unit || 'kg';
    }
    return 'kg';
  });

  const [weight, setWeight] = useState(() => {
    if (exercise.sets && exercise.sets.length > 0) {
      return exercise.sets[exercise.sets.length - 1].weight.toString();
    }
    return '';
  });

  const [reps, setReps] = useState('');

  // Inline edit exercise name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(exercise.name);

  // Inline edit set state
  const [editingSetId, setEditingSetId] = useState(null);
  const [editWeight, setEditWeight] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editUnit, setEditUnit] = useState('kg');

  const handleAddSet = (e) => {
    e.preventDefault();
    if (weight && reps) {
      onAddSet(parseFloat(weight), parseInt(reps, 10), unit);
      // Keep weight and unit, clear reps for next set
      setReps('');
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onEditExercise(tempName.trim(), exercise.category);
      setIsEditingName(false);
    }
  };

  const startEditSet = (set) => {
    setEditingSetId(set.id);
    setEditWeight(set.weight.toString());
    setEditReps(set.reps.toString());
    setEditUnit(set.unit || 'kg');
  };

  const handleSaveSet = (setId) => {
    if (editWeight && editReps) {
      onEditSet(setId, parseFloat(editWeight), parseInt(editReps, 10), editUnit);
      setEditingSetId(null);
    }
  };

  const getMuscleBadgeClass = (category) => {
    if (!category) return 'badge-general';
    return `badge-${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="glass-card flex-col gap-3">
      {/* Exercise Header */}
      <div className="flex-between">
        <div className="flex-col gap-1" style={{ flex: 1, marginRight: '1rem' }}>
          {isEditingName ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="text" 
                className="editable-input" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') {
                    setTempName(exercise.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
              />
              <button onClick={handleSaveName} className="btn-icon" style={{ width: '2rem', height: '2rem', padding: 0, background: 'rgba(16, 185, 129, 0.1)', border: 'none' }}>
                <Check size={14} color="var(--success)" />
              </button>
              <button 
                onClick={() => {
                  setTempName(exercise.name);
                  setIsEditingName(false);
                }} 
                className="btn-icon" 
                style={{ width: '2rem', height: '2rem', padding: 0, background: 'rgba(239, 68, 68, 0.1)', border: 'none' }}
              >
                <X size={14} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 
                className="editable-text" 
                style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}
                onClick={() => setIsEditingName(true)}
                title="Haz clic para renombrar"
              >
                {exercise.name}
              </h3>
              <span className={`category-badge ${getMuscleBadgeClass(exercise.category)}`}>
                {exercise.category || 'General'}
              </span>
            </div>
          )}
        </div>

        <button 
          className="btn-icon" 
          style={{ width: '2rem', height: '2rem', padding: 0, background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }} 
          onClick={onRemove}
          title="Eliminar ejercicio"
        >
          <Trash2 size={15} color="var(--danger)" />
        </button>
      </div>

      {/* Sets List */}
      {exercise.sets.length > 0 && (
        <div className="flex-col gap-2">
          {exercise.sets.map((set, i) => {
            const isEditingThisSet = editingSetId === set.id;

            return (
              <div 
                key={set.id} 
                className="flex-between" 
                style={{ 
                  background: isEditingThisSet ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.01)', 
                  padding: '0.65rem 0.75rem', 
                  borderRadius: '10px',
                  border: isEditingThisSet ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  transition: 'all 0.2s'
                }}
              >
                {isEditingThisSet ? (
                  /* Formulario de Edición de Serie */
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flex: 1 }}>
                    <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{i + 1}</span>
                    <input 
                      type="number" 
                      step="0.5"
                      className="set-edit-input" 
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      style={{ width: '60px' }}
                      autoFocus
                    />
                    <select 
                      value={editUnit} 
                      onChange={(e) => setEditUnit(e.target.value)}
                      style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '4px', 
                        color: 'white',
                        padding: '0.15rem 0.3rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                    <span style={{ color: 'var(--text-muted)' }}>×</span>
                    <input 
                      type="number" 
                      className="set-edit-input" 
                      value={editReps}
                      onChange={(e) => setEditReps(e.target.value)}
                      style={{ width: '50px' }}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>reps</span>
                  </div>
                ) : (
                  /* Visualización Normal de Serie */
                  <div 
                    style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', flex: 1, cursor: 'pointer' }}
                    onClick={() => startEditSet(set)}
                    title="Haz clic para editar serie"
                  >
                    <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{i + 1}</span>
                    <span style={{ color: 'white', fontWeight: '500' }}>
                      {set.weight} {set.unit || 'kg'}
                    </span>
                    <span>×</span>
                    <span style={{ color: 'white', fontWeight: '500' }}>
                      {set.reps} reps
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {isEditingThisSet ? (
                    <>
                      <button 
                        type="button" 
                        onClick={() => handleSaveSet(set.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingSetId(null)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.15)', cursor: 'pointer' }} 
                      onClick={() => onRemoveSet(set.id)}
                      title="Eliminar serie"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form to Add Set */}
      <form onSubmit={handleAddSet} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
        <input 
          type="number" 
          step="0.5"
          inputMode="decimal"
          className="input-field" 
          placeholder={exercise.sets.length > 0 ? "Peso" : "Peso"} 
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ flex: 1.5, textAlign: 'center', fontSize: '1rem', padding: '0.65rem' }}
          required
        />
        
        {/* Selector de Unidad */}
        <div className="unit-toggle-container" style={{ padding: '1px' }}>
          <button 
            type="button"
            className={`unit-toggle-btn ${unit === 'kg' ? 'active' : ''}`}
            onClick={() => setUnit('kg')}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            kg
          </button>
          <button 
            type="button"
            className={`unit-toggle-btn ${unit === 'lbs' ? 'active' : ''}`}
            onClick={() => setUnit('lbs')}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            lb
          </button>
        </div>

        <input 
          type="number" 
          inputMode="numeric"
          className="input-field" 
          placeholder="Reps" 
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          style={{ flex: 1, textAlign: 'center', fontSize: '1rem', padding: '0.65rem' }}
          required
        />
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ padding: '0 0.8rem', width: 'auto', height: '38px', borderRadius: '8px' }}
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
