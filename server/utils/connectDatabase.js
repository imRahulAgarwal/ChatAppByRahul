import { connect } from "mongoose";
const { MONGO_URL } = process.env;

const connectDatabase = async () => {
    try {
        await connect(MONGO_URL);
        console.log("Database Connected✅");
    } catch (error) {
        console.log(`Error connecting database : ${error.message}`);
    }
};

export default connectDatabase;
