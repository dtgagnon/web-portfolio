#!/usr/bin/env zsh

# Ensure ports are free before starting
echo "Ensuring ports are free..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 1

# Start chromium if not already running
if ! pgrep -f "chromium.*remote-debugging-port=9222" >/dev/null; then
  echo "Starting Chromium debug instance..."
  chromium --remote-debugging-port=9222 &
  sleep 2  # Give chromium time to start
else
  echo "Chromium debug instance already running"
fi

# Start development servers in background
echo "Starting development servers..."
pnpm dev &

echo "Development servers started! Access the website at http://localhost:3000"