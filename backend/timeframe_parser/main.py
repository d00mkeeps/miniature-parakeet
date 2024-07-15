import re, logging, os, json
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from supabase import create_client, Client
# remember to install requirements lol

# initialization code
load_dotenv()

supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL or key not found in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

app = FastAPI()

# CORS config

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# logging setup

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# parsing 
class TimeframeRequest(BaseModel):
    timeframe: str
    user_id: int

timeframe_patterns = [
    (r'^(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(1)), m.group(2).rstrip('s'))),
    (r'^(last|past)\s+(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(2)), m.group(3).rstrip('s'))),
    (r'^(this|current)\s+(day|week|month|year)$', lambda m: (1, m.group(2))),
    (r'^(last|previous)\s+(day|week|month|year)$', lambda m: (1, m.group(2))),
    (r'^last\s+(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(1)), m.group(2).rstrip('s')))
]

def extract_timeframe(timeframe_string: str) -> str:
    timeframe_indicators = [
        'last', 'past', 'previous', 'this', 'current',
        'day', 'week', 'month', 'year',
        'days', 'weeks', 'months', 'years'
    ]
    
    # Remove all punctuation except for hyphens
    timeframe_string = re.sub(r'[^\w\s-]', '', timeframe_string)
    
    words = timeframe_string.lower().split()
    
    relevant_words = []
    skip_next = False
    for i, word in enumerate(words):
        if skip_next:
            skip_next = False
            continue
        if word in timeframe_indicators or word.isdigit():
            if word.isdigit() and i + 1 < len(words) and words[i+1].rstrip('s') in ['day', 'week', 'month', 'year']:
                relevant_words.append(word)
                relevant_words.append(words[i+1])
                skip_next = True
            else:
                relevant_words.append(word)
    
    result = ' '.join(relevant_words)
    logger.debug(f"Extracted timeframe: '{result}'")
    return result

timeframe_mapping = {
    'day': lambda x: timedelta(days=x),
    'week': lambda x: timedelta(weeks=x),
    'month': lambda x: relativedelta(months=x),
    'year': lambda x: relativedelta(years=x)
}


def parse_timeframe(timeframe_string: str):
    now = datetime.now()
    logger.debug(f"Current date: {now}")
    
    # Extract relevant timeframe information
    extracted_timeframe = extract_timeframe(timeframe_string)
    logger.debug(f"Extracted timeframe: '{extracted_timeframe}'")
    
    for pattern, handler in timeframe_patterns:
        logger.debug(f"Trying pattern: {pattern}")
        match = re.match(pattern, extracted_timeframe, re.IGNORECASE)
        if match:
            logger.debug(f"Pattern matched: {pattern}")
            count, unit = handler(match)
            logger.debug(f"Count: {count}, Unit: {unit}")
            delta = timeframe_mapping[unit](count)
            logger.debug(f"Calculated delta: {delta}")
            end_date = now
            start_date = end_date - delta
            logger.debug(f"Calculated start_date: {start_date}, end_date: {end_date}")
            return start_date.date(), end_date.date()
    
    # Default case if no timeframe is found
    logger.warning("No matching pattern found, using default timeframe")
    return (now - timedelta(days=30)).date(), now.date()
# workout readability parsing logic

import json

def format_set_data(set_data):
    try:
        # If set_data is a string, parse it. Otherwise, use it as is.
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
def format_workout_data(workouts: List[Dict], start_date: datetime, end_date: datetime, original_query: str) -> str:
    formatted_output = f"""Original query: {original_query}

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


# workout fetching based on timeframes

def fetch_workout_data(user_id: int, start_date: datetime, end_date: datetime, original_query: str):
    try:
        # Fetch workouts
        workouts_response = supabase.table("workouts").select("*").eq("user_id", user_id).gte("created_at", start_date.isoformat()).lte("created_at", end_date.isoformat()).execute()
        
        if not workouts_response.data:
            return format_workout_data([], start_date, end_date, original_query)

        workout_data = []
        for workout in workouts_response.data:
            # Fetch associated exercises for each workout
            exercises_response = supabase.table("workout_exercises").select("*").eq("workout_id", workout["id"]).order("order_in_workout").execute()
            
            exercises = exercises_response.data if exercises_response.data else []

            # Format set data for each exercise
            for exercise in exercises:
                exercise['formatted_set_data'] = format_set_data(exercise.get('set_data', '[]'))

            workout_data.append({
                "id": workout["id"],
                "name": workout["name"],
                "created_at": workout["created_at"],
                "description": workout["description"],
                "exercises": exercises
            })

        return format_workout_data(workout_data, start_date, end_date, original_query)
    except Exception as e:
        logger.error(f"Error fetching workout data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching workout data: {str(e)}")
    
@app.post("/parse_timeframe")
async def parse_timeframe_endpoint(request: TimeframeRequest):
    logger.info(f"Received query: {request.timeframe} for user_id: {request.user_id}")
    
    start_date, end_date = parse_timeframe(request.timeframe)
    
    try:
        formatted_workout_data = fetch_workout_data(request.user_id, start_date, end_date, request.timeframe)
        
        response = {
            "formatted_data": formatted_workout_data
        }
        logger.info(f"Responding with: {response}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing request")

@app.get("/")
async def root():
    return {"message": "Welcome to the Workout Data API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)