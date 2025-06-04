export const validateEmail = (email) => {
  const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegEx.test(email);
};

export const validatePassword = (password) => {
  return (
    password.length >= 6 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

export const validateField = (name, value) => {
  switch (name) {
    case "firstName":
    case "lastName":
      return value.trim()
        ? ""
        : `${name === "firstName" ? "First" : "Last"} name is required`;
    case "email":
      return value.trim()
        ? validateEmail(value)
          ? ""
          : "Enter a valid email address"
        : "Email is required";
    case "password":
      return value.trim()
        ? validatePassword(value)
          ? ""
          : "Password must be at least 8 characters with letters, numbers, and symbols"
        : "Password is required";
    default:
      return "";
  }
};

const phoneRegex = /^[0-9]{10}$/;
export const validateAddress = (name, value) => {
  switch (name) {
    case "firstName":
    case "address":
    case "city":
    case "state":
    case "locality":
      return value.trim() ? "" : `${name} is required.`;

    case "phoneNumber":
      return phoneRegex.test(value.trim())
        ? ""
        : "Please enter a valid 10-digit phone number.";

    default:
      return "";
  }
};
