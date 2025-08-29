from db_config import get_db_connection
from datetime import datetime

def get_principal_dashboard_data():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get overall statistics
        cursor.execute("SELECT COUNT(*) as total_students FROM students")
        total_students = cursor.fetchone()['total_students']
        
        cursor.execute("SELECT COUNT(*) as total_teachers FROM users WHERE role_id = 3")
        total_teachers = cursor.fetchone()['total_teachers']
        
        cursor.execute("SELECT COUNT(*) as total_classes FROM classes")
        total_classes = cursor.fetchone()['total_classes']
        
        # Calculate average attendance
        cursor.execute("""
            SELECT AVG(percentage) as avg_attendance
            FROM attendance
            WHERE percentage IS NOT NULL
        """)
        avg_attendance_result = cursor.fetchone()
        average_attendance = round(avg_attendance_result['avg_attendance'], 1) if avg_attendance_result['avg_attendance'] else 0
        
        # Calculate average grade (convert letter grades to numeric for calculation)
        cursor.execute("""
            SELECT 
                AVG(CASE 
                    WHEN letter_grade = 'A' THEN 95
                    WHEN letter_grade = 'B' THEN 85
                    WHEN letter_grade = 'C' THEN 75
                    WHEN letter_grade = 'D' THEN 65
                    WHEN letter_grade = 'E' THEN 55
                    WHEN letter_grade = 'F' THEN 45
                    ELSE NULL
                END) as avg_grade_numeric
            FROM grades
            WHERE letter_grade IS NOT NULL
        """)
        avg_grade_result = cursor.fetchone()
        avg_grade_numeric = avg_grade_result['avg_grade_numeric'] if avg_grade_result['avg_grade_numeric'] else 0
        
        # Convert numeric grade back to letter grade
        if avg_grade_numeric >= 90:
            average_grade = 'A'
        elif avg_grade_numeric >= 80:
            average_grade = 'B'
        elif avg_grade_numeric >= 70:
            average_grade = 'C'
        elif avg_grade_numeric >= 60:
            average_grade = 'D'
        elif avg_grade_numeric >= 50:
            average_grade = 'E'
        else:
            average_grade = 'F'
        
        # Get recent reports (from reports table)
        cursor.execute("""
            SELECT 
                r.id,
                c.name as class_name,
                e.name as exam_name,
                r.created_at,
                r.approved_at,
                CASE WHEN r.approved_at IS NOT NULL THEN 'Published' ELSE 'Draft' END as status
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN exams e ON r.exam_id = e.id
            ORDER BY r.created_at DESC
            LIMIT 5
        """)
        recent_reports = cursor.fetchall()
        
        # Get recent announcements
        cursor.execute("""
            SELECT 
                id,
                title,
                body as description,
                created_at,
                target_role_id
            FROM announcements
            ORDER BY created_at DESC
            LIMIT 5
        """)
        recent_announcements = cursor.fetchall()
        
        return {
            "stats": {
                "total_students": total_students,
                "total_teachers": total_teachers,
                "total_classes": total_classes,
                "average_attendance": average_attendance,
                "average_grade": average_grade
            },
            "recent_reports": recent_reports,
            "recent_announcements": recent_announcements
        }
        
    except Exception as e:
        print(f"Error in get_principal_dashboard_data: {str(e)}")
        return None
    finally:
        cursor.close()
        db.close() 

def get_principal_reports():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    # Group grades by subject, teacher, exam, year
    cursor.execute("""
        SELECT g.id as grade_id, g.exam_id, e.name AS exam_name, g.year, g.subject_id, sub.name AS subject_name,
               g.teacher_id, u.full_name AS teacher_name,
               s.id AS student_id, s.name AS student_name, g.score, g.letter_grade
        FROM grades g
        JOIN exams e ON g.exam_id = e.id
        JOIN subjects sub ON g.subject_id = sub.id
        JOIN users u ON g.teacher_id = u.id
        JOIN students s ON g.student_id = s.id
        ORDER BY g.year DESC, g.exam_id DESC, g.subject_id, g.teacher_id
    """)
    grades = cursor.fetchall()
    # Get approved grade_ids from reports
    cursor.execute("SELECT grade_id FROM reports WHERE grade_id IS NOT NULL AND approved_by IS NOT NULL AND approved_at IS NOT NULL")
    approved_grade_ids = set(row['grade_id'] for row in cursor.fetchall())

    group_map = {}
    for g in grades:
        key = f"{g['subject_id']}_{g['teacher_id']}_{g['exam_id']}_{g['year']}"
        if key not in group_map:
            group_map[key] = {
                "groupKey": key,
                "subject_name": g['subject_name'],
                "teacher_name": g['teacher_name'],
                "exam_name": g['exam_name'],
                "year": g['year'],
                "approved": True,  # will be set to False if any grade in group is not approved
                "students": []
            }
        group_map[key]["students"].append({
            "student_id": g["student_id"],
            "student_name": g["student_name"],
            "score": g["score"],
            "letter_grade": g["letter_grade"]
        })
        if g['grade_id'] not in approved_grade_ids:
            group_map[key]["approved"] = False
    grade_groups = list(group_map.values())

    cursor.close()
    db.close()
    return {
        "grade_groups": grade_groups
    }

