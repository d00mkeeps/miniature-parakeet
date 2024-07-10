import React from 'react'
import { useUserExercises } from '@/hooks/useUserExercises'
import Select from 'react-select'

interface ExerciseSelectFieldProps {
    onExerciseSelect: (exerciseId: number|null) => void
}

const ExerciseSelectField: React.FC<ExerciseSelectFieldProps> = ({ onExerciseSelect}) => {
    const {exercises, loading, error} = useUserExercises()

    if (loading) return <div>Loading exercises...</div>
    if (error) return <div>Error loading exercises: {error.message}</div>

    const options = exercises.map(exercise => ({
        value: exercise.id,
        label: exercise.name,
        isTamplate: exercise.is_template,
        description: exercise.description,
    }))

    return (
        <Select
        options={options}
        onChange={(selectedOption) => onExerciseSelect(selectedOption ? selectedOption.value : null)}
        placeholder='Select an exercise'
        isClearable
        isSearchable
        />
    )
}

export default ExerciseSelectField