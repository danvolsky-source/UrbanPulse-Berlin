import { useCity } from "@/contexts/CityContext";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CitySelector() {
  const { selectedCity, setSelectedCity } = useCity();
  const { data: cities, isLoading } = trpc.cities.list.useQuery();

  if (isLoading || !cities) {
    return (
      <div className="w-48 h-10 bg-muted animate-pulse rounded-md" />
    );
  }

  return (
    <Select value={selectedCity} onValueChange={setSelectedCity}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city: any) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
