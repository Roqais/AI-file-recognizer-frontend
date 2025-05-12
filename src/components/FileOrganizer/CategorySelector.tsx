import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDUSTRY_CATEGORIES, IndustryCategory } from "./types";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  selectedCategory: IndustryCategory | null;
  onSelectCategory: (category: IndustryCategory) => void;
}

export function CategorySelector({ 
  selectedCategory, 
  onSelectCategory 
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="industry-category" className="text-sm font-medium">
        Industry Category <span className="text-destructive">*</span>
      </Label>
      <Select
        value={selectedCategory || undefined}
        onValueChange={(value) => onSelectCategory(value as IndustryCategory)}
      >
        <SelectTrigger id="industry-category" className="w-full">
          <SelectValue placeholder="Select industry category" />
        </SelectTrigger>
        <SelectContent>
          {INDUSTRY_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Select the industry that best describes your files for optimal organization
      </p>
    </div>
  );
}