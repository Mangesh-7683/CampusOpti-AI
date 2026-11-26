 AI 4 Campus

 Intelligent Campus Timetable & Resource Optimization System



 Overview

 AI 4 Campus is an intelligent campus timetable and resource optimization system designed to automate the complex process of academic timetable generation.

Traditional timetable preparation involves multiple constraints, including faculty availability, classroom capacity, batch schedules, lecture requirements and laboratory requirements.

CampusOpti AI addresses these challenges using optimization algorithms to generate efficient academic schedules while minimizing scheduling conflicts and maximizing the number of scheduled lectures.

The system combines **Greedy Algorithm, Genetic Algorithm and Google OR-Tools CP-SAT** to explore and compare different optimization approaches.

It also provides an interactive web dashboard for monitoring scheduling performance, analyzing unscheduled lectures and viewing campus resources.

 Project Objectives

- Automate academic timetable generation.
- Minimize faculty, classroom and student batch scheduling conflicts.
- Optimize classroom and faculty resource allocation.
- Handle faculty availability and workload constraints.
- Compare multiple optimization algorithms.
- Identify and explain unscheduled lectures.
- Provide an interactive dashboard for timetable analysis.

Key Features

### 1. Intelligent Timetable Generation

- Automated lecture scheduling.
- Batch-wise and faculty-wise timetable organization.
- Classroom allocation based on room compatibility.
- Scheduling based on available weekly time slots.

### 2. Multiple Optimization Algorithms

**Greedy Algorithm**

- Generates an initial timetable using a rule-based scheduling approach.
- Assigns lectures to available slots.
- Provides a fast baseline solution.

**Genetic Algorithm**

- Uses population-based optimization.
- Applies selection, crossover and mutation.
- Evaluates timetable fitness.
- Validates scheduling constraints.

**Google OR-Tools CP-SAT**

- Uses Constraint Programming and SAT-based optimization.
- Models academic scheduling constraints.
- Maximizes the number of scheduled lectures.
- Identifies infeasible or unscheduled lecture requirements.

 3. Constraint Validation

The system considers constraints such as:

- Batch scheduling conflicts.
- Faculty scheduling conflicts.
- Classroom scheduling conflicts.
- Faculty availability.
- Room compatibility and capacity.
- Faculty maximum daily workload.
- Required lectures per subject.

### 4. Interactive Web Dashboard

The dashboard provides five major sections:

| Section                      | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| Performance Overview         | Displays key scheduling statistics                       |
| Algorithm Performance        | Compares optimization algorithms using tables and charts |
| Optimised Timetable          | Displays scheduled lectures with filters and CSV export  |
| Unscheduled Lecture Analysis | Explains lectures that could not be scheduled            |
| Campus Resources             | Displays faculty and classroom information               |

## Optimization Results

The project was tested using the following academic scheduling dataset:

| Parameter                   |  Value |
| --------------------------- | -----: |
| Total Required Lectures     |    142 |
| Available Weekly Time Slots |     30 |
| Total Faculty Members       |     20 |
| Total Classrooms            |     14 |
| Total Student Batches       |      8 |
| Scheduled Lectures          |    139 |
| Unscheduled Lectures        |      3 |
| Scheduling Success          | 97.89% |
| Room Utilisation            |  33.1% |

### Algorithm Comparison

The project implements three optimization approaches:

| Algorithm         | Scheduled Lectures | Unscheduled Lectures |
| ----------------- | -----------------: | -------------------: |
| Greedy Algorithm  |                139 |                    3 |
| Genetic Algorithm |                139 |                    3 |
| OR-Tools CP-SAT   |                139 |                    3 |

**Important finding:** All three approaches scheduled 139 out of 142 required lectures in the tested dataset.

The remaining three lectures were identified as infeasible under the configured faculty workload constraints.

### Unscheduled Lecture Analysis

The system identified the following scheduling limitation:

- Batch: B004
- Subject: Operating Systems
- Faculty: F008
- Required Lectures: 18 per week
- Maximum Daily Workload: 3 lectures
- Working Days: 5
- Maximum Weekly Capacity: 15 lectures
- Unscheduled Lectures: 3

