# =============================================================================
# Shell script to install, start the Next.js app, and open default browser
# =============================================================================

# Navigate to this script's directory (project root)
cd "$(dirname "$0")"

# 1) Install dependencies (if needed)
npm install

# 2) Start Next.js in development mode
#    Change to "npm run start" for production server
npm run dev &
NEXT_PID=$!

# 3) Wait for the server to be ready
echo "Waiting for Next.js server to start at http://localhost:3000..."
sleep 5

# 4) Open default browser to the app URL
if command -v xdg-open >/dev/null; then
  xdg-open http://localhost:3000
elif command -v open >/dev/null; then
  open http://localhost:3000
else
  echo "Please open your browser and go to http://localhost:3000"
fi

# 5) Bring the Next.js process to foreground so logs show
wait $NEXT_PID