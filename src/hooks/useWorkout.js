import { useState, useEffect } from 'react';

export function useWorkout() {
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem('gym-tracker-data');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('gym-tracker-history');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('gym-tracker-data', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('gym-tracker-history', JSON.stringify(history));
  }, [history]);

  const addExercise = (name, category = 'General') => {
    const newEx = { id: Date.now(), name, category, sets: [] };
    setExercises([...exercises, newEx]);
  };

  const editExercise = (exerciseId, newName, newCategory) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { 
          ...ex, 
          name: newName !== undefined ? newName : ex.name,
          category: newCategory !== undefined ? newCategory : ex.category 
        };
      }
      return ex;
    }));
  };

  const removeExercise = (exerciseId) => {
     setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId, weight, reps, unit = 'kg') => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: [...ex.sets, { id: Date.now(), weight, reps, unit }] };
      }
      return ex;
    }));
  };

  const editSet = (exerciseId, setId, newWeight, newReps, newUnit) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              return { 
                ...s, 
                weight: newWeight !== undefined ? parseFloat(newWeight) : s.weight,
                reps: newReps !== undefined ? parseInt(newReps, 10) : s.reps,
                unit: newUnit !== undefined ? newUnit : s.unit
              };
            }
            return s;
          })
        };
      }
      return ex;
    }));
  };
  
  const removeSet = (exerciseId, setId) => {
     setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
     }));
  };
  
  const finishWorkout = (workoutName = 'Entrenamiento') => {
    const hasSets = exercises.some(ex => ex.sets.length > 0);
    if (!hasSets) {
      if (confirm("No has registrado ninguna serie. ¿Terminar el entrenamiento sin guardar?")) {
        setExercises([]);
        return true;
      }
      return false;
    }

    if (confirm("¿Seguro que quieres terminar y guardar el entrenamiento?")) {
      const newWorkout = {
        id: Date.now(),
        date: new Date().toISOString(),
        name: workoutName,
        exercises: exercises.filter(ex => ex.sets.length > 0)
      };
      setHistory([newWorkout, ...history]);
      setExercises([]);
      return true;
    }
    return false;
  };

  const removeHistoryWorkout = (workoutId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este entrenamiento del historial?")) {
      setHistory(history.filter(w => w.id !== workoutId));
    }
  };

  const clearHistory = () => {
    if (confirm("¿Estás seguro de que quieres borrar TODO el historial? Esta acción no se puede deshacer.")) {
      setHistory([]);
    }
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data && (Array.isArray(data.exercises) || Array.isArray(data.history))) {
        if (Array.isArray(data.exercises)) setExercises(data.exercises);
        if (Array.isArray(data.history)) setHistory(data.history);
        return true;
      }
    } catch (e) {
      console.error("Error parsing backup data:", e);
    }
    return false;
  };

  return { 
    exercises, 
    history,
    addExercise, 
    editExercise,
    removeExercise,
    addSet, 
    editSet,
    removeSet, 
    finishWorkout,
    removeHistoryWorkout,
    clearHistory,
    importData
  };
}
