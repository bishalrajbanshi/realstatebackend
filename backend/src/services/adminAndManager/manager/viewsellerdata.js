import { Sellproperty } from "../../../models/sell.property.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;
import { middlewares } from "../../../middlewares/index.js";
const { stateUpdate } = middlewares;
import { Manager } from "../../../models/manager.model.js";

//all seller data
const sellerUser = async (
  filters = {},
  projection = {},
  options = {},
  managerId
) => {
  try {
    //validate manager
    if (!managerId) {
      throw new apiError({
        statusCode: 400,
        message: "manager Id",
      });
    }

    const manager = await Manager.findById(managerId);

    //validate
    if (!manager) {
      throw new apiError({
        statusCode: 404,
        message: "Manager not found",
      });
    }

    //combbine filters
    const combinedFiltersData = {
      ...filters,
      landLocation: manager.address,
    };

    //fetch data
    const userSellerData = await Sellproperty.find(
      combinedFiltersData,
      projection,
      options
    );
    return userSellerData;
  } catch (error) {
    throw error;
  }
};

// view seller
const viewSellerData = async (sellerId) => {
  try {
    //validate sellerId
    if (!sellerId) {
      throw new apiError({
        statusCode: 400,
        message: "invalid seller id",
      });
    }

    //seller form data
    const sellerData = await Sellproperty.findById(sellerId);
    if (!sellerData) {
      throw new apiError({
        statusCode: 404,
        message: "seller not found",
      });
    }

    return sellerData;
  } catch (error) {
    throw error;
  }
};

//state checking
const sellerState = async (data, sellerId) => {
  try {
    const { state } = data;
    const updatestate = await stateUpdate(Sellproperty, state, sellerId);
    return updatestate;
  } catch (error) {
    throw error;
  }
};

export { sellerUser, viewSellerData, sellerState };
