/**
 * Extract latitude and longitude from a Google Maps URL.
 * Supports: ?q=lat,lng  and  /@lat,lng,zoom
 * @param {string} mapLink
 * @returns {{ lat: number, lng: number } | null}
 */
export function mapLinkToCoords(mapLink) {
  if (!mapLink || typeof mapLink !== 'string') return null;
  const url = mapLink.trim();

  // ?q=23.7315,90.4113  or  ?q=23.7315,90.4113,17
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }

  // /@23.7315,90.4113,17z  or  @23.7315,90.4113
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }

  // ll=23.7315,90.4113
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }

  return null;
}
