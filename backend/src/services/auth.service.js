const User = require("../models/user.model");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

// Find an account by email and role. Role is required because SplitNest
// allows one user account and one owner account with the same email.
const findUserByEmail = async (email, includePassword = false, role = null) => {
  const filter = { email: normalizeEmail(email) };

  if (role && ["user", "owner"].includes(role)) {
    filter.role = role;
  }

  let query = User.findOne(filter);

  if (includePassword) {
    query = query.select("+password");
  }

  return query;
};

const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserById = async (userId) => User.findById(userId);

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
};
