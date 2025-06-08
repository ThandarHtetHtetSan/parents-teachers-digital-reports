import mysql.connector

# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="root",
#     database="digital-reports"
# )

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="digital-reports"
    )
