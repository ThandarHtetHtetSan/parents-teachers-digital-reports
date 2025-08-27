from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.auth_helpers import authenticate_user
from utils.parent_helpers import get_parent_dashboard_data
from utils.parent_helpers import get_parent_grades_data
from utils.parent_helpers import get_parent_attendance_data
from utils.teacher_helpers import get_teacher_dashboard_data
from utils.teacher_helpers import get_teacher_grades_data
from utils.teacher_helpers import get_teacher_attendance_data
from utils.teacher_helpers import get_teacher_classes_data
from utils.teacher_helpers import get_available_exams
from utils.teacher_helpers import add_teacher_grades
from utils.teacher_helpers import add_teacher_attendance
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

@app.route('/teachers/dashboard', methods=['GET'])
def teacher_dashboard():
    try:
        teacher_id = request.args.get('teacher_id')
        if not teacher_id:
            return jsonify({"success": False, "message": "Teacher ID required"}), 400
        
        dashboard_data = get_teacher_dashboard_data(teacher_id)
        if dashboard_data:
            return jsonify({"success": True, "data": dashboard_data}), 200
        else:
            return jsonify({"success": False, "message": "Teacher not found or no data"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/teachers/grades', methods=['GET'])
def teacher_grades():
    try:
        teacher_id = request.args.get('teacher_id')
        if not teacher_id:
            return jsonify({"success": False, "message": "Teacher ID required"}), 400
        
        grades = get_teacher_grades_data(teacher_id)
        if grades is not None:
            return jsonify({"success": True, "grades": grades}), 200
        else:
            return jsonify({"success": False, "message": "No grades found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/teachers/grades', methods=['POST'])
def add_teacher_grades_route():
    try:
        data = request.get_json()
        teacher_id = data.get('teacher_id')
        grade_data = data.get('grade_data')
        
        if not teacher_id or not grade_data:
            return jsonify({"success": False, "message": "Teacher ID and grade data required"}), 400
        
        result = add_teacher_grades(teacher_id, grade_data)
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/teachers/attendance', methods=['GET'])
def teacher_attendance():
    try:
        teacher_id = request.args.get('teacher_id')
        if not teacher_id:
            return jsonify({"success": False, "message": "Teacher ID required"}), 400

        attendance = get_teacher_attendance_data(teacher_id)
        if attendance is not None:
            return jsonify({"success": True, "attendance": attendance}), 200
        else:
            return jsonify({"success": False, "message": "No attendance found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/teachers/attendance', methods=['POST'])
def add_teacher_attendance_route():
    try:
        data = request.get_json()
        teacher_id = data.get('teacher_id')
        attendance_data = data.get('attendance_data')
        
        if not teacher_id or not attendance_data:
            return jsonify({"success": False, "message": "Teacher ID and attendance data required"}), 400
        
        result = add_teacher_attendance(teacher_id, attendance_data)
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/teachers/classes', methods=['GET'])
def teacher_classes():
    try:
        teacher_id = request.args.get('teacher_id')
        if not teacher_id:
            return jsonify({"success": False, "message": "Teacher ID required"}), 400

        classes = get_teacher_classes_data(teacher_id)
        if classes is not None:
            return jsonify({"success": True, "classes": classes}), 200
        else:
            return jsonify({"success": False, "message": "No classes found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/exams', methods=['GET'])
def exams():
    try:
        exams = get_available_exams()
        if exams is not None:
            return jsonify({"success": True, "exams": exams}), 200
        else:
            return jsonify({"success": False, "message": "No exams found"}), 404
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




