 

# from flask import Flask
# import mysql.connector
# from mysql.connector import Error

# app = Flask(__name__)

# @app.route('/')
# def test_connection():
#     try:
#         # Attempt to connect
#         conn = mysql.connector.connect(
#             host='localhost',
#             user='root',
#             password='root'  # replace with your actual password
#         )
#         if conn.is_connected():
#             return '✅ Connected to MySQL successfully!'
#     except Error as e:
#         return f'❌ Failed to connect to MySQL: {e}'
#     finally:
#         if conn.is_connected():
#             conn.close()

# if __name__ == '__main__':
#     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS AFTER app is defined

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     # Dummy logic (replace with real DB logic)
#     if email == 'test@example.com' and password == '123456':
#         return jsonify({'message': 'Login successful', 'role': 'student'}), 200
#     else:
#         return jsonify({'error': 'Invalid credentials'}), 401

# if __name__ == '__main__':
#     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import mysql.connector

# app = Flask(__name__)
# CORS(app)

# # DB Connection
# db = mysql.connector.connect(
#     host="localhost",
#     user="root",  # or the username you use in MySQL Workbench
#     password="root",  # enter your real MySQL password
#     database="digital-reports"
# )

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     cursor = db.cursor(dictionary=True)
#     query = """
#         SELECT users.id, users.full_name, users.email, roles.name AS role
#         FROM users
#         JOIN roles ON users.role_id = roles.id
#         WHERE users.email = %s AND users.password = %s
#     """
#     cursor.execute(query, (email, password))
#     user = cursor.fetchone()
#     cursor.close()

#     if user:
#         return jsonify({"message": "Login successful", "user": user}), 200
#     else:
#         return jsonify({"error": "Invalid credentials"}), 401

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.auth_helpers import authenticate_user

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"success": False, "message": "Email and password required"}), 400

        user = authenticate_user(email, password)
        if user:
            return jsonify({"success": True, "user": user}), 200
        else:
            return jsonify({"success": False, "message": "Invalid credentials or inactive account"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)




