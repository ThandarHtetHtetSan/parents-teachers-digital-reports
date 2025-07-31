from db_config import get_db_connection

def get_announcements_by_role(role_name):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        # 1. Get the role_id
        cursor.execute("SELECT id FROM roles WHERE name = %s", (role_name,))
        role = cursor.fetchone()
        if not role:
            return []
        role_id = role['id']

        # 2. Get announcements for this role
        cursor.execute("""
            SELECT 
                id, 
                title, 
                body AS description, 
                created_at AS date
            FROM announcements
            WHERE target_role_id = %s
            ORDER BY created_at DESC
        """, (role_id,))
        announcements = cursor.fetchall()
        return announcements
    except Exception as e:
        print(f"Error in get_announcements_by_role: {str(e)}")
        return []
    finally:
        cursor.close()
        db.close()