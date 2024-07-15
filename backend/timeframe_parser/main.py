import subprocess, re, sys, logging
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
    
# service code 

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

# parsing 
class TimeframeRequest(BaseModel):
    timeframe: str

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


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

@app.post("/parse_timeframe")
async def parse_timeframe_endpoint(request: TimeframeRequest):
    logger.info(f"Received query: {request.timeframe}")
    start_date, end_date = parse_timeframe(request.timeframe)
    response = {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "original_query": request.timeframe
    }
    logger.info(f"Responding with: {response}")
    return response

@app.get("/")
async def root():
    return {"message": "Welcome to the Timeframe Parser API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)