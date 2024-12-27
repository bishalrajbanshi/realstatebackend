import { Manager } from "../../../models/manager.model.js";
import { Enqueryform } from "../../../models/user.enquery.form.js";

import { utils } from "../../../utils/index.js";
const { apiError } = utils;

const enqueryFormByUser = async (
  filters = {},
  projection = null,
  options = {},
  managerId
) => {

  try {
    //validate manager id
    if (!managerId) {
      throw new apiError({
        statusCode: 400,
        message: "Invalid manager",
      });
    }

    const manager  = await Manager.findById(managerId);
    //validate manager
    if (!manager) {
      throw new apiError({
        statusCode: 404,
        message: "Manager not found"
      })
    }

    //combilne filters with manager address
    const combinedFilters = { ...filters, address: manager.address };

    //fetch the user from 
    const userFrom = await Enqueryform.find(combinedFilters,projection,options);

    return userFrom;
    
  } catch (error) {
    throw error;
  }
};

export { enqueryFormByUser };
