from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
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
from utils.principal_helpers import (
    get_principal_dashboard_data,
    get_principal_reports,
    approve_principal_report,
    get_principal_grades,
    get_principal_attendance
)

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
def get_announcements():
    try:
        role_name = request.args.get('role_name')
        if not role_name:
            return jsonify({"success": False, "message": "Role Name required"}), 400
        from db_config import get_db_connection
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        # Get role_id from role_name
        cursor.execute("SELECT id FROM roles WHERE name = %s", (role_name,))
        role_row = cursor.fetchone()
        if not role_row:
            cursor.close()
            db.close()
            return jsonify({"success": True, "announcements": []}), 200
        role_id = role_row['id']
        cursor.execute("""
            SELECT id, title, body, created_by, created_at, target_role_id
            FROM announcements
            WHERE target_role_id = %s
            ORDER BY created_at DESC
        """, (role_id,))
        announcements = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"success": True, "announcements": announcements}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/announcements', methods=['POST'])
def create_announcement():
    try:
        data = request.get_json()
        title = data.get('title')
        body = data.get('body')
        target_role_id = data.get('target_role_id')
        created_by = data.get('created_by')
        from db_config import get_db_connection
        db = get_db_connection()
        cursor = db.cursor()
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            INSERT INTO announcements (title, body, created_by, created_at, target_role_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (title, body, created_by, now, target_role_id))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"success": True, "message": "Announcement created"}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/roles', methods=['GET'])
def get_roles():
    try:
        from db_config import get_db_connection
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM roles ORDER BY id")
        roles = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"success": True, "roles": roles}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/principal/dashboard', methods=['GET'])
def principal_dashboard():
    try:
        dashboard_data = get_principal_dashboard_data()
        if dashboard_data:
            return jsonify({"success": True, "data": dashboard_data}), 200
        else:
            return jsonify({"success": False, "message": "No data available"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/principal/reports', methods=['GET'])
def principal_reports():
    try:
        result = get_principal_reports()
        if result:
            return jsonify({"success": True, "data": result}), 200
        else:
            return jsonify({"success": False, "message": "No data available"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/principal/approve', methods=['POST'])
def principal_approve():
    try:
        data = request.get_json()
        group_key = data.get('group_key')
        
        if not group_key:
            return jsonify({"success": False, "message": "Group key required"}), 400
        
        result = approve_principal_report(group_key)
        if result["success"]:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/principal/grades', methods=['GET'])
def principal_grades():
    try:
        year = request.args.get('year')
        exam = request.args.get('exam')
        if not year or not exam:
            return jsonify({"success": False, "message": "Year and exam required"}), 400
        result = get_principal_grades(year, exam)
        if result:
            return jsonify({"success": True, "students_grades": result}), 200
        else:
            return jsonify({"success": True, "students_grades": []}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/principal/attendance', methods=['GET'])
def principal_attendance():
    try:
        class_name = request.args.get('class')
        subject_name = request.args.get('subject')
        month = request.args.get('month')
        year = request.args.get('year')
        if not class_name or not subject_name or not month or not year:
            return jsonify({"success": False, "message": "All filters required"}), 400
        result = get_principal_attendance(class_name, subject_name, month, year)
        if result:
            return jsonify({"success": True, "attendance_records": result}), 200
        else:
            return jsonify({"success": False, "message": "No data available"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    try:
        from db_config import get_db_connection
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM classes ORDER BY name")
        classes = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"success": True, "classes": classes}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/subjects', methods=['GET'])
def get_subjects():
    try:
        from db_config import get_db_connection
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM subjects ORDER BY name")
        subjects = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"success": True, "subjects": subjects}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)




