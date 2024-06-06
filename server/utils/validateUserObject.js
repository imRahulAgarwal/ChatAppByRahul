import Joi from "joi";

const validateRegisterObject = async (data) => {
    const result = await Joi.object({
        name: Joi.string().required().regex(new RegExp("^[A-Za-z\\s]+$")),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        bio: Joi.string(),
    }).validate(data);

    return result;
};

export default validateRegisterObject;
