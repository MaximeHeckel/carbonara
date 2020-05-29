import qs from "querystring";
import { BASE_URL, defaultQueryParams } from "./constants";

type CarbonQueryParams = typeof defaultQueryParams;

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

const mapOptionstoCarbonQueryParams: Record<
  keyof Options,
  keyof CarbonQueryParams
> = {
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

const toCarbonQueryParam = (
  options: Partial<Options>,
): Partial<CarbonQueryParams> => {
  const newObj = Object.keys(options).reduce((acc, curr) => {
    /**
     * Go through the options and map them with their corresponding
     * carbon query param key.
     */
    const carbonConfigKey =
      mapOptionstoCarbonQueryParams[curr as keyof Options];
    if (!carbonConfigKey) {
      return acc;
    }

    /**
     * Assign the value of the option to the corresponding
     * carbon query param key
     */
    return {
      ...acc,
      [carbonConfigKey]: options[curr as keyof Options],
    };
  }, {});

  return newObj;
};

export const getCarbonURL = (
  source: string,
  options: Partial<Options>,
): string => {
  /**
   * Merge the default query params with the ones that we got
   * from the options object.
   */
  const carbonQueryParams = {
    ...defaultQueryParams,
    ...toCarbonQueryParam(options),
  } as CarbonQueryParams;

  /**
   * Make the code string url safe
   */
  const code = encodeURIComponent(source);

  /**
   * Stringify the code string and the carbon query params object to get the proper
   * query string to pass
   */
  const queryString = qs.stringify({ code, ...carbonQueryParams });

  /**
   * Return the concatenation of the base url and the query string.
   */
  return `${BASE_URL}?${queryString}`;
};
