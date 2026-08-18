import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/contexts/AppearanceContext';
import { colourOptions } from '@/lib/colors';

const ColorSelector = () => {
  const { accentColor, setAccentColor } = useAppearance();
  const currentColour = colourOptions.find((colour) => colour.value === accentColor) || colourOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className={`h-3 w-3 rounded-full ${currentColour.previewClassName}`} />
          <span className="hidden sm:inline">{currentColour.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {colourOptions.map((colour) => (
          <DropdownMenuItem
            key={colour.value}
            onClick={() => setAccentColor(colour.value)}
            className={accentColor === colour.value ? 'bg-accent' : ''}
          >
            <span className={`mr-2 h-3 w-3 rounded-full ${colour.previewClassName}`} />
            <span>{colour.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorSelector;
