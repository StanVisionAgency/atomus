// Bad: invented props and enum values, a Figma-only component, a deep import and another UI kit.
import { Select, Combobox } from '@stanvision/atomus-react';
import { Button } from '@stanvision/atomus-react/Button';
import { Label } from '@/components/ui/label';

const COUNTRIES = [
  { value: 'si', label: 'Slovenia' },
  { value: 'at', label: 'Austria' },
  { value: 'hr', label: 'Croatia' },
];

export default function CountryPicker() {
  return (
    <form>
      <Label htmlFor="country">Country</Label>
      <Select id="country" options={COUNTRIES} defaultValue="si" size="large" variant="filled" />
      <Combobox options={COUNTRIES} />
      <Button hierarchy="danger" type="submit">Continue</Button>
    </form>
  );
}
