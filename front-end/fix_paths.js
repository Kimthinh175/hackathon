const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  if (f.endsWith('.tsx') || f.endsWith('.ts')) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('/hackathon/api/')) {
      content = content.replace(/'\/hackathon\/api\//g, "'/api/");
      fs.writeFileSync(f, content, 'utf8');
      console.log('Fixed:', f);
    }
  }
});
