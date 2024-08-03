import datetime
import json
from typing import Dict, List

from fastapi import HTTPException
from core.config import settings
from supabase import create_client, Client
from core.logging import logger

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def format_set_data(set_data):
    try:
        parsed_data = json.loads(set_data) if isinstance(set_data, str) else set_data
        
        if not isinstance(parsed_data, list):
            parsed_data = [parsed_data]
        
        formatted_sets = []
        for index, set_info in enumerate(parsed_data, 1):
            set_details = []
            if set_info.get('weight', 0) > 0:
                set_details.append(f"{set_info['weight']} kg")
            if set_info.get('reps', 0) > 0:
                set_details.append(f"{set_info['reps']} reps")
            if set_info.get('duration', 0) > 0:
                set_details.append(f"{set_info['duration']} minutes")
            if set_info.get('distance', 0) > 0:
                set_details.append(f"{set_info['distance']} {set_info.get('unit', 'km')}")
            formatted_sets.append(f"Set {index}: {', '.join(set_details)}")
        return '; '.join(formatted_sets)
    except json.JSONDecodeError:
        return "Invalid set data"
    except Exception as e:
        return f"Error processing set data: {str(e)}"

def format_workout_data(workouts: List[Dict], start_date: datetime, end_date: datetime, original_query: str, training_history: str, goals: str) -> str:
    formatted_output = f"""Original query: {original_query}

User Context:
Training History: {training_history}
Goals: {goals}

Timeframe:
Start Date: {start_date.strftime('%Y-%m-%d')}
End Date: {end_date.strftime('%Y-%m-%d')}

Workouts:
"""
    if not workouts:
        formatted_output += "No workouts found in this timeframe."
    else:
        for workout in workouts:
            workout_date = datetime.fromisoformat(workout['created_at']).strftime('%d/%m/%Y')
            exercises = workout.get('exercises', [])
            formatted_exercises = [
                f"* {exercise.get('exercise_name', 'Unnamed Exercise')}: {exercise.get('formatted_set_data', 'No set data')}"
                for exercise in exercises
            ]
            
            formatted_workout = f"""
Workout: {workout.get('name') or 'Unnamed Workout'}
Date: {workout_date}
Description: {workout.get('description') or 'No description'}
Exercises:
{chr(10).join(formatted_exercises)}
""".strip()
            
            formatted_output += formatted_workout + "\n\n"
    
    return formatted_output.strip()

# Fetch the relevant workouts from supabase

def fetch_workout_data(user_id: int, start_date: datetime, end_date: datetime, original_query: str, training_history: str, goals: str):
    try:
        workouts_response = supabase.table("workouts").select("*").eq("user_id", user_id).gte("created_at", start_date.isoformat()).lte("created_at", end_date.isoformat()).execute()
        
        workout_data = []
        if workouts_response.data:
            for workout in workouts_response.data:
                exercises_response = supabase.table("workout_exercises").select("*").eq("workout_id", workout["id"]).order("order_in_workout").execute()
                
                exercises = exercises_response.data if exercises_response.data else []

                for exercise in exercises:
                    exercise['formatted_set_data'] = format_set_data(exercise.get('set_data', '[]'))

                workout_data.append({
                    "id": workout["id"],
                    "name": workout["name"],
                    "created_at": workout["created_at"],
                    "description": workout["description"],
                    "exercises": exercises
                })

        formatted_output = format_workout_data(workout_data, start_date, end_date, original_query, training_history, goals)

        return formatted_output
    except Exception as e:
        logger.error(f"Error fetching workout data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching workout data: {str(e)}")