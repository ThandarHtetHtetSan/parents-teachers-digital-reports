# from db_config import db

# def get_user_by_email(email):
#     cursor = db.cursor(dictionary=True)
#     cursor.execute("""
#         SELECT users.*, roles.name AS role
#         FROM users
#         JOIN roles ON users.role_id = roles.id
#         WHERE users.email = %s
#     """, (email,))
#     return cursor.fetchone()


# def get_teacher_subjects(teacher_id):
#     cursor = db.cursor(dictionary=True)
#     cursor.execute("""
#         SELECT subject_id, class_id FROM teachers_subjects
#         WHERE teacher_id = %s
#     """, (teacher_id,))
#     return cursor.fetchall()

# def is_teacher_allowed(teacher_id, subject_id, class_id):
#     cursor = db.cursor(dictionary=True)
#     cursor.execute("""
#         SELECT 1 FROM teachers_subjects
#         WHERE teacher_id = %s AND subject_id = %s AND class_id = %s
#     """, (teacher_id, subject_id, class_id))
#     return cursor.fetchone() is not None

from db_config import get_db_connection

def authenticate_user(email, password):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT u.id, u.full_name, u.email, u.password, u.status,
               r.id AS role_id, r.name AS role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = %s AND u.password = %s
    """, (email, password))

    user = cursor.fetchone()
    cursor.close()
    db.close()

    if user and user['status'] == 'active':
        return {
            'id': user['id'],
            'full_name': user['full_name'],
            'email': user['email'],
            'role': user['role_name']
        }
    return None

