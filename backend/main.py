from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, profile, roadmap, progress, admin
import seed

app = FastAPI(title="NousQA Transformation Platform", version="0.1.0")

# CORS (allow frontend dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Seed DB with admin and modules from course_matrix.json
seed.run()

# Register routes
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(roadmap.router)
app.include_router(progress.router)
app.include_router(admin.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}