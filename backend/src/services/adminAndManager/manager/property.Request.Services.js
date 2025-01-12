import { Buyproperty } from "../../../models/buy.property.model.js";
import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const allform = async (managerId) => {
  try {
    //validate
    if (!managerId) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid manager",
      });
    }

    const extistForms = await Buyproperty.findOne({managerId:managerId});

    return extistForms;
  } catch (error) {
    throw error;
  }
};
export { allform };
