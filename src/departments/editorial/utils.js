export function extractExternalId(pagePath) {
  const match = pagePath.match(/(NV|BUK|URN)_\d+/);
  return match ? match[0] : null;
}
