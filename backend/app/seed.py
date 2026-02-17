from app.db import SessionLocal, engine
from app import models
from app.auth import security

def seed_data(db=None):
    owns_session = False
    if db is None:
        db = SessionLocal()
        owns_session = True

    # Check if data exists
    if db.query(models.Course).count() > 0:
        print("Data already exists.")
        if owns_session:
            db.close()
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
    db.flush()
    
    # --- COURSE 1: Learn Python 3 ---
    course1 = models.Course(
        title="Learn Python 3",
        description="Master the basics of programming in Python, a popular and powerful language.",
        level="Beginner",
        slug="learn-python-3",
        language="Python",
        subject="Code Foundations",
        icon="🐍"
    )
    db.add(course1)
    db.flush()

    mod1 = models.Module(title="Hello World", order=1, course_id=course1.id)
    db.add(mod1)
    db.flush()
    
    less1 = models.Lesson(title="Welcome", order=1, module_id=mod1.id)
    db.add(less1)
    db.flush()
    
    exercises1 = [
        models.Exercise(
            title="Welcome", order=1, lesson_id=less1.id, xp_reward=10,
            prompt="# Welcome\nPython is a programming language. Like other languages, it gives us a way to communicate ideas.\n\nChange the string below to say \"Hello World!\" instead of \"Hello Codecademy!\".",
            starter_code="my_message = \"Hello Codecademy!\"\nprint(my_message)",
            solution_code="my_message = \"Hello World!\"\nprint(my_message)",
            test_code="assert my_message == \"Hello World!\", 'Message should be Hello World!'"
        ),
        models.Exercise(
            title="Errors", order=2, lesson_id=less1.id, xp_reward=10,
            prompt="# Errors\nHumans are prone to making mistakes. When we write code, we make a lot of them. \n\nRun the code to see a NameError. Then fix it by changing `my_nam` to `my_name`.",
            starter_code="my_name = \"Codecademy\"\nprint(\"Hello and welcome \" + my_nam + \"!\")",
            solution_code="my_name = \"Codecademy\"\nprint(\"Hello and welcome \" + my_name + \"!\")",
            test_code="assert my_name == \"Codecademy\""
        ),
        models.Exercise(
            title="Variables", order=3, lesson_id=less1.id, xp_reward=20,
            prompt="# Variables\nCreate a variable called `meal` and assign it the string \"Breakfast\".",
            starter_code="# Create your variable here",
            solution_code="meal = \"Breakfast\"",
            test_code="assert meal == \"Breakfast\""
        )
    ]
    for ex in exercises1: db.add(ex)

    # --- COURSE 2: Learn JavaScript ---
    course2 = models.Course(
        title="Learn JavaScript",
        description="Learn how to use JavaScript — a powerful and flexible programming language for the web.",
        level="Beginner",
        slug="learn-javascript",
        language="JavaScript",
        subject="Web Development",
        icon="💛"
    )
    db.add(course2)
    db.flush()

    mod2 = models.Module(title="Introduction", order=1, course_id=course2.id)
    db.add(mod2)
    db.flush()

    less2 = models.Lesson(title="Getting Started", order=1, module_id=mod2.id)
    db.add(less2)
    db.flush()

    exercises2 = [
        models.Exercise(
            title="Console", order=1, lesson_id=less2.id, xp_reward=10,
            prompt="# Console\nIn JavaScript, the `console.log()` method is used to print text to the console.\n\nUse `console.log()` to print the number 5.",
            starter_code="// Write your code below",
            solution_code="console.log(5);",
            test_code="assert(output.includes('5'))"
        ),
        models.Exercise(
            title="Comments", order=2, lesson_id=less2.id, xp_reward=10,
            prompt="# Comments\nProgramming is often highly collaborative. Use `//` for single line comments.\n\nCreate a comment that says: \"This is a comment\".",
            starter_code="// Your comment here",
            solution_code="// This is a comment",
            test_code="assert(code.includes('// This is a comment'))"
        )
    ]
    for ex in exercises2: db.add(ex)

    # --- COURSE 3: Learn HTML & CSS ---
    course3 = models.Course(
        title="Learn HTML & CSS",
        description="Learn the building blocks of web development: HTML for structure and CSS for styling.",
        level="Beginner",
        slug="learn-html-css",
        language="HTML & CSS",
        subject="Web Design",
        icon="🎨"
    )
    db.add(course3)
    db.flush()

    mod3 = models.Module(title="HTML Basics", order=1, course_id=course3.id)
    db.add(mod3)
    db.flush()

    less3 = models.Lesson(title="Elements", order=1, module_id=mod3.id)
    db.add(less3)
    db.flush()

    exercises3 = [
        models.Exercise(
            title="Skeleton", order=1, lesson_id=less3.id, xp_reward=15,
            prompt="# HTML Elements\nHTML is composed of elements. Most have an opening tag and a closing tag.\n\nCreate an `<h1>` element with the text \"Hello World\".",
            starter_code="<!-- Write your HTML here -->",
            solution_code="<h1>Hello World</h1>",
            test_code="assert('<h1>' in code and '</h1>' in code)"
        )
    ]
    for ex in exercises3: db.add(ex)

    # --- COURSE 4: Learn SQL ---
    course4 = models.Course(
        title="Learn SQL",
        description="Learn how to communicate with databases using SQL (Structured Query Language).",
        level="Beginner",
        slug="learn-sql",
        language="SQL",
        subject="Data Science",
        icon="📊"
    )
    db.add(course4)
    db.flush()

    mod4 = models.Module(title="Queries", order=1, course_id=course4.id)
    db.add(mod4)
    db.flush()

    less4 = models.Lesson(title="Select", order=1, module_id=mod4.id)
    db.add(less4)
    db.flush()

    exercises4 = [
        models.Exercise(
            title="SELECT *", order=1, lesson_id=less4.id, xp_reward=20,
            prompt="# Queries\nSQL is used to query data. The `SELECT` statement handles retrieving data.\n\nSelect everything (`*`) from a table called `celebs`.",
            starter_code="-- Write query here",
            solution_code="SELECT * FROM celebs;",
            test_code="assert('SELECT' in code.upper() and 'FROM' in code.upper())"
        )
    ]
    for ex in exercises4: db.add(ex)

    # --- COURSE 5: Learn Java ---
    course5 = models.Course(
        title="Learn Java",
        description="Learn why Java is one of the most popular and versatile programming languages.",
        level="Beginner",
        slug="learn-java",
        language="Java",
        subject="Computer Science",
        icon="☕"
    )
    db.add(course5)
    db.flush()

    # --- COURSE 6: Learn TypeScript ---
    course6 = models.Course(
        title="Learn TypeScript",
        description="Learn how to use TypeScript — a typed superset of JavaScript that scales.",
        level="Intermediate",
        slug="learn-typescript",
        language="TypeScript",
        subject="Web Development",
        icon="🔷"
    )
    db.add(course6)
    db.flush()

    # --- COURSE 7: Learn React ---
    course7 = models.Course(
        title="Learn React",
        description="Master React — the most popular JavaScript library for building user interfaces.",
        level="Intermediate",
        slug="learn-react",
        language="React",
        subject="Web Development",
        icon="⚛️"
    )
    db.add(course7)
    db.flush()

    # --- COURSE 8: Learn CSS ---
    course8 = models.Course(
        title="Learn CSS",
        description="Master CSS to bring your web designs to life with colors, layouts, and animations.",
        level="Beginner",
        slug="learn-css",
        language="CSS",
        subject="Web Design",
        icon="💅"
    )
    db.add(course8)
    db.flush()

    db.commit()
    print("Seeding complete.")
    if owns_session:
        db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    seed_data()
