from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import user_routes, game_routes

app = FastAPI()

# Create DB tables
Base.metadata.create_all(bind=engine)

# CORS setup
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user_routes.router)
app.include_router(game_routes.router)

@app.get("/")
def root():
    return {"message": "Backend running with Postgres!"}
