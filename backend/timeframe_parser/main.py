import subprocess, re, sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

# install requirements

def install_requirements():
    try:
        subprocess.check_call([sys.executable,  "-m", "pip", "install", "-r","requirements.txt", "-q"])
        print("Requirements installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        sys.exit(1)

if __name__ == "__main__":
    install_requirements()
    
# parser code 

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

class TimeframeRequest(BaseModel):
    timeframe: str


def parse_timeframe(timeframe_string: str):
    now = datetime.now()
    
    # Handle "last" or "past" prefix
    timeframe_string = timeframe_string.lower().replace('last', '').replace('past', '').strip()
    
    # Extract number and unit from the string
    match = re.match(r'(\d+)\s+(\w+)', timeframe_string)
    if match:
        number, unit = match.groups()
        number = int(number)
    else:
        return None, None  # Invalid input
    
    # Calculate start and end dates based on the unit
    if unit in ['day', 'days']:
        start_date = now - timedelta(days=number)
    elif unit in ['week', 'weeks']:
        start_date = now - timedelta(weeks=number)
    elif unit in ['month', 'months']:
        start_date = now - relativedelta(months=number)
    elif unit in ['year', 'years']:
        start_date = now - relativedelta(years=number)
    else:
        return None, None  # Invalid unit
    
    return start_date.date(), now.date()

        
@app.get('/')
async def root():
    return {'message': 'Welcome to the Timeframe Parser API'}

@app.post("/parse_timeframe")
async def parse_timeframe_endpoint(request: TimeframeRequest):
    start_date, end_date = parse_timeframe(request.timeframe)
    if start_date is None or end_date is None:
        raise HTTPException(status_code=400, detail="Invalid timeframe format")
    return {"start_date": start_date.isoformat(), "end_date": end_date.isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)