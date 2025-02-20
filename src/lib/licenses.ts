import { Licenses } from "@/interfaces/map";

export const licenses_infos: Record<Licenses, { name: string; url: string }> = {
  [Licenses.open_data]: {
    name: "Open Data Commons Open Database License (ODbL 1.0)",
    url: "https://creativecommons.org/licenses/list.en?utm_source=maphub.co",
  },
  [Licenses.creative_commons]: {
    name: "Creative Commons Attribution 4.0 International (CC BY-SA 4.0)",
    url: "https://creativecommons.org/licenses/by/4.0/legalcode.en?utm_source=maphub.co",
  },
  [Licenses.public_domain]: {
    name: "Creative Commons Zero 1.0 Universal (CC 0 1.0)",
    url: "https://creativecommons.org/publicdomain/zero/1.0/legalcode.en?utm_source=maphub.co",
  },
};
