// Reported to the server in User-Agent and X-Qoder-Package-Version. It must match
// the version in package.json, otherwise the server-side SDK version statistics
// describe a version that was never published; `npm run build` compares the two.
// Declared here rather than imported from package.json so bundlers do not have to
// resolve JSON from outside src/.
export const VERSION = '0.2.0';
