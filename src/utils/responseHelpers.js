export class ResData {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

export class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
} 
export const formatUserResponse = (user, token = null) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    isActive: user.isActive,
    image: user.image,
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...(token && { token }),
  };
};
