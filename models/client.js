import mongoose from "mongoose";

const {Schema} = mongoose;
/* firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant ,adress ,password*/
const ClientSchema = new Schema(
    {
        firstName :{
            type : String ,
            required  : true
        } ,
        lastName :{
            type : String ,
            required  : true
        } ,
        email :{
            type : String ,
            required  : true
        } ,
        birthday :{
            type : Date ,
            required  : true
        } ,
        phoneNumber : {
            type : String ,
            required : true ,
        },
        identifiant : {
            type : String ,
            required : true ,
        },
        adress : {
            type : String ,
            required : true ,
        },
        password : {
            type : String ,
            required : true ,
        },
        type : {
            type : String ,
        }
    },
    {timestamps : true}
);

const ClientModel = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export default ClientModel;