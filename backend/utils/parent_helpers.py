from db_config import get_db_connection

def get_parent_dashboard_data(parent_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    try:
        # 1. Get parent details
        cursor.execute("""
            SELECT id, full_name, email
            FROM users
            WHERE id = %s AND role_id = 4
        """, (parent_id,))
        parent = cursor.fetchone()
        if not parent:
            return None
        
        # 2. Get children (students) of this parent
        cursor.execute("""
            SELECT s.id AS student_id, s.name AS student_name, 
                   c.name AS class_name, s.student_code
            FROM students s
            JOIN classes c ON s.class_id = c.id
            WHERE s.user_id = %s
        """, (parent_id,))
        children = cursor.fetchall()
        student_ids = [child['student_id'] for child in children]
        
        if not student_ids:
            return {
                "parent": parent,
                "children": [],
                "announcements": []
            }
        
        # 3. Get attendance data for latest month
        attendance_map = {}
        attendance_placeholders = ','.join(['%s'] * len(student_ids))
        attendance_query = f"""
            SELECT a.student_id, 
                SUM(a.present_count) AS present_days,
                SUM(a.absent_count) AS absent_days,
                (SUM(a.present_count) / (SUM(a.present_count) + SUM(a.absent_count))) * 100 AS percentage,
                a.month, a.year
            FROM attendance a
            WHERE a.student_id IN ({attendance_placeholders})
            AND (a.year, a.month) = (
                SELECT MAX(year), MAX(month)
            )
            GROUP BY a.student_id, a.month, a.year
        """
        cursor.execute(attendance_query, student_ids)
        
        for record in cursor.fetchall():
            attendance_map[record['student_id']] = {
                "present_days": record['present_days'],
                "absent_days": record['absent_days'],
                "percentage": float(record['percentage']) if record['percentage'] else 0.0,
                "month": record['month'],
                "year": record['year']
            }
        
        # 4. Get latest exam grades
        grades_map = {}
        grades_placeholders = ','.join(['%s'] * len(student_ids))
        grades_query = f"""
            SELECT g.student_id, e.name AS exam_name, 
                   s.name AS subject_name, g.score
            FROM grades g
            JOIN exams e ON g.exam_id = e.id
            JOIN subjects s ON g.subject_id = s.id
            WHERE g.student_id IN ({grades_placeholders})
                AND g.exam_id = (
                    SELECT exam_id FROM grades g2
                    JOIN exams e2 ON g2.exam_id = e2.id
                    WHERE g2.student_id = g.student_id
                    ORDER BY e2.id DESC LIMIT 1
                )
        """
        cursor.execute(grades_query, student_ids)
        
        for record in cursor.fetchall():
            student_id = record['student_id']
            if student_id not in grades_map:
                grades_map[student_id] = {
                    "exam_name": record['exam_name'],
                    "subjects": []
                }
            grades_map[student_id]['subjects'].append({
                "subject_name": record['subject_name'],
                "score": float(record['score']) if record['score'] else 0.0
            })
        
        # 5. Get recent announcements for parents
        cursor.execute("""
            SELECT title, body, created_at
            FROM announcements
            WHERE target_role_id = 4  -- Parent role
            ORDER BY created_at DESC
            LIMIT 5
        """)
        announcements = cursor.fetchall()
        
        # 6. Compile children data
        children_data = []
        for child in children:
            student_id = child['student_id']
            children_data.append({
                "student_id": student_id,
                "student_name": child['student_name'],
                "class_name": child['class_name'],
                "student_code": child['student_code'],
                "attendance": attendance_map.get(student_id),
                "latest_exam": grades_map.get(student_id)
            })
        
        return {
            "parent": {
                "id": parent['id'],
                "name": parent['full_name'],
                "email": parent['email']
            },
            "children": children_data,
            "announcements": announcements
        }
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error in get_parent_dashboard_data: {str(e)}")
        return None
    finally:
        cursor.close()
        db.close()

def get_parent_grades_data(parent_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get all students for this parent
        cursor.execute("""
            SELECT id, name FROM students WHERE user_id = %s
        """, (parent_id,))
        students = cursor.fetchall()
        if not students:
            return []

        student_ids = [s['id'] for s in students]
        placeholders = ','.join(['%s'] * len(student_ids))

        # Get all grades for these students
        query = f"""
            SELECT 
                s.name AS student_name,
                e.name AS exam_name,
                sub.name AS subject,
                g.score,
                g.letter_grade,
                g.year
            FROM grades g
            JOIN students s ON g.student_id = s.id
            JOIN exams e ON g.exam_id = e.id
            JOIN subjects sub ON g.subject_id = sub.id
            WHERE g.student_id IN ({placeholders})
            ORDER BY g.year DESC, e.name, sub.name
        """
        cursor.execute(query, student_ids)
        grades = cursor.fetchall()
        print(f"Grades fetched for parent {parent_id}: {grades}")
        return grades
    except Exception as e:
        print(f"Error in get_parent_grades_data: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

def get_parent_attendance_data(parent_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get all students for this parent
        cursor.execute("SELECT id, name FROM students WHERE user_id = %s", (parent_id,))
        students = cursor.fetchall()
        if not students:
            return []

        student_ids = [s['id'] for s in students]
        placeholders = ','.join(['%s'] * len(student_ids))

        # Get attendance records for all students
        query = f"""
            SELECT
                a.id,
                s.name AS student_name,
                a.month,
                a.year,
                a.present_count,
                a.absent_count,
                (a.present_count + a.absent_count) AS total_count,
                ROUND((a.present_count / (a.present_count + a.absent_count)) * 100, 2) AS percentage,
                CONCAT(a.year, '-', LPAD(a.month, 2, '0'), '-01') AS date
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.student_id IN ({placeholders})
            ORDER BY a.year DESC, a.month DESC
        """
        cursor.execute(query, student_ids)
        records = cursor.fetchall()
        return records
    except Exception as e:
        print(f"Error in get_parent_attendance_data: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

