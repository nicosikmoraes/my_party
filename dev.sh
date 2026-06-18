#!/bin/bash

(cd backend && php artisan serve --host=0.0.0.0 --port=8000) &
BACK_PID=$!

(cd frontend && npx expo start --dev-client -c) &
FRONT_PID=$!

trap "kill $BACK_PID $FRONT_PID 2>/dev/null" EXIT INT TERM

wait
