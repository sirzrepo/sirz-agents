const fs = require('fs');
const path = require('path');

// Function to create an SVG icon from the logo
function createSvgIcon(size) {
  // The viewBox is set to preserve the logo's aspect ratio
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1000">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g transform="scale(0.9) translate(50, 50)">
    <!-- Background rectangle -->
    <rect x="0" y="0" width="1000" height="1000" fill="#f97316"/>
    <!-- Logo shape -->
    <path d="M45.5 0h909v567.9L500 909 45.5 567.9z" fill="#C8102E"/>
    <!-- Black base -->
    <path d="M45.5 567.9L500 909l454.5-341.1v341.1H45.5z" fill="#000000"/>
  </g>
</svg>`;
}

// Icon sizes from manifest.json
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
iconSizes.forEach(size => {
  const svg = createSvgIcon(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Created icon-${size}x${size}.svg`);
});

// Create apple-touch-icon
const appleSvg = createSvgIcon(180);
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.svg'), appleSvg);
console.log('Created apple-touch-icon.svg');

// Create badge icon
const badgeSvg = createSvgIcon(96);
fs.writeFileSync(path.join(__dirname, '../public/badge.svg'), badgeSvg);
console.log('Created badge.svg');

// Create notification icon
const notificationSvg = createSvgIcon(192);
fs.writeFileSync(path.join(__dirname, '../public/icon.svg'), notificationSvg);
console.log('Created icon.svg');

console.log('All icons generated successfully!'); 