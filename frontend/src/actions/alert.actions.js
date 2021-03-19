// This file contains Redux action creators for actions related to
// alerts or toaster notifications in the application.
import { alertConstants } from "../constants";

export const alertActions = {
  success,
  error,
  clear,
};

function success(message) {
  return { type: alertConstants.SUCCESS, message };
}
