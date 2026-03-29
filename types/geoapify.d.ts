

export interface GeoapifyFeature {
  properties: {
    formatted: string;
    [key: string]: any;
  };
}

export interface GeoapifyResponse {
  features: GeoapifyFeature[];
  [key: string]: any;
}
export type { GeoapifyFeature, GeoapifyResponse };