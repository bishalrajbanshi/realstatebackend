import { Cart } from "../../../models/addtocart.model.js";
import { User } from "../../../models/user.model.js";
import { utils } from "../../../utils/index.js";

const { apiError } = utils;

/** Utility function for user validation */
const validateUser = async (userId) => {
  if (!userId) {
    throw new apiError({
      statusCode: 400,
      message: "Invalid user ID",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError({
      statusCode: 404,
      message: "User not found",
    });
  }
  return user;
};

/*  Utility function for finding a cart item */
const findCartItem = async (userId, postId) => {
  return await Cart.findOne({ userId, postId });
};

/** Add to cart */
const addToCart = async (userId, postId) => {
  try {
    await validateUser(userId);

    const existingCartItem = await findCartItem(userId, postId);
    if (existingCartItem) {
      throw new apiError({
        statusCode: 400,
        message: "Product already exists in the cart",
      });
    }

    const newCart = new Cart({ postId, userId });
    await newCart.save();

    return newCart;
  } catch (error) {
    throw error;
  }
};

/** View cart products */
const viewCartproperty = async (userId) => {
  try {
    await validateUser(userId);

    const cartItems = await Cart.find({ userId });
    return cartItems;
  } catch (error) {
    throw error;
  }
};

/** Delete cart product */
const deleteCartProperty = async (userId, postId) => {
  try {
    await validateUser(userId);

    const deletedItem = await Cart.findOneAndDelete({ userId, _id:postId });
    if (!deletedItem) {
      throw new apiError({
        statusCode: 404,
        message: "Product not found in cart",
      });
    }

    return deletedItem;
  } catch (error) {
    throw error;
  }
};

export { addToCart, viewCartproperty, deleteCartProperty };
