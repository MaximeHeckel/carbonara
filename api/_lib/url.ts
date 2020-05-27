import qs from "querystring";
import { BASE_URL, defaultOptions } from "./constants";

type CarbonOptions = typeof defaultOptions;

export type Options = {
  backgroundColor: string;
  dropShadow: string;
  dropShadowBlur: string;
  dropShadowOffsetY: string;
  exportSize: string;
  fontFamily: string;
  fontSize: string;
  language: string;
  lineHeight: string;
  lineNumber: string;
  paddingHorizontal: string;
  paddingVertical: string;
  theme: string;
  squaredImage: string;
  widthAdjustment: string;
  windowControl: string;
  watermark: string;
  windowTheme: string;
};

const mapOptionsToCarbonOptions: Record<keyof Options, keyof CarbonOptions> = {
  backgroundColor: "bg",
  dropShadow: "ds",
  dropShadowBlur: "dsblur",
  dropShadowOffsetY: "dsyoff",
  exportSize: "es",
  fontFamily: "fm",
  fontSize: "fs",
  language: "l",
  lineHeight: "lh",
  lineNumber: "ln",
  paddingHorizontal: "ph",
  paddingVertical: "pv",
  theme: "t",
  squaredImage: "si",
  widthAdjustment: "wa",
  windowControl: "wc",
  watermark: "wm",
  windowTheme: "wt",
};

const toCarbonOption = (options: Partial<Options>) => {
  const obj = {} as Partial<CarbonOptions>;

  for (const [name, value] of Object.entries(options)) {
    const carbonConfigName = mapOptionsToCarbonOptions[name as keyof Options];
    if (!carbonConfigName) continue;
    obj[carbonConfigName] = value as any;
  }

  return obj;
};

export const getUrl = (source: string, options: Partial<Options>): string => {
  const encodedSource = encodeURIComponent(source);
  const carbonOptions = {
    ...defaultOptions,
    ...toCarbonOption(options),
  };
  const queryString = qs.stringify({ code: encodedSource, ...carbonOptions });
  return `${BASE_URL}?${queryString}`;
};
