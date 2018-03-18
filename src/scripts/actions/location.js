export const NAVIGATE = "location/NAVIGATE";

export function navigate(path, state) {
  return {
    type: NAVIGATE,
    data: { path, state }
  };
}
