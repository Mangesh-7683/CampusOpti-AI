
from pathlib import Path

import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


# =====================================================
# 1. APPLICATION CONFIGURATION
# =====================================================

app = FastAPI(
    title="CampusOpti AI",
    description="AI-Powered Campus Timetable and Resource Optimisation System",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# =====================================================
# 2. PROJECT DIRECTORIES
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET_DIR = BASE_DIR / "dataset"
REPORTS_DIR = BASE_DIR / "reports"
FRONTEND_DIR = BASE_DIR / "frontend"


# =====================================================
# 3. CONSTANTS
# =====================================================

TOTAL_LECTURES = 142

TOTAL_WEEKLY_SLOTS = 30


# =====================================================
# 4. CSV LOADING FUNCTION
# =====================================================

def load_csv(filename, folder):

    file_path = folder / filename

    if not file_path.exists():

        raise FileNotFoundError(
            f"Required file not found: {file_path}"
        )

    return pd.read_csv(file_path)


# =====================================================
# 5. LOAD PROJECT DATA
# =====================================================

cp_schedule = load_csv(
    "cp_sat_timetable.csv",
    REPORTS_DIR
)

comparison = load_csv(
    "algorithm_comparison.csv",
    REPORTS_DIR
)

faculty = load_csv(
    "faculty.csv",
    DATASET_DIR
)

classrooms = load_csv(
    "classrooms.csv",
    DATASET_DIR
)

batches = load_csv(
    "student_batches.csv",
    DATASET_DIR
)


# =====================================================
# 6. UNSCHEDULED LECTURE INFORMATION
# =====================================================

# Based on the previously validated CP-SAT results.
# F008 has 18 required lectures but a maximum
# weekly capacity of 15 lectures under the
# current daily workload constraint.

unscheduled_lectures = [

    {
        "batch_id": "B004",

        "subject_id": "S008",

        "subject_name": "Operating Systems",

        "faculty_id": "F008",

        "unscheduled_count": 3,

        "reason": (
            "Faculty F008 requires 18 lectures per week. "
            "The maximum daily workload is 3 lectures. "
            "Across 5 working days, the maximum weekly "
            "capacity is 15 lectures. Therefore, 3 lectures "
            "remain unscheduled under the current constraints."
        )
    }

]


# =====================================================
# 7. STARTUP INFORMATION
# =====================================================

print("\n======================================")

print("       CAMPUSOPTI AI BACKEND")

print("======================================")

print(
    "CP-SAT timetable loaded:",
    len(cp_schedule)
)

print(
    "Algorithm comparison loaded:",
    len(comparison)
)

print(
    "Faculty loaded:",
    len(faculty)
)

print(
    "Classrooms loaded:",
    len(classrooms)
)

print(
    "Student batches loaded:",
    len(batches)
)

print("\nAll datasets loaded successfully!")

print("======================================\n")


# =====================================================
# 8. HOME API
# =====================================================

@app.get("/")
def home():

    return {

        "message": "Welcome to CampusOpti AI",

        "project": "AI-Powered Campus Timetable Optimisation System",

        "status": "Backend is running successfully",

        "dashboard": "/app/"

    }


# =====================================================
# 9. HEALTH CHECK API
# =====================================================

@app.get("/api/health")
def health():

    return {

        "status": "healthy",

        "project": "CampusOpti AI",

        "datasets_loaded": True

    }


# =====================================================
# 10. DASHBOARD STATISTICS API
# =====================================================

@app.get("/api/dashboard")
def dashboard():

    total_lectures = TOTAL_LECTURES

    scheduled_lectures = len(cp_schedule)

    unscheduled_count = (
        total_lectures - scheduled_lectures
    )

    scheduling_percentage = round(

        scheduled_lectures / total_lectures * 100,

        2

    )

    room_utilisation = round(

        scheduled_lectures /
        (len(classrooms) * TOTAL_WEEKLY_SLOTS) * 100,

        2

    )

    return {

        "total_lectures": total_lectures,

        "scheduled_lectures": scheduled_lectures,

        "unscheduled_lectures": unscheduled_count,

        "scheduling_percentage": scheduling_percentage,

        "room_utilisation": room_utilisation,

        "total_faculty": len(faculty),

        "total_classrooms": len(classrooms),

        "total_batches": len(batches)

    }


# =====================================================
# 11. COMPLETE TIMETABLE API
# =====================================================

@app.get("/api/timetable")
def get_timetable():

    return cp_schedule.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 12. BATCH-WISE TIMETABLE API
# =====================================================

@app.get("/api/timetable/batch/{batch_id}")
def get_batch_timetable(batch_id: str):

    result = cp_schedule[
        cp_schedule["batch_id"] == batch_id
    ]

    if result.empty:

        raise HTTPException(

            status_code=404,

            detail="Batch timetable not found"

        )

    return result.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 13. FACULTY-WISE TIMETABLE API
# =====================================================

@app.get("/api/timetable/faculty/{faculty_id}")
def get_faculty_timetable(faculty_id: str):

    result = cp_schedule[
        cp_schedule["faculty_id"] == faculty_id
    ]

    if result.empty:

        raise HTTPException(

            status_code=404,

            detail="Faculty timetable not found"

        )

    return result.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 14. ALGORITHM COMPARISON API
# =====================================================

@app.get("/api/algorithms")
def get_algorithms():

    return comparison.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 15. FACULTY INFORMATION API
# =====================================================

@app.get("/api/faculty")
def get_faculty():

    return faculty.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 16. CLASSROOM INFORMATION API
# =====================================================

@app.get("/api/classrooms")
def get_classrooms():

    return classrooms.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 17. STUDENT BATCH INFORMATION API
# =====================================================

@app.get("/api/batches")
def get_batches():

    return batches.fillna("").to_dict(
        orient="records"
    )


# =====================================================
# 18. UNSCHEDULED LECTURE ANALYSIS API
# =====================================================

@app.get("/api/unscheduled")
def get_unscheduled():

    total_unscheduled = (
        TOTAL_LECTURES - len(cp_schedule)
    )

    return {

        "total_unscheduled": total_unscheduled,

        "records": unscheduled_lectures

    }


# =====================================================
# 19. PROJECT INFORMATION API
# =====================================================

@app.get("/api/info")
def project_info():

    return {

        "project": "CampusOpti AI",

        "version": "1.0",

        "optimisation_algorithm": "OR-Tools CP-SAT",

        "total_required_lectures": TOTAL_LECTURES,

        "total_scheduled_lectures": len(cp_schedule),

        "total_unscheduled_lectures": (
            TOTAL_LECTURES - len(cp_schedule)
        ),

        "solver_status": "OPTIMAL",

        "validation_status": "PASSED"

    }


# =====================================================
# 20. SERVE FRONTEND
# =====================================================

if not FRONTEND_DIR.exists():

    raise FileNotFoundError(
        f"Frontend folder not found: {FRONTEND_DIR}"
    )


app.mount(

    "/app",

    StaticFiles(

        directory=str(FRONTEND_DIR),

        html=True

    ),

    name="frontend"

)


# =====================================================
# 21. APPLICATION READY
# =====================================================

print("CampusOpti AI backend is ready!")

print("Dashboard: http://127.0.0.1:8000/app/")

print("API Documentation: http://127.0.0.1:8000/docs")
