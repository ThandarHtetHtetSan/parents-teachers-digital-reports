from db_config import get_db_connection

def get_teacher_dashboard_data(teacher_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    try:
        # 1. Get teacher details
        cursor.execute("""
            SELECT id, full_name, email
            FROM users
            WHERE id = %s AND role_id = 3
        """, (teacher_id,))
        teacher = cursor.fetchone()
        if not teacher:
            return None
        
        # 2. Get classes and subjects assigned to this teacher
        cursor.execute("""
            SELECT DISTINCT c.id AS class_id, c.name AS class_name, 
                   s.name AS subject_name, s.id AS subject_id,
                   COUNT(st.id) AS total_students
            FROM teachers_subjects ts
            JOIN classes c ON ts.class_id = c.id
            JOIN subjects s ON ts.subject_id = s.id
            LEFT JOIN students st ON st.class_id = c.id
            WHERE ts.teacher_id = %s
            GROUP BY c.id, c.name, s.name, s.id
        """, (teacher_id,))
        classes = cursor.fetchall()
        
        if not classes:
            return {
                "teacher": teacher,
                "classes": [],
                "announcements": []
            }
        
        # 3. Get attendance data for each class-subject combination (latest month)
        class_attendance = {}
        for cls in classes:
            cursor.execute("""
                SELECT 
                    SUM(a.present_count) AS present_days,
                    SUM(a.absent_count) AS absent_days,
                    (SUM(a.present_count) / (SUM(a.present_count) + SUM(a.absent_count))) * 100 AS percentage,
                    a.month, a.year
                FROM attendance a
                JOIN teachers_subjects ts ON a.teacher_subject_id = ts.id
                JOIN students s ON a.student_id = s.id
                WHERE ts.teacher_id = %s AND ts.class_id = %s AND ts.subject_id = %s
                AND (a.year, a.month) = (
                    SELECT MAX(year), MAX(month)
                    FROM attendance a2
                    JOIN teachers_subjects ts2 ON a2.teacher_subject_id = ts2.id
                    WHERE ts2.teacher_id = %s AND ts2.class_id = %s AND ts2.subject_id = %s
                )
                GROUP BY a.month, a.year
            """, (teacher_id, cls['class_id'], cls['subject_id'], teacher_id, cls['class_id'], cls['subject_id']))
            
            attendance_data = cursor.fetchone()
            if attendance_data:
                key = f"{cls['class_id']}_{cls['subject_id']}"
                class_attendance[key] = {
                    "present_days": attendance_data['present_days'],
                    "absent_days": attendance_data['absent_days'],
                    "percentage": float(attendance_data['percentage']) if attendance_data['percentage'] else 0.0,
                    "month": attendance_data['month'],
                    "year": attendance_data['year']
                }
        
        # 4. Get latest exam grades for each class-subject combination
        class_grades = {}
        for cls in classes:
            cursor.execute("""
                SELECT 
                    e.name AS exam_name,
                    g.score,
                    g.letter_grade,
                    e.id AS exam_id
                FROM grades g
                JOIN students s ON g.student_id = s.id
                JOIN exams e ON g.exam_id = e.id
                WHERE s.class_id = %s AND g.subject_id = %s AND g.teacher_id = %s
                AND g.exam_id = (
                    SELECT exam_id FROM grades g2
                    JOIN students s2 ON g2.student_id = s2.id
                    JOIN exams e2 ON g2.exam_id = e2.id
                    WHERE s2.class_id = %s AND g2.subject_id = %s AND g2.teacher_id = %s
                    ORDER BY e2.id DESC LIMIT 1
                )
                LIMIT 3
            """, (cls['class_id'], cls['subject_id'], teacher_id, cls['class_id'], cls['subject_id'], teacher_id))
            
            grades_data = cursor.fetchall()
            if grades_data:
                key = f"{cls['class_id']}_{cls['subject_id']}"
                class_grades[key] = [
                    {
                        "exam_name": grade['exam_name'],
                        "score": float(grade['score']) if grade['score'] else 0.0,
                        "letter_grade": grade['letter_grade'],
                        "exam_id": grade['exam_id']
                    }
                    for grade in grades_data
                ]
        
        # 5. Get recent announcements for teachers
        cursor.execute("""
            SELECT title, body, created_at
            FROM announcements
            WHERE target_role_id = 3  -- Teacher role
            ORDER BY created_at DESC
            LIMIT 5
        """)
        announcements = cursor.fetchall()
        
        # 6. Compile class data
        classes_data = []
        for cls in classes:
            key = f"{cls['class_id']}_{cls['subject_id']}"
            classes_data.append({
                "class_id": cls['class_id'],
                "class_name": cls['class_name'],
                "subject_name": cls['subject_name'],
                "subject_id": cls['subject_id'],
                "total_students": cls['total_students'],
                "attendance": class_attendance.get(key),
                "recent_grades": class_grades.get(key, [])
            })
        
        return {
            "teacher": {
                "id": teacher['id'],
                "name": teacher['full_name'],
                "email": teacher['email']
            },
            "classes": classes_data,
            "announcements": announcements
        }
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error in get_teacher_dashboard_data: {str(e)}")
        return None
    finally:
        cursor.close()
        db.close()

def get_teacher_grades_data(teacher_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get all grades for this teacher
        query = """
            SELECT
                g.id,
                st.name AS student_name,
                c.name AS class_name,
                s.name AS subject_name,
                e.name AS exam_name,
                g.score,
                g.letter_grade,
                g.remarks,
                g.year,
                e.id AS exam_id
            FROM grades g
            JOIN students st ON g.student_id = st.id
            JOIN classes c ON st.class_id = c.id
            JOIN subjects s ON g.subject_id = s.id
            JOIN exams e ON g.exam_id = e.id
            WHERE g.teacher_id = %s
            ORDER BY g.year DESC, g.id DESC, st.name
        """
        cursor.execute(query, (teacher_id,))
        grades = cursor.fetchall()
        return grades
    except Exception as e:
        print(f"Error in get_teacher_grades_data: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

def get_teacher_attendance_data(teacher_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get attendance records for all students taught by this teacher
        query = """
            SELECT
                a.id,
                st.name AS student_name,
                c.name AS class_name,
                s.name AS subject_name,
                a.month,
                a.year,
                a.present_count,
                a.absent_count,
                (a.present_count + a.absent_count) AS total_count,
                ROUND((a.present_count / (a.present_count + a.absent_count)) * 100, 2) AS percentage,
                CONCAT(a.year, '-', LPAD(a.month, 2, '0'), '-01') AS date
            FROM attendance a
            JOIN students st ON a.student_id = st.id
            JOIN classes c ON st.class_id = c.id
            JOIN teachers_subjects ts ON a.teacher_subject_id = ts.id
            JOIN subjects s ON ts.subject_id = s.id
            WHERE ts.teacher_id = %s
            ORDER BY a.id DESC
        """
        cursor.execute(query, (teacher_id,))
        records = cursor.fetchall()
        return records
    except Exception as e:
        print(f"Error in get_teacher_attendance_data: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

def get_teacher_classes_data(teacher_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get all classes, subjects, and their students for this teacher
        cursor.execute("""
            SELECT 
                c.id AS class_id,
                c.name AS class_name,
                s.name AS subject_name,
                s.id AS subject_id,
                st.id AS student_id,
                st.name AS student_name,
                st.student_code,
                u.full_name AS parent_name,
                u.email AS parent_email
            FROM teachers_subjects ts
            JOIN classes c ON ts.class_id = c.id
            JOIN subjects s ON ts.subject_id = s.id
            LEFT JOIN students st ON st.class_id = c.id
            LEFT JOIN users u ON st.user_id = u.id
            WHERE ts.teacher_id = %s
            ORDER BY c.name, s.name, st.name
        """, (teacher_id,))
        
        records = cursor.fetchall()
        
        # Group by class and subject
        classes_data = {}
        for record in records:
            key = f"{record['class_id']}_{record['subject_id']}"
            if key not in classes_data:
                classes_data[key] = {
                    "class_id": record['class_id'],
                    "class_name": record['class_name'],
                    "subject_name": record['subject_name'],
                    "subject_id": record['subject_id'],
                    "students": []
                }
            
            if record['student_id']:  # Only add if student exists
                classes_data[key]["students"].append({
                    "student_id": record['student_id'],
                    "student_name": record['student_name'],
                    "student_code": record['student_code'],
                    "parent_name": record['parent_name'],
                    "parent_email": record['parent_email']
                })
        
        return list(classes_data.values())
    except Exception as e:
        print(f"Error in get_teacher_classes_data: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

def get_available_exams():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Get all available exams
        cursor.execute("""
            SELECT id, name
            FROM exams
            ORDER BY name
        """)
        exams = cursor.fetchall()
        return exams
    except Exception as e:
        print(f"Error in get_available_exams: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()

def add_teacher_grades(teacher_id, grade_data):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Extract data from grade_data
        class_name = grade_data['selectedClass'].split(' - ')[0]
        subject_name = grade_data['selectedClass'].split(' - ')[1]
        exam_name = grade_data['selectedExam']
        year = grade_data['selectedYear']
        grades = grade_data['grades']
        
        # Get class_id and subject_id
        cursor.execute("""
            SELECT c.id AS class_id, s.id AS subject_id
            FROM classes c
            JOIN subjects s ON s.name = %s
            WHERE c.name = %s
        """, (subject_name, class_name))
        class_subject = cursor.fetchone()
        
        if not class_subject:
            return {"success": False, "message": "Class or subject not found"}
        
        # Get exam_id
        cursor.execute("SELECT id FROM exams WHERE name = %s", (exam_name,))
        exam = cursor.fetchone()
        
        if not exam:
            return {"success": False, "message": "Exam not found"}
        
        # Insert grades for each student
        inserted_count = 0
        for student_id, grade_info in grades.items():
            if grade_info.get('score') and grade_info.get('grade'):
                cursor.execute("""
                    INSERT INTO grades (student_id, subject_id, teacher_id, exam_id, year, score, letter_grade, remarks)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    student_id,
                    class_subject['subject_id'],
                    teacher_id,
                    exam['id'],
                    year,
                    grade_info['score'],
                    grade_info['grade'],
                    grade_info.get('remark', '')
                ))
                inserted_count += 1
        
        db.commit()
        return {"success": True, "message": f"Successfully added {inserted_count} grades"}
        
    except Exception as e:
        db.rollback()
        print(f"Error in add_teacher_grades: {str(e)}")
        return {"success": False, "message": str(e)}
    finally:
        cursor.close()
        db.close()

def add_teacher_attendance(teacher_id, attendance_data):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Extract data from attendance_data
        class_name = attendance_data['selectedClass'].split(' - ')[0]
        subject_name = attendance_data['selectedClass'].split(' - ')[1]
        month = attendance_data['selectedMonth']
        year = attendance_data['selectedYear']
        attendance_records = attendance_data['attendance']
        
        # Get teacher_subject_id
        cursor.execute("""
            SELECT ts.id AS teacher_subject_id
            FROM teachers_subjects ts
            JOIN classes c ON ts.class_id = c.id
            JOIN subjects s ON ts.subject_id = s.id
            WHERE ts.teacher_id = %s AND c.name = %s AND s.name = %s
        """, (teacher_id, class_name, subject_name))
        teacher_subject = cursor.fetchone()
        
        if not teacher_subject:
            return {"success": False, "message": "Class or subject not found for this teacher"}
        
        # Insert attendance for each student
        inserted_count = 0
        for student_id, attendance_info in attendance_records.items():
            if attendance_info.get('present_days') is not None and attendance_info.get('absent_days') is not None:
                present_days = int(attendance_info['present_days'])
                absent_days = int(attendance_info['absent_days'])
                total_days = present_days + absent_days
                percentage = round((present_days / total_days) * 100, 2) if total_days > 0 else 0
                
                # Determine remarks based on percentage
                if percentage >= 95:
                    remarks = "Excellent attendance"
                elif percentage >= 85:
                    remarks = "Good attendance"
                elif percentage >= 75:
                    remarks = "Fair attendance"
                else:
                    remarks = "Needs improvement"
                
                cursor.execute("""
                    INSERT INTO attendance (student_id, teacher_subject_id, month, year, present_count, absent_count, total_count, percentage, remarks)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    student_id,
                    teacher_subject['teacher_subject_id'],
                    month,
                    year,
                    present_days,
                    absent_days,
                    total_days,
                    percentage,
                    remarks
                ))
                inserted_count += 1
        
        db.commit()
        return {"success": True, "message": f"Successfully added {inserted_count} attendance records"}
        
    except Exception as e:
        db.rollback()
        print(f"Error in add_teacher_attendance: {str(e)}")
        return {"success": False, "message": str(e)}
    finally:
        cursor.close()
        db.close()

