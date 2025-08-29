from db_config import get_db_connection

def get_admin_dashboard_data():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # Stats
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()['total_users']

        cursor.execute("SELECT COUNT(*) as total_students FROM students")
        total_students = cursor.fetchone()['total_students']

        cursor.execute("SELECT COUNT(*) as total_teachers FROM users WHERE role_id = 3")
        total_teachers = cursor.fetchone()['total_teachers']

        cursor.execute("SELECT COUNT(*) as total_parents FROM users WHERE role_id = 4")
        total_parents = cursor.fetchone()['total_parents']

        cursor.execute("SELECT COUNT(*) as total_principals FROM users WHERE role_id = 2")
        total_principals = cursor.fetchone()['total_principals']

        # Recent users (last 3)
        cursor.execute("""
            SELECT id, full_name, email, role_id, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 3
        """)
        recent_users = cursor.fetchall()
        # Add role name
        cursor.execute("SELECT id, name FROM roles")
        role_map = {int(r['id']): r['name'] for r in cursor.fetchall()}
        for u in recent_users:
            u['role'] = role_map.get(int(u['role_id']), '')

        # Recent students (last 3)
        cursor.execute("""
            SELECT s.id, s.name, s.student_code, s.class_id, c.name as class_name
            FROM students s
            JOIN classes c ON s.class_id = c.id
            ORDER BY s.id DESC
            LIMIT 3
        """)
        recent_students = cursor.fetchall()

        return {
            "stats": {
                "total_users": total_users,
                "total_students": total_students,
                "total_teachers": total_teachers,
                "total_parents": total_parents,
                "total_principals": total_principals
            },
            "recent_users": recent_users,
            "recent_students": recent_students
        }
    except Exception as e:
        print(f"Error in get_admin_dashboard_data: {str(e)}")
        return None
    finally:
        cursor.close()
        db.close()
