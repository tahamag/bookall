import mongoose from "mongoose";

const {Schema} = mongoose;
/*
id?: string/ name: string/ description: string/ price: Number/ city: string/ disposability: Boolean
mainImage: File/ additionalImages: File[]/ address?: string/ nbrChamber?: Number/ wifi?: Boolean
parking?: Boolean/ piscine?: Boolean/ restoration?: Boolean/ model?: string/ marque?: string
automatique?: Boolean/ typeCars?: string/ rentalType: RentalType
*/
const rentalSchema = new Schema(
    {
        name :{
            type : String ,
            required  : true
        } ,
        description :{
            type : String ,
            required  : true
        } ,
        price :{
            type : Number,
            required : true
        } ,
        city :{
            type : String ,
            required  : true
        } ,
        disposability : {
            type : Boolean ,
            required : true
        },
        mainImage : {
            type : Buffer ,
            required : true ,
        },
        address : {
            type : String ,
        },
        nbrChamber : {
            type : Number ,
        },
        wifi : {
            type : Boolean ,
        },
        parking : {
            type : Boolean ,
        },
        wifi : {
            type : Boolean ,
        },
        piscine : {
            type : Boolean ,
        },
        restoration : {
            type : Boolean ,
        },
        model : {
            type : String ,
        },
        marque : {
            type : String ,
        },
        automatique : {
            type : Boolean ,
        },
        idClient : {
            type : String,
            required : true
        },
        rentalType : {
            type : String,
            required : true
        },
        isValidated: {
            type: Boolean,
            default : false
        }
    },
    {timestamps : true}
);

const rentalModel = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);
export default rentalModel;