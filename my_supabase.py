from supabase import create_client
from datetime import datetime
import mysql.connector

# Supabase setup
url = "https://ocrlmdadtekazfnhmquj.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcmxtZGFkdGVrYXpmbmhtcXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTA2MzksImV4cCI6MjA1NzA4NjYzOX0.25bkWBV3v4cyjcA_-dUL8-IK3fSywARfVQ82UsZPelc"
supabase = create_client(url, key)

# MySQL setup
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tiny_breaths"
)
cursor = db.cursor()

# Define today's range
today_start = datetime.today().strftime('%Y-%m-%d') + " 00:00:00"
today_end = datetime.today().strftime('%Y-%m-%d') + " 23:59:59"

# Fetch records with diagnosis today
response = supabase.table("maintable")\
    .select("timestamp, stored_count_60s, diagnosis")\
    .gte("timestamp", today_start)\
    .lt("timestamp", today_end)\
    .not_.is_("diagnosis", None)\
    .execute()

records = response.data
print(f"Found {len(records)} records")

inserted = 0

for record in records:
    timestamp = record.get("timestamp")
    rr = record.get("stored_count_60s")
    diagnosis = record.get("diagnosis")
    patient_id = 1  # default fallback

    if not diagnosis or str(diagnosis).strip() in ("", "null", "None", "0"):
        continue

    cursor.execute(
        "INSERT INTO maintable (timestamp, stored_count_60s, prediction, patient_id) VALUES (%s, %s, %s, %s)",
        (timestamp, rr, diagnosis, patient_id)
    )
    inserted += 1

db.commit()
cursor.close()
print(f"✅ Inserted {inserted} records into MySQL.")
