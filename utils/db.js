import mongoose from "mongoose";

const connect = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongo Connection successfully established.");
    } catch (error) {
        throw new Error("mongo connection error");
    }
};

export default connect;