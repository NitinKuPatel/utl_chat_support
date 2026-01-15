const fs = require('fs');

try {
    const content = fs.readFileSync('c:/Users/vipin/OneDrive/Desktop/UTL_helpdesk/fujiyama-frontend--main/public/chatbot-new.bundle.js', 'utf8');
    // Basic syntax check by trying to parse it as a script (simplified)
    // In a real scenario, we'd use a parser, but here we'll just check if node can load it or if we can spot obvious errors
    // Since it's a huge file, let's just try to require it? No, it's a bundle likely with IIFE.
    // Let's rely on node's syntax checker
    console.log("File read successfully.");
} catch (err) {
    console.error("Error reading file:", err);
}
