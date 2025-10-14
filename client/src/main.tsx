import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Developer Signature
console.log(
  "%c🚀 FashionFusion E-commerce Platform",
  "color: #8b5cf6; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
);
console.log(
  "%c👨‍💻 Developed by: Rohit Singh (@yasuo72)",
  "color: #3b82f6; font-size: 14px; font-weight: bold;"
);
console.log(
  "%c🔗 GitHub: https://github.com/yasuo72",
  "color: #10b981; font-size: 12px;"
);
console.log(
  "%c💡 Built with React, TypeScript, Express & MongoDB",
  "color: #f59e0b; font-size: 11px; font-style: italic;"
);
console.log(
  "%c\"Code is poetry written in logic\" - Rohit Singh",
  "color: #6b7280; font-size: 10px; font-style: italic;"
);

createRoot(document.getElementById("root")!).render(<App />);
