'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import pageStyles from '@/styles/pages.module.css'
import { AddWorkoutModal } from '@/components/program/molecules/AddWorkoutModal'
import atomStyles from '@/styles/atoms.module.css'
import { UserWorkoutsProvider,ProgramWorkout } from '@/context/ProgramWorkoutContext'
import WorkoutSelectField from '@/components/program/molecules/WorkoutSelectField'


export default function EditProgram() {
  const [selectedWorkout, setSelectedWorkout] = useState<ProgramWorkout | null>(null);
  const params = useParams()
  const programId = params.id as string
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleWorkoutAdded = () => {
    console.log('Workout added sucessfully')
  }
  return (
    <UserWorkoutsProvider>
    <div>
      <h1
      className={pageStyles.title}>Edit Program</h1>
      <p>Editing program with ID: {programId}</p>

      <button
      className={atomStyles.buttonPrimary}
      onClick={() => setIsModalOpen(true)}>Add new workout</button>
 <WorkoutSelectField
      onWorkoutSelect={setSelectedWorkout}
      value={selectedWorkout}
    />
      <AddWorkoutModal
        programId={programId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
    </div>
    </UserWorkoutsProvider>
  )
}