def approve_principal_report(groupKey):
    db = get_db_connection()
    cursor = db.cursor()
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    principal_id = 2  # You may want to get this from session or request

    try:
        subject_id, teacher_id, exam_id, year = groupKey.split('_')
        cursor.execute("""
            SELECT id, student_id FROM grades
            WHERE subject_id = %s AND teacher_id = %s AND exam_id = %s AND year = %s
        """, (subject_id, teacher_id, exam_id, year))
        grades = cursor.fetchall()
        for g in grades:
            grade_id = g[0]
            student_id = g[1]
            cursor.execute("""
                SELECT id FROM reports WHERE grade_id = %s AND approved_by IS NOT NULL AND approved_at IS NOT NULL
            """, (grade_id,))
            if not cursor.fetchone():
                cursor.execute("""
                    SELECT class_id FROM students WHERE id = %s
                """, (student_id,))
                class_row = cursor.fetchone()
                class_id = class_row[0] if class_row else None
                cursor.execute("""
                    INSERT INTO reports (student_id, grade_id, year, approved_by, approved_at, created_at, class_id, exam_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (student_id, grade_id, year, principal_id, now, now, class_id, exam_id))
        db.commit()
        return {"success": True, "message": "Approved"}
    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}
    finally:
        cursor.close()
        db.close()

def get_principal_grades(year, exam):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    # Get all grades for the given year and exam, join with students, classes, subjects, teachers, exams
    cursor.execute("""
        SELECT 
            g.student_id,
            s.name AS student_name,
            c.name AS class_name,
            g.subject_id,
            sub.name AS subject_name,
            g.teacher_id,
            u.full_name AS teacher_name,
            g.exam_id,
            e.name AS exam_name,
            g.score,
            g.letter_grade
        FROM grades g
        JOIN students s ON g.student_id = s.id
        JOIN classes c ON s.class_id = c.id
        JOIN subjects sub ON g.subject_id = sub.id
        JOIN users u ON g.teacher_id = u.id
        JOIN exams e ON g.exam_id = e.id
        WHERE g.year = %s AND e.name = %s
        ORDER BY s.id, g.subject_id, g.exam_id
    """, (year, exam))
    grades = cursor.fetchall()

    # Group by student
    students = {}
    for g in grades:
        sid = g['student_id']
        if sid not in students:
            students[sid] = {
                "student_id": sid,
                "student_name": g['student_name'],
                "class_name": g['class_name'],
                "grades": []
            }
        students[sid]["grades"].append({
            "subject_name": g['subject_name'],
            "teacher_name": g['teacher_name'],
            "exam_name": g['exam_name'],
            "score": g['score'],
            "letter_grade": g['letter_grade']
        })

    cursor.close()
    db.close()
    return list(students.values())

def get_principal_attendance(class_name, subject_name, month, year):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    # Get class_id and subject_id from names
    cursor.execute("SELECT id FROM classes WHERE name = %s", (class_name,))
    class_row = cursor.fetchone()
    class_id = class_row['id'] if class_row else None

    cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject_name,))
    subject_row = cursor.fetchone()
    subject_id = subject_row['id'] if subject_row else None

    if not class_id or not subject_id:
        cursor.close()
        db.close()
        return []

    # Find teacher_subject_ids for this class and subject
    cursor.execute("""
        SELECT id, teacher_id FROM teachers_subjects
        WHERE class_id = %s AND subject_id = %s
    """, (class_id, subject_id))
    ts_rows = cursor.fetchall()
    teacher_subject_ids = [row['id'] for row in ts_rows]
    teacher_ids = {row['id']: row['teacher_id'] for row in ts_rows}

    if not teacher_subject_ids:
        cursor.close()
        db.close()
        return []

    # Get attendance records for these teacher_subject_ids, month, year
    placeholders = ','.join(['%s'] * len(teacher_subject_ids))
    cursor.execute(f"""
        SELECT a.*, s.name AS student_name, u.full_name AS teacher_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN teachers_subjects ts ON a.teacher_subject_id = ts.id
        JOIN users u ON ts.teacher_id = u.id
        WHERE a.teacher_subject_id IN ({placeholders}) AND a.month = %s AND a.year = %s
        ORDER BY a.student_id
    """, (*teacher_subject_ids, month, year))
    records = cursor.fetchall()

    attendance_records = []
    for r in records:
        attendance_records.append({
            "student_id": r['student_id'],
            "student_name": r['student_name'],
            "present_count": r['present_count'],
            "absent_count": r['absent_count'],
            "total_count": r['total_count'],
            "percentage": float(r['percentage']),
            "remarks": r['remarks'] or "",
            "teacher_name": r['teacher_name']
        })

    cursor.close()
    db.close()
    return attendance_records

