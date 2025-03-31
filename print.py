# Only for displaying tables and stuff

import mysql.connector

# Connect to the database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tiny_breaths"
)
cursor = db.cursor()

# Fetch and display all records
cursor.execute("SELECT * FROM patients")
records = cursor.fetchall()

for record in records:
    print(record)

# Close the connection
db.close()
