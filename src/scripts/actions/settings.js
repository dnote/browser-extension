export const RECEIVE_USER = "settings/RECEIVE_USER";

export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    data: { user }
  };
}
