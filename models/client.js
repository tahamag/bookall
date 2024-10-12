import mongoose from "mongoose";

const { Schema } = mongoose;
/* firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant ,adress ,password, role,rental*/
const ClientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: function () {
        return this.role !== "admin";
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    identifiant: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    adress: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    password: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    role: {
      type: String,
      enum: ["admin", "locateur", "locataire"],
    },
    rental: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
  },
  { timestamps: true }
);

const ClientModel =
  mongoose.models.Client || mongoose.model("Client", ClientSchema);
export default ClientModel;
