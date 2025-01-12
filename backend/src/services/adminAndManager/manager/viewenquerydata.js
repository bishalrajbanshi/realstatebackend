import { Manager } from "../../../models/manager.model.js";
import { Enqueryform } from "../../../models/enquery.property.model.js";

import { utils } from "../../../utils/index.js";
const { apiError,stateUpdate } = utils;

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

//view enqueryfrom
const viewEnqueryForm = async(formId)=>{
  try {
    //validate
    if (!formId) {
      throw new apiError({
        statusCode: 400,
        message: "invalid from id"
      })
    };

    //enquery from
    const enqueryForm = await Enqueryform.findById(formId);
    if (!formId) {
      throw new apiError({
        statusCode: 404,
        message: "form id not found"
      })
    };

    return enqueryForm;

  } catch (error) {
    throw error;
  }
}

//state
const enquertState = async(data,enqueryId)=>{
  try {
    const {state}=data;
    const updatestate = await stateUpdate(Enqueryform,state,enqueryId);
  } catch (error) {
    throw error
  }
}

export { enqueryFormByUser,viewEnqueryForm, enquertState};
