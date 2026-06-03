import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import ExerciseCard from './ExerciseCard';

export default function Dashboard({ 
  exercises, 
  addExercise, 
  editExercise, 
  removeExercise, 
  addSet, 
  editSet, 
  removeSet, 
  finishWorkout,
  onSetAdded
}) {
  const [newExName, setNewExName] = useState('');
  const [category, setCategory] = useState('General');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newExName.trim()) {
      addExercise(newExName.trim(), category);
      setNewExName('');
      setCategory('General');
      setIsAdding(false);
    }
  };

  const handleFinish = () => {
    const defaultName = `Entrenamiento - ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
    const name = prompt("¿Cómo quieres llamar a este entrenamiento?", defaultName);
    
    if (name !== null) {
      finishWorkout(name.trim() || 'Entrenamiento');
    }
  };

  const categories = [
    'General',
    'Pecho',
    'Espalda',
    'Piernas',
    'Hombros',
    'Brazos',
    'Core',
    'Cardio'
  ];

  return (
    <div className="layout-padding flex-col gap-4" style={{ paddingBottom: '120px' }}>
      
      {/* Active Workout Exercises */}
      {exercises.length === 0 && !isAdding && (
         <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
           <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}>💪</div>
           <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>¿Listo para entrenar?</h3>
           <p>Añade un ejercicio para registrar tu entrenamiento de hoy.</p>
         </div>
      )}

      {exercises.map((ex, index) => (
         <div key={ex.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <ExerciseCard 
              exercise={ex} 
              onAddSet={(weight, reps, unit) => {
                addSet(ex.id, weight, reps, unit);
                if (onSetAdded) onSetAdded(90); // trigger 90s rest timer
              }}
              onRemoveSet={(setId) => removeSet(ex.id, setId)}
              onRemove={() => {
                if (confirm(`¿Seguro que deseas eliminar "${ex.name}" y todas sus series?`)) {
                  removeExercise(ex.id);
                }
              }}
              onEditExercise={(newName, newCategory) => editExercise(ex.id, newName, newCategory)}
              onEditSet={(setId, w, r, u) => editSet(ex.id, setId, w, r, u)}
            />
         </div>
      ))}

      {/* Button / Form to Add Exercise */}
      {!isAdding ? (
        <button 
          className="btn btn-primary" 
          onClick={() => setIsAdding(true)}
          style={{ marginTop: '0.5rem' }}
        >
          <Plus size={20} /> Añadir Ejercicio
        </button>
      ) : (
        <form onSubmit={handleAdd} className="glass-card flex-col gap-3 animate-slide-up">
           <h3 style={{ fontSize: '1rem', color: 'white' }}>Nuevo Ejercicio</h3>
           <input 
             type="text" 
             className="input-field" 
             placeholder="Ej. Press de Banca, Sentadillas..." 
             value={newExName}
             onChange={(e) => setNewExName(e.target.value)}
             autoFocus
             required
           />
           
           <div className="flex-col gap-1">
             <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>Grupo Muscular</label>
             <select 
               className="select-styled"
               value={category}
               onChange={(e) => setCategory(e.target.value)}
             >
               {categories.map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
             </select>
           </div>

           <div className="flex-between gap-2" style={{ marginTop: '0.5rem' }}>
             <button type="button" className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }} onClick={() => setIsAdding(false)}>
               Cancelar
             </button>
             <button type="submit" className="btn btn-primary">
               Agregar
             </button>
           </div>
        </form>
      )}
      
      {/* Finish Workout Button */}
      {exercises.length > 0 && (
         <button 
            className="btn animate-slide-up" 
            style={{ 
              marginTop: '1rem', 
              background: 'var(--accent-gradient)', 
              color: 'white',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
            }}
            onClick={handleFinish}
         >
            <Check size={20} /> Terminar y Guardar Entrenamiento
         </button>
      )}
    </div>
  );
}
