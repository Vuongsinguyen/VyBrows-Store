#!/bin/bash

# Create missing SVG files for products 003-006

# Product 003-2 (Mascara Alt)
cat > product003-2.svg << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#4ECDC4"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Product 003</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Mascara Alt</text>
</svg>
SVG_EOF

# Product 004 (Foundation Light)
cat > product004.avif << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#45B7D1"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Product 004</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Foundation Light</text>
</svg>
SVG_EOF

# Product 004-2 (Foundation Alt)
cat > product004-2.svg << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#96CEB4"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Product 004</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Foundation Alt</text>
</svg>
SVG_EOF

# Product 005 (Blush Pink)
cat > product005.avif << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#FFEAA7"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="black" text-anchor="middle">Product 005</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="black" text-anchor="middle">Blush Pink</text>
</svg>
SVG_EOF

# Product 005-2 (Blush Alt)
cat > product005-2.svg << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#DDA0DD"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Product 005</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Blush Alt</text>
</svg>
SVG_EOF

# Product 006-2 (Concealer Alt)
cat > product006-2.svg << 'SVG_EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#85C1E9"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="white" text-anchor="middle">Product 006</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Concealer Alt</text>
</svg>
SVG_EOF

echo "All missing SVG files created successfully!"
