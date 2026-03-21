const fs = require('fs');
const path = require('path');

const srcManagerViews = path.join(__dirname, 'views', 'manager');
const srcStaffViews = path.join(__dirname, 'views', 'staff');
const destAppManager = path.join(__dirname, 'src', 'app', 'manager');
const destAppStaff = path.join(__dirname, 'src', 'app', 'staff');

function processHtmlToTsx(htmlContent) {
    // Basic react conversions
    let tsx = htmlContent.replace(/class=/g, "className=");
    
    // Convert HTML comments <!-- --> to JSX {/* */}
    tsx = tsx.replace(/<!--(.*?)-->/gs, "{/*$1*/}");
    
    // Escape bare > (specifically the one before 90 ngày)
    tsx = tsx.replace(/> 90/g, "&gt; 90");
    
    // Escape arrow -> to -&gt;
    tsx = tsx.replace(/->/g, "-&gt;");
    
    // Close <input>
    tsx = tsx.replace(/(<input[^>]*[^\/])>/g, "$1 />");
    
    // Convert 'style="position:relative;height: 400px;"' to 'style={{ position: "relative", height: "400px" }}'
    tsx = tsx.replace(/style="([^"]*)"/g, (match, styles) => {
        const styleObj = styles.split(';')
            .filter(style => style.trim())
            .map(style => {
                const [key, value] = style.split(':');
                const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                return `"${camelKey}": "${value.trim()}"`;
            })
            .join(', ');
        return `style={{ ${styleObj} }}`;
    });

    return tsx;
}

function processDirectory(srcDir, destAppDir) {
    if (!fs.existsSync(srcDir)) return;
    
    const files = fs.readdirSync(srcDir);
    
    files.forEach(file => {
        if (!file.endsWith('.html')) return;
        if (file === 'dashboard.html' || file === 'master-data.html') return; // Handled manually previously
        
        const routeName = file.replace('.html', '');
        const routePath = path.join(destAppDir, routeName);
        
        // Ensure folder exists
        if (!fs.existsSync(routePath)) {
            fs.mkdirSync(routePath, { recursive: true });
        }
        
        const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
        const tsxBody = processHtmlToTsx(content);
        
        // Title formatting: bin-location -> BinLocation
        const componentName = routeName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        
        const fileData = `"use client";\nimport React from "react";\n\nexport default function ${componentName}() {\n  return (\n${tsxBody}\n  );\n}\n`;
        
        fs.writeFileSync(path.join(routePath, 'page.tsx'), fileData);
        console.log(`Created route: ${destAppDir}/${routeName}/page.tsx`);
    });
}

console.log("Starting conversion....");
processDirectory(srcManagerViews, destAppManager);
processDirectory(srcStaffViews, destAppStaff);
console.log("Finished converting all UI routes");
