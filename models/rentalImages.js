import mongoose from "mongoose";

const {Schema} = mongoose;
/* image / rentalId*/
const rentalImagesSchema = new Schema(
    {
        image :{
            type : Buffer ,
            required  : true
        } ,
        rentalId :{
            type : String ,
            required  : true
        } ,
    },
    {timestamps : true}
);

const rentalImagesModel = mongoose.models.rentalImages || mongoose.model("rentalImages", rentalImagesSchema);
export default rentalImagesModel;