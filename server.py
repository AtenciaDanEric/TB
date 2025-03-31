# # C:\xampp\htdocs\TB\.venv\Scripts\activate
# from flask import Flask, request, jsonify
# from flask_cors import CORS  # Import CORS
# #import bcrypt  # For password hashing
# import smtplib
# import random

# from datetime import datetime  # Time
 
# from supabase import create_client, Client
# from flask import Flask, request, jsonify
# from datetime import datetime

# import time
# import requests


# C:\xampp\htdocs\TB\.venv\Scripts\activate
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import random
from datetime import datetime
from supabase import create_client, Client
import time
import requests
import mysql.connector


#current_patient_id = None  # Global variable or store in a cache

# Supabase connection
API_URL = 'https://ocrlmdadtekazfnhmquj.supabase.co'
API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcmxtZGFkdGVrYXpmbmhtcXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTA2MzksImV4cCI6MjA1NzA4NjYzOX0.25bkWBV3v4cyjcA_-dUL8-IK3fSywARfVQ82UsZPelc'
supabase: Client = create_client(API_URL, API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL Connection
import mysql.connector
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tiny_breaths"
)
cursor = db.cursor()

current_patient_id = None  # Global variable or store in a cache

@app.route('/add_patient', methods=['POST'])
def add_patient():
    try:
        data = request.json
        print("Received Data:", data)

        query = """
        INSERT INTO patients (name, sex, dob, gestational_age, gestational_unit, category, birth_weight)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['name'], data['sex'], data['dob'],
            data['gestational_age'], data['gestational_unit'],
            data['category'], data['birth_weight']
        )

        cursor.execute(query, values)
        db.commit()

        return jsonify({"message": "Patient record added successfully!"}), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/get_patients', methods=['GET'])
def get_patients():
    try:
        cursor.execute("SELECT id, name FROM patients ORDER BY id ASC")
        patients = cursor.fetchall()

        patient_list = [{"id": p[0], "name": p[1]} for p in patients]
        return jsonify(patient_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

### 🔹 API to Register or Update Doctor Profile ###
@app.route('/save_doctor', methods=['POST'])
def save_doctor():
    try:
        data = request.json
        doctor_id = data['doctor_id']
        name = data['name']
        license_no = data['license_no']
        department = data['department']
        password = data['password']  # Store password as plain text

        # Check if doctor already exists
        cursor.execute("SELECT id FROM doctors WHERE doctor_id = %s", (doctor_id,))
        existing = cursor.fetchone()

        if existing:
            # Update existing doctor
            query = """
            UPDATE doctors SET name=%s, license_no=%s, department=%s, password=%s WHERE doctor_id=%s
            """
            values = (name, license_no, department, password, doctor_id)
            message = "Doctor profile updated successfully!"
        else:
            # Insert new doctor
            query = """
            INSERT INTO doctors (doctor_id, name, license_no, department, password)
            VALUES (%s, %s, %s, %s, %s)
            """
            values = (doctor_id, name, license_no, department, password)
            message = "Doctor registered successfully!"

        cursor.execute(query, values)
        db.commit()

        return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

### 🔹 API for Doctor Login ###
@app.route('/doctor_login', methods=['POST'])
def doctor_login():
    try:
        data = request.json
        doctor_id = data['doctor_id']
        password = data['password']

        # Retrieve doctor data
        cursor.execute("SELECT password FROM doctors WHERE doctor_id = %s", (doctor_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Doctor ID not found!"}), 404

        stored_password = result[0]

        # Compare plain text password
        if password == stored_password:
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Incorrect password!"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


### 🔹 API to Send OTP to Doctor's Email ###
@app.route('/send_otp', methods=['POST'])
def send_otp():
    try:
        data = request.json
        doctor_id = data['doctor_id']

        # Fetch doctor email
        cursor.execute("SELECT email FROM doctors WHERE doctor_id = %s", (doctor_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Doctor ID not found!"}), 404

        email = result[0]

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))
        otp_storage[doctor_id] = otp  # Store OTP temporarily

        # Email sending configuration
        sender_email = "your_email@gmail.com"  # Change to your email
        sender_password = "your_app_password"  # Use an **app password**
        subject = "Your Password Reset OTP"
        body = f"Your OTP for password reset is: {otp}. It is valid for 5 minutes."

        # Email setup
        message = f"Subject: {subject}\n\n{body}"
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message)
        server.quit()

        return jsonify({"message": "OTP sent successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

### 🔹 API to Verify OTP & Reset Password ###
@app.route('/reset_password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        doctor_id = data['doctor_id']
        otp = data['otp']
        new_password = data['new_password']

        # Check if OTP is correct
        if doctor_id not in otp_storage or otp_storage[doctor_id] != otp:
            return jsonify({"error": "Invalid OTP!"}), 400

        # Hash new password
        #password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Update password in database
       # cursor.execute("UPDATE doctors SET password_hash = %s WHERE doctor_id = %s", (password_hash, doctor_id))
        db.commit()

        # Remove OTP after successful reset
        del otp_storage[doctor_id]

        return jsonify({"message": "Password reset successful!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_patient/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        query = "SELECT id, name, sex, dob, gestational_age, gestational_unit, category, birth_weight FROM patients WHERE id = %s"
        cursor.execute(query, (patient_id,))
        patient = cursor.fetchone()

        if patient:
            patient_data = {
                "id": patient[0],
                "name": patient[1],
                "sex": patient[2],
                "dob": patient[3],
                "gestational_age": patient[4],
                "gestational_unit": patient[5],
                "category": patient[6],
                "birth_weight": patient[7],
            }
            return jsonify(patient_data), 200
        else:
            return jsonify({"error": "Patient not found"}), 404

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500



@app.route('/discharge_patient/<int:patient_id>', methods=['POST'])
def discharge_patient(patient_id):
    cursor = db.cursor()
    query = "UPDATE patients SET status = %s, discharged_at = %s WHERE id = %s"
    
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    values = ("discharged", current_time, patient_id)

    try:
        cursor.execute(query, values)
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify({"message": "Error discharging patient", "error": str(e)}), 500
    finally:
        cursor.close()

    return jsonify({"message": "Patient discharged successfully."})


@app.route('/get_all_patients', methods=['GET'])
def get_all_patients():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM patients WHERE status = 'admitted'")
    patients = cursor.fetchall()
    cursor.close()
    return jsonify(patients)

@app.route('/get_records/<int:patient_id>', methods=['GET'])
def get_records(patient_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT timestamp, stored_count_60s, prediction FROM maintable WHERE patient_id = %s ORDER BY timestamp DESC", (patient_id,))
    records = cursor.fetchall()
    cursor.close()
    return jsonify(records)


@app.route('/get_patients_by_status', methods=['GET'])
def get_patients_by_status():
    try:
        status = request.args.get('status', 'all')
        cursor = db.cursor(dictionary=True)

        if status == 'all':
            cursor.execute("SELECT id, name FROM patients ORDER BY id ASC")
        else:
            cursor.execute("SELECT id, name FROM patients WHERE status = %s ORDER BY id ASC", (status,))
        
        patients = cursor.fetchall()
        cursor.close()
        return jsonify(patients)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/set_current_patient', methods=['POST'])
def set_current_patient():
    global current_patient_id
    data = request.get_json()
    patient_id = data.get("patient_id")

    if not patient_id:
        return jsonify({"error": "Missing patient_id"}), 400

    current_patient_id = patient_id
    return jsonify({"message": f"Patient {patient_id} set as current"}), 200

if __name__ == '__main__':
    from threading import Thread
    from datetime import datetime
    import time

    def sync_loop():
        while True:
            try:
                print("🔄 Running sync task...")
                today_start = datetime.today().strftime('%Y-%m-%d') + " 00:00:00"
                today_end = datetime.today().strftime('%Y-%m-%d') + " 23:59:59"

                response = supabase.table("maintable")\
                    .select("timestamp, stored_count_60s, diagnosis")\
                    .gte("timestamp", today_start)\
                    .lt("timestamp", today_end)\
                    .not_.is_("diagnosis", None)\
                    .execute()

                records = response.data
                print(f"📥 Found {len(records)} records from Supabase")

                cursor = db.cursor()
                inserted = 0

                for record in records:
                    timestamp = record.get("timestamp")
                    rr = record.get("stored_count_60s")
                    diagnosis = record.get("diagnosis")
                    patient_id = 1  # Default/fallback ID

                    if not diagnosis or str(diagnosis).strip() in ("", "null", "None", "0"):
                        continue

                    cursor.execute(
                        "INSERT INTO maintable (timestamp, stored_count_60s, prediction, patient_id) VALUES (%s, %s, %s, %s)",
                        (timestamp, rr, diagnosis, patient_id)
                    )
                    inserted += 1

                db.commit()
                cursor.close()
                print(f"✅ Inserted {inserted} new records into MySQL.")
            except Exception as e:
                print("❌ Sync error:", e)

            time.sleep(30)

    # Start sync thread in background
    Thread(target=sync_loop, daemon=True).start()

    # Run Flask in main thread (this allows CTRL+C to work)
    try:
        app.run(debug=False, use_reloader=False)
    finally:
        print("\n👋 Shutting down gracefully... closing DB.")
        db.close()
