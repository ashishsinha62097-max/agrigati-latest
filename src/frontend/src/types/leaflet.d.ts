// biome-ignore lint: external library stub
declare module "leaflet" {
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  const L: any;
  export default L;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export function icon(options: any): any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export function latLng(lat: number, lng: number): any;
}

declare module "leaflet/dist/leaflet.css" {}

declare module "react-leaflet" {
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const MapContainer: any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const TileLayer: any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const Marker: any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const Popup: any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const Polyline: any;
  // biome-ignore lint/suspicious/noExplicitAny: external library stub
  export const useMap: any;
}
