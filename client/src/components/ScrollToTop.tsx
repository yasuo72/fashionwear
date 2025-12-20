import { useEffect } from "react";
import { useLocation } from "wouter";

// Ensures each new route starts at the top of the page
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}
