export const UPDATE = "settings/UPDATE";
export const RESET = "settings/RESET";

export function updateSettings(settings) {
  return {
    type: UPDATE,
    data: { settings }
  };
}

export function resetSettings(settings) {
  return {
    type: RESET,
  };
}
