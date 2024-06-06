const { ENV } = process.env;
const errorMiddleware = async (error, req, res, next) => {
    if (ENV === "DEVELOPMENT") console.log(error);

    if (error.statusCode === "LIMIT_FILE_SIZE") {
        error.message = "Image too large. Provide image less than size 1 MB.";
        error.statusCode = 413;
    } else if (error.message === "invalid signature") {
        error.message = "Invalid token";
        error.statusCode = 401;
    } else if (error.message === "jwt malformed") {
        error.message = "Invalid JWT token";
        error.statusCode = 401;
    } else if (error.message === "jwt expired") {
        error.message = "Token expired";
        error.statusCode = 401;
    } else if (error.statusCode === 11000) {
        error.message = "E-Mail already exists.";
        error.statusCode = 400;
    } else if (error.statusCode === "ENOENT") {
        error.message = "File not found";
        error.statusCode = 415;
    } else if (error.message === "getaddrinfo ENOTFOUND cloud.appwrite.io") {
        error.message = "Please connect to the internet.";
        error.statusCode = 400;
    } else if (error.statusCode === "ESOCKET") {
        error.message = "SMTP not connected.";
        error.statusCode = 500;
    }
    res.status(error.statusCode).json({ success: false, message: error.message });
};

export default errorMiddleware;
