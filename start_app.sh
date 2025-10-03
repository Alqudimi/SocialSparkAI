#!/bin/bash

echo "Starting backend server on port 8000..."
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

cd ..

echo "Starting frontend server on port 5000..."
cd frontend
npm run dev

kill $BACKEND_PID 2>/dev/null
