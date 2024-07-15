"""
WARNING: This code is an intentionally overcomplicated and impractical implementation
of a timeframe parser. It combines Dijkstra's algorithm with SQL queries in a way that
is NOT recommended for actual use. This is purely for educational purposes to demonstrate
the dangers of overengineering. DO NOT use this as a template for real projects.
"""

import sqlite3
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import re

# Setup in-memory SQLite database
def setup_database():
    conn = sqlite3.connect(':memory:')
    c = conn.cursor()
    c.execute('''CREATE TABLE words
                 (id INTEGER PRIMARY KEY, word TEXT, type TEXT)''')
    c.execute('''CREATE TABLE edges
                 (from_id INTEGER, to_id INTEGER, weight INTEGER)''')
    return conn

conn = setup_database()

# Define timeframe indicators
timeframe_indicators = {'last', 'past', 'previous', 'this', 'current', 'day', 'week', 'month', 'year', 'days', 'weeks', 'months', 'years'}

# Build graph using SQL
def build_graph(words):
    c = conn.cursor()
    for i, word in enumerate(words):
        word_type = 'number' if word.isdigit() else 'indicator' if word in timeframe_indicators else 'other'
        c.execute("INSERT INTO words (id, word, type) VALUES (?, ?, ?)", (i, word, word_type))
    conn.commit()

def add_edges(words):
    c = conn.cursor()
    for i in range(len(words)):
        for j in range(i+1, min(i+5, len(words))):
            c.execute("SELECT type FROM words WHERE id IN (?, ?)", (i, j))
            types = c.fetchall()
            if 'number' in types or 'indicator' in types:
                c.execute("INSERT INTO edges (from_id, to_id, weight) VALUES (?, ?, 1)", (i, j))
                c.execute("INSERT INTO edges (from_id, to_id, weight) VALUES (?, ?, 1)", (j, i))
    conn.commit()

# Dijkstra's algorithm using SQL
def dijkstra_sql(start):
    c = conn.cursor()
    c.execute("CREATE TABLE distances (node_id INTEGER PRIMARY KEY, distance INTEGER, previous_id INTEGER)")
    c.execute("INSERT INTO distances SELECT id, CASE WHEN id = ? THEN 0 ELSE 9999999 END, NULL FROM words", (start,))
    
    while True:
        c.execute("""
            SELECT w.id, d.distance, e.to_id, d2.distance
            FROM words w
            JOIN distances d ON w.id = d.node_id
            JOIN edges e ON w.id = e.from_id
            JOIN distances d2 ON e.to_id = d2.node_id
            WHERE d.distance + e.weight < d2.distance
            ORDER BY d.distance
            LIMIT 1
        """)
        row = c.fetchone()
        if row is None:
            break
        
        current_id, current_distance, neighbor_id, neighbor_distance = row
        new_distance = current_distance + 1
        c.execute("UPDATE distances SET distance = ?, previous_id = ? WHERE node_id = ?", 
                  (new_distance, current_id, neighbor_id))
    
    conn.commit()

# Extract timeframe path using SQL
def extract_timeframe_path_sql():
    c = conn.cursor()
    c.execute("""
        WITH RECURSIVE
        path(id, word, prev_id) AS (
            SELECT d.node_id, w.word, d.previous_id
            FROM distances d
            JOIN words w ON d.node_id = w.id
            WHERE w.type IN ('indicator', 'number')
            ORDER BY d.distance DESC
            LIMIT 1
            UNION ALL
            SELECT d.node_id, w.word, d.previous_id
            FROM path p
            JOIN distances d ON p.prev_id = d.node_id
            JOIN words w ON d.node_id = w.id
            WHERE d.previous_id IS NOT NULL
        )
        SELECT group_concat(word, ' ') FROM path
    """)
    return c.fetchone()[0]

# Timeframe patterns (from previous implementation)
timeframe_patterns = [
    (r'^(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(1)), m.group(2).rstrip('s'))),
    (r'^(last|past)\s+(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(2)), m.group(3).rstrip('s'))),
    (r'^(this|current)\s+(day|week|month|year)$', lambda m: (1, m.group(2))),
    (r'^(last|previous)\s+(day|week|month|year)$', lambda m: (1, m.group(2))),
    (r'^last\s+(\d+)\s+(days?|weeks?|months?|years?)$', lambda m: (int(m.group(1)), m.group(2).rstrip('s')))
]

# Timeframe mapping (from working implementation)
timeframe_mapping = {
    'day': lambda x: timedelta(days=x),
    'week': lambda x: timedelta(weeks=x),
    'month': lambda x: relativedelta(months=x),
    'year': lambda x: relativedelta(years=x)
}

# Main parsing function
def parse_timeframe_dijkstra_sql(timeframe_string: str):
    words = re.sub(r'[^\w\s-]', '', timeframe_string.lower()).split()
    build_graph(words)
    add_edges(words)
    dijkstra_sql(0)
    extracted_timeframe = extract_timeframe_path_sql()
    
    now = datetime.now()
    
    for pattern, handler in timeframe_patterns:
        match = re.match(pattern, extracted_timeframe, re.IGNORECASE)
        if match:
            count, unit = handler(match)
            delta = timeframe_mapping[unit](count)
            end_date = now
            start_date = end_date - delta
            return start_date.date(), end_date.date()
    
    # Default case if no timeframe is found
    return (now - timedelta(days=30)).date(), now.date()

# Example usage
if __name__ == "__main__":
    test_strings = [
        "show me the data for the last 3 weeks please",
        "I need information from 2 months ago",
        "what happened in the past 5 days?",
        "give me this year's report",
        "data from last week"
    ]
    
    for test_string in test_strings:
        result = parse_timeframe_dijkstra_sql(test_string)
        print(f"Input: {test_string}")
        print(f"Output: Start Date: {result[0]}, End Date: {result[1]}")
        print()

    print("WARNING: This implementation is intentionally overcomplicated and inefficient.")
    print("It is NOT recommended for actual use in any project.")