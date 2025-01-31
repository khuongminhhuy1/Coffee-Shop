export function constructUrl(req) {
  const host = req.headers.host;
  if (host) {
    return req.protocol + "://" + host;
  } else {
    throw new Error("Host header is missing from the request");
  }
}
