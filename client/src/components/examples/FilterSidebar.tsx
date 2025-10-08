import { ThemeProvider } from "@/lib/theme-provider";
import { FilterSidebar } from "../FilterSidebar";

export default function FilterSidebarExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-sm">
        <FilterSidebar />
      </div>
    </ThemeProvider>
  );
}
