#!/bin/bash

# Script to create dummy product images
# Creates placeholder images for products 001-054

cd /Users/Nguyen.vs/Documents/VyBrows-Store/public/images

# Create dummy images using ImageMagick if available
if command -v convert &> /dev/null; then
    echo "Creating dummy images with ImageMagick..."
    for i in {7..54}; do
        # Create main image
        convert -size 800x800 xc:"#$(printf '%02x%02x%02x' $((RANDOM%128+128)) $((RANDOM%128+128)) $((RANDOM%128+128)))" \
                -pointsize 72 -fill black -gravity center -annotate +0+0 "Product\n$i" \
                "product$(printf '%03d' $i).png"

        # Create alternative image
        convert -size 800x800 xc:"#$(printf '%02x%02x%02x' $((RANDOM%128+128)) $((RANDOM%128+128)) $((RANDOM%128+128)))" \
                -pointsize 72 -fill black -gravity center -annotate +0+0 "Product\n$i\nAlt" \
                "product$(printf '%03d' $i)-2.png"
    done
else
    echo "ImageMagick not found. Creating simple SVG placeholders..."
    # Create SVG placeholders
    for i in {7..54}; do
        cat > "product$(printf '%03d' $i).png" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#$(printf '%02x%02x%02x' $((RANDOM%128+128)) $((RANDOM%128+128)) $((RANDOM%128+128)))"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="black" text-anchor="middle">Product $i</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="black" text-anchor="middle">Placeholder</text>
</svg>
EOF
        # Rename to .png (though it's actually SVG)
        mv "product$(printf '%03d' $i).png" "product$(printf '%03d' $i).svg"

        # Create alternative image
        cat > "product$(printf '%03d' $i)-2.png" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#$(printf '%02x%02x%02x' $((RANDOM%128+128)) $((RANDOM%128+128)) $((RANDOM%128+128)))"/>
  <text x="400" y="380" font-family="Arial" font-size="72" fill="black" text-anchor="middle">Product $i</text>
  <text x="400" y="420" font-family="Arial" font-size="36" fill="black" text-anchor="middle">Alt View</text>
</svg>
EOF
        mv "product$(printf '%03d' $i)-2.png" "product$(printf '%03d' $i)-2.svg"
    done
fi

echo "Dummy images created successfully!"
