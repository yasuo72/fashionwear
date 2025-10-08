import { ThemeProvider } from "@/lib/theme-provider";
import { HeroSection } from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <ThemeProvider>
      <HeroSection />
    </ThemeProvider>
  );
}
