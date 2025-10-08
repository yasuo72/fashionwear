import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "../Navbar";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}