The system provides an explanation instead of silently ignoring unscheduled lecture requirements.

##  Technology Stack

| Category                | Technologies                        |
| ----------------------- | ----------------------------------- |
| Programming Language    | Python                              |
| Backend Framework       | FastAPI                             |
| Optimization            | Google OR-Tools CP-SAT              |
| Algorithms              | Greedy Algorithm, Genetic Algorithm |
| Data Processing         | Pandas, NumPy                       |
| Frontend                | HTML, CSS, JavaScript               |
| Data Visualization      | Plotly.js                           |
| Data Storage            | CSV Files                           |
| API Testing             | FastAPI Swagger UI                  |
| Development Environment | Anaconda, Jupyter Notebook, VS Code |

##  System Architecture

```text
             CAMPUSOPTi AI
                   |
          Academic Dataset
                   |
       Data Processing & Validation
                   |
          Lecture Task Creation
                   |
       +-----------+-----------+
       |           |           |
     Greedy     Genetic     OR-Tools
   Algorithm   Algorithm     CP-SAT
       |           |           |
       +-----------+-----------+
                   |
          Timetable Validation
                   |
          Optimized Schedule
                   |
          Unscheduled Analysis
                   |
             FastAPI Backend
                   |
          Interactive Dashboard
                   |
       Charts | Tables | Filters
```

## 📂 Project Structure

```text
 AI 4 Campus
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── dataset/
│   ├── faculty.csv
│   ├── classrooms.csv
│   └── student_batches.csv
│
├── reports/
│   ├── cp_sat_timetable.csv
│   ├── algorithm_comparison.csv
│   ├── greedy_timetable_revised.csv
│   └── genetic_algorithm_timetable.csv
│
├── notebooks/
│   └── Optimization experiments
│
├── requirements.txt
├── .gitignore
└── README.md
```

*Note: The structure above highlights the main project files. Additional dataset, report and notebook files may also be present.*

## ⚙️ Installation & Setup

Follow these steps to run  AI 4 Campus locally.

### Prerequisites

- Python 3.10 or later
- Anaconda or Python environment
- pip package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CampusOpti-AI.git
```

### Step 2: Navigate to the Project

```bash
cd CampusOpti-AI
```

### Step 3: Create a Virtual Environment

```bash
conda create -n campusopti python=3.11
```

Activate the environment:

```bash
conda activate campusopti
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Start the Backend Server

```bash
uvicorn backend.main:app --reload
```

### Step 6: Open the Dashboard

Open your browser and visit:

**Dashboard:** [http://127.0.0.1:8000/app/](http://127.0.0.1:8000/app/)

**API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 🧪 Testing & Validation

The optimization system was tested using multiple validation checks.

- Batch clash validation.
- Faculty clash validation.
- Room clash validation.
- Faculty availability validation.
- Invalid room assignment validation.
- Faculty daily workload validation.
- Unscheduled lecture identification.

The Genetic Algorithm validation reported zero violations across the tested constraints.

The CP-SAT solver returned an **OPTIMAL** status for its configured optimization model.

## 🚀 Future Enhancements

- Integration with a real-time university database.
- User authentication for administrators and faculty.
- Manual timetable editing and rescheduling.
- Support for multiple departments and semesters.
- Dynamic faculty availability updates.
- Advanced resource utilization analytics.
- Cloud deployment and online dashboard access.
- Automated timetable notifications.

## 💡 Real-World Impact

CampusOpti AI aims to simplify academic timetable management by reducing manual scheduling effort, identifying resource constraints and providing transparent optimization results.

It demonstrates how algorithmic optimization and intelligent resource allocation can be applied to real-world educational institution challenges.

## 👩‍💻 Developer

**Mangesh Tate**

Third-Year B.Tech – Artificial Intelligence & Data Science

Dr. D. Y. Patil College of Engineering, Akurdi, Pune

Interested in Artificial Intelligence, Machine Learning, Optimization Algorithms and Full-Stack Development.

---

\<p align="center">
&#x20; \<b>Built with Python, Optimization Algorithms and Innovation.\</b>
&#x20; \<br />
&#x20; ⭐ If you find this project interesting, consider giving it a star!
\</p>
