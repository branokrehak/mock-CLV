import { useMemo } from "react";
import { countriesRegistry } from "../../../../app/countries-registry";
import { PatientsItem } from "../../../../features/patients/patients";
import { DataModel } from "../../../../models/data-model";
import { EnumFilter } from "../../../../models/data-model/enum-filter";
import { HeaderSelectFilter } from "./header-select-filter";

export function RegionFilterHeader({ model }: { model: DataModel }) {
  const countryFilter = useMemo(
    () =>
      model.filters.find(
        (f) => f instanceof EnumFilter && f.attr === "country",
      ) as EnumFilter<PatientsItem> | undefined,
    [model.filters],
  );

  // Check if country filter has any selections
  const disabled = useMemo(() => {
    return countryFilter?.selected.length !== 1;
  }, [countryFilter]);

  // Get regions enum for all selected countries
  const regionsForSelectedCountries = useMemo(() => {
    const countries = countryFilter?.selected;

    if (countries?.length !== 1) return {};

    const regions = new Map<number, string>();
    for (const country of countries) {
      if (typeof country === "string") {
        const countryRegions = countriesRegistry.getRegionsMap(country);
        for (const [value, name] of countryRegions.entries()) {
          regions.set(value, name);
        }
      }
    }

    return Object.fromEntries(regions.entries());
  }, [countryFilter]);

  return (
    <HeaderSelectFilter
      attr="region"
      model={model}
      values={regionsForSelectedCountries}
      disabled={disabled}
    />
  );
}
