from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.auth_helpers import authenticate_user
from utils.parent_helpers import get_parent_dashboard_data
from utils.parent_helpers import get_parent_grades_data
from utils.parent_helpers import get_parent_attendance_data
from utils.common_helpers import get_announcements_by_role

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

@app.route('/parents/dashboard', methods=['GET'])
def parent_dashboard():
    try:
        parent_id = request.args.get('parent_id')
        if not parent_id:
            return jsonify({"success": False, "message": "Parent ID required"}), 400
        
        dashboard_data = get_parent_dashboard_data(parent_id)
        if dashboard_data:
            return jsonify({"success": True, "data": dashboard_data}), 200
        else:
            return jsonify({"success": False, "message": "Parent not found or no data"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/parents/grades', methods=['GET'])
def parent_grades():
    try:
        parent_id = request.args.get('parent_id')
        if not parent_id:
            return jsonify({"success": False, "message": "Parent ID required"}), 400
        
        grades = get_parent_grades_data(parent_id)
        if grades is not None:
            return jsonify({"success": True, "grades": grades}), 200
        else:
            return jsonify({"success": False, "message": "No grades found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/parents/attendance', methods=['GET'])
def parent_attendance():
    try:
        parent_id = request.args.get('parent_id')
        if not parent_id:
            return jsonify({"success": False, "message": "Parent ID required"}), 400

        attendance = get_parent_attendance_data(parent_id)
        if attendance is not None:
            return jsonify({"success": True, "attendance": attendance}), 200
        else:
            return jsonify({"success": False, "message": "No attendance found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/announcements', methods=['GET'])
def announcements():
    try:
        role_name = request.args.get('role_name')
        if not role_name:
            return jsonify({"success": False, "message": "Role Name required"}), 400

        announcements = get_announcements_by_role(role_name)
        if announcements is not None:
            return jsonify({"success": True, "announcements": announcements}), 200
        else:
            return jsonify({"success": False, "message": "No announcements found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)




