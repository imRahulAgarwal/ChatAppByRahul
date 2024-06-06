import Joi from "joi";
import { Types } from "mongoose";

export const validateObjectId = (ID) =>
    Joi.string()
        .custom((value, helpers) => (Types.ObjectId.isValid(value) ? value : helpers.error("any.invalid")), "ObjectId")
        .required()
        .validate(ID);
