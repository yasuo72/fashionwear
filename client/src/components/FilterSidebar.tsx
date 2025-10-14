import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useBrands } from "@/hooks/useBrands";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
];

interface FilterSidebarProps {
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
  selectedBrands?: string[];
  onBrandsChange?: (brands: string[]) => void;
}

export function FilterSidebar({ 
  priceRange: externalPriceRange,
  onPriceChange,
  selectedBrands: externalSelectedBrands,
  onBrandsChange
}: FilterSidebarProps = {}) {
  const { data: brandsData } = useBrands();
  const brands = brandsData?.brands || [];
  
  const [priceRange, setPriceRange] = useState(externalPriceRange || [0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(externalSelectedBrands || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand) 
      ? selectedBrands.filter(b => b !== brand) 
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    onBrandsChange?.(newBrands);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onPriceChange?.(newRange);
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    onPriceChange?.([0, 10000]);
    onBrandsChange?.([]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "brands", "sizes", "colors"]} className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-2 pb-4">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={10000}
                step={100}
                className="mb-4"
                data-testid="slider-price-range"
              />
              <div className="flex justify-between text-sm">
                <span data-testid="text-price-min">₹{priceRange[0]}</span>
                <span data-testid="text-price-max">₹{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 py-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                    data-testid={`checkbox-brand-${brand.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 py-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSize(size)}
                  data-testid={`button-size-${size.toLowerCase()}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 py-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColors.includes(color.name)
                      ? "border-primary scale-110"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  data-testid={`button-color-${color.name.toLowerCase()}`}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
