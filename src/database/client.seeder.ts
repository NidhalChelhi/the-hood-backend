import mongoose, { connect } from "mongoose";
import { Client, ClientSchema } from "../modules/clients/clients.schema";
import * as dotenv from "dotenv";

dotenv.config();

async function seedClients() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in the environment variables.");
  }
  await connect(process.env.MONGO_URI);

  try {
    const ClientModel = mongoose.model<Client>(Client.name, ClientSchema);
    await ClientModel.deleteMany({});
    const clients = [
      {
        firstName: "Salome",
        lastName: "Lees",
        email: "slees0@etsy.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Joela",
        lastName: "Strelitzer",
        email: "jstrelitzer1@earthlink.net",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Rafaelita",
        lastName: "de Najera",
        email: "rdenajera2@odnoklassniki.ru",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Claiborn",
        lastName: "Jouning",
        email: "cjouning3@marketwatch.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Natalie",
        lastName: "McMennum",
        email: "nmcmennum4@webeden.co.uk",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Chlo",
        lastName: "Brickham",
        email: "cbrickham5@bravesites.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Bertie",
        lastName: "Falconer-Taylor",
        email: "bfalconertaylor6@devhub.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Blondell",
        lastName: "Barclay",
        email: "bbarclay7@pagesperso-orange.fr",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Sheri",
        lastName: "Grzelak",
        email: "sgrzelak8@seattletimes.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Ciro",
        lastName: "De Dantesie",
        email: "cdedantesie9@mysql.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Allyn",
        lastName: "Kaliszewski",
        email: "akaliszewskia@imgur.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Janaya",
        lastName: "Amberger",
        email: "jambergerb@sakura.ne.jp",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Billi",
        lastName: "Cove",
        email: "bcovec@rambler.ru",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Thain",
        lastName: "Yggo",
        email: "tyggod@istockphoto.com",
        barCode: "qwrk5415ja",
      },
      {
        firstName: "Allix",
        lastName: "Fusco",
        email: "afuscoe@squarespace.com",
        barCode: "qwrk5415ja",
      },
    ];
    const clientDocs = await ClientModel.insertMany(clients);
    console.log("Seeded Clients successfuly : ", clientDocs);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedClients();
