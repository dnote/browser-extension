export const NAVIGATE = "location/NAVIGATE";

export function navigate(path) {
  return {
    type: NAVIGATE,
    data: { path }
  };
}
