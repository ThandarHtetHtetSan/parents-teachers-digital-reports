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

