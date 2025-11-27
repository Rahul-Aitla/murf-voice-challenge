import sqlite3
import json
from pathlib import Path

DB_PATH = Path("fraud_cases.db")
JSON_PATH = Path("fraud_cases.json")

def init_db():
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fraud_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL,
            securityIdentifier TEXT,
            cardEnding TEXT,
            case_status TEXT,
            transactionName TEXT,
            transactionTime TEXT,
            transactionCategory TEXT,
            transactionSource TEXT,
            amount TEXT,
            location TEXT,
            securityQuestion TEXT,
            securityAnswer TEXT,
            outcome_note TEXT,
            last_updated TEXT
        )
    ''')

    # Load data from JSON if it exists
    if JSON_PATH.exists():
        with open(JSON_PATH, "r") as f:
            data = json.load(f)
            
        for case in data:
            # Check if user already exists to avoid duplicates on re-run
            cursor.execute("SELECT id FROM fraud_cases WHERE userName = ?", (case.get("userName"),))
            if cursor.fetchone() is None:
                cursor.execute('''
                    INSERT INTO fraud_cases (
                        userName, securityIdentifier, cardEnding, case_status, 
                        transactionName, transactionTime, transactionCategory, 
                        transactionSource, amount, location, securityQuestion, 
                        securityAnswer
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    case.get("userName"),
                    case.get("securityIdentifier"),
                    case.get("cardEnding"),
                    case.get("case"),
                    case.get("transactionName"),
                    case.get("transactionTime"),
                    case.get("transactionCategory"),
                    case.get("transactionSource"),
                    case.get("amount"),
                    case.get("location"),
                    case.get("securityQuestion"),
                    case.get("securityAnswer")
                ))
                print(f"Inserted case for {case.get('userName')}")
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
