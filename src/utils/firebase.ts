import { FirebaseError } from "firebase/app";

export function get_error_message(error: FirebaseError) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return {
        message: "This email is already used.",
        field: "email" as const,
      };
    case "auth/invalid-email":
      return {
        message: "Please enter a valid email address.",
        field: "email" as const,
      };
    case "auth/weak-password":
      return {
        message: "Password should be at least 6 characters long.",
        field: "password" as const,
      };
    case "auth/invalid-credential":
      return {
        message: "Invalid email or password.",
      };
    case "auth/operation-not-allowed":
      return {
        message:
          "Email/password accounts are not enabled. Please contact support.",
      };
    case "auth/network-request-failed":
      return {
        message: "Please check your internet connection and try again.",
      };
    default:
      return {
        message: error.message || "An error occurred. Please try again.",
      };
  }
}
