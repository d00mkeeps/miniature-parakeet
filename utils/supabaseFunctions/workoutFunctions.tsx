import { TrackedExercise } from "@/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient()

export async function uploadWorkout(userId: number, exercises: TrackedExercise[], workoutName: string, workoutDescription: string) {
    try {
      // Insert the workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({ user_id: userId,
          name: workoutName,
          description: workoutDescription
        })
        .select()
        .single()
  
      if (workoutError) throw workoutError
  
      // Insert each exercise
      const exercisePromises = exercises.map((exercise, index) => 
        supabase
          .from('workout_exercises')
          .insert({
            workout_id: workout.id,
            exercise_id: exercise.id,
            exercise_name: exercise.name,
            set_data: JSON.stringify(exercise.sets),
            order_in_workout: index + 1
          })
      )
  
      await Promise.all(exercisePromises)
  
      return workout.id
    } catch (error) {
      console.error('Error uploading workout:', error)
      throw error
    }
  } 