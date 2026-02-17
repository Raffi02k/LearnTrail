from app.db import SessionLocal, engine
from app import models
from app.auth import security

def seed_data():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(models.Course).count() > 0:
        print("Data already exists.")
        return

    print("Seeding data...")

    # Create Test User
    test_user = models.User(
        email="test@example.com",
        name="Test User",
        hashed_password=security.get_password_hash("password123"),
        auth_method="local",
        roles=["admin", "user"]
    )
    db.add(test_user)
    
    # Create Course: Python Hello World
    course = models.Course(
        title="Learn Python 3",
        description="Master the basics of programming in Python, a popular and powerful language.",
        level="Beginner",
        slug="learn-python-3"
    )
    db.add(course)
    db.flush()

    # Module 1: Hello World
    mod1 = models.Module(title="Hello World", order=1, course_id=course.id)
    db.add(mod1)
    db.flush()
    
    # Lesson 1: Welcome
    less1 = models.Lesson(title="Welcome", order=1, module_id=mod1.id)
    db.add(less1)
    db.flush()
    
    # Ex 1: Welcome
    ex1 = models.Exercise(
        title="Welcome",
        order=1,
        lesson_id=less1.id,
        xp_reward=10,
        prompt="""# Welcome
Python is a programming language. Like other languages, it gives us a way to communicate ideas.

Change the string below to say "Hello World!" instead of "Hello Codecademy!".
""",
        starter_code="my_message = \"Hello Codecademy!\"\nprint(my_message)",
        solution_code="my_message = \"Hello World!\"\nprint(my_message)",
        test_code="assert my_message == \"Hello World!\", 'Message should be Hello World!'"
    )
    db.add(ex1)
    
    # Ex 2: Name Error (Simulation)
    ex2 = models.Exercise(
        title="Errors",
        order=2,
        lesson_id=less1.id,
        xp_reward=10,
        prompt="""# Errors
Humans are prone to making mistakes. When we write code, we make a lot of them. 

Run the code to see a NameError. Then fix it by changing `my_nam` to `my_name`.
""",
        starter_code="my_name = \"Codecademy\"\nprint(\"Hello and welcome \" + my_nam + \"!\")",
        solution_code="my_name = \"Codecademy\"\nprint(\"Hello and welcome \" + my_name + \"!\")",
        test_code="assert my_name == \"Codecademy\""
    )
    db.add(ex2)

    # Ex 3: Variables
    ex3 = models.Exercise(
        title="Variables",
        order=3,
        lesson_id=less1.id,
        xp_reward=20,
        prompt="""# Variables
Create a variable called `meal` and assign it the string "Breakfast".
""",
        starter_code="# Create your variable here",
        solution_code="meal = \"Breakfast\"",
        test_code="assert meal == \"Breakfast\""
    )
    db.add(ex3)

    db.commit()
    print("Seeding complete.")
    db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    seed_data()
