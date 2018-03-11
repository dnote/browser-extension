export const UPDATE = "settings/UPDATE";

export function updateSettings(settings) {
  return {
    type: UPDATE,
    data: { settings }
  };
}
