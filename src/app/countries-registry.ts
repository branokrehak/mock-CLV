import { reactive } from "@vue/reactivity";
import { apiGetUtilsCountries, CountrySchema, RegionSchema } from "../api";
import { compareString } from "../utils/utils";

export class CountriesRegistry {
  schemas: Record<string, CountrySchema>;

  get countriesEnum() {
    return Object.keys(this.schemas ?? []).sort(compareString);
  }

  async load() {
    const resp = await apiGetUtilsCountries();
    this.schemas = resp.data.countries;
  }

  getRegionSchemas(country: string): RegionSchema[] {
    return this.schemas?.[country]?.regions;
  }

  getRegionSchema(country: string, region: number): RegionSchema {
    return this.getRegionSchemas(country)?.find(
      (r) => r.region_enum_value === region,
    );
  }

  getRegionsMap(country: string) {
    const res = new Map<number, string>();
    const schemas = this.schemas?.[country]?.regions;

    for (const region of schemas ?? []) {
      res.set(region.region_enum_value, region.region_name);
    }

    return res;
  }

  getRegionsEnum(country: string) {
    return Object.fromEntries(this.getRegionsMap(country).entries());
  }
}

export const countriesRegistry = reactive(new CountriesRegistry());
