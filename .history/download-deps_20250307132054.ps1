# Create lib directory if it doesn't exist
New-Item -ItemType Directory -Force -Path lib

# Download dependencies
Invoke-WebRequest -Uri "https://unpkg.com/mathjs@11.8.2/lib/browser/math.min.js" -OutFile "lib/math.min.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/random-js@2.1.0/dist/random-js.umd.min.js" -OutFile "lib/random-js.umd.min.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@dice-roller/rpg-dice-roller@5.3.0/lib/umd/bundle.min.js" -OutFile "lib/rpg-dice-roller.umd.min.js"

Write-Host "Dependencies downloaded successfully!" 