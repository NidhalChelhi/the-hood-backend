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
        barCode: "wjr9ndka6g",
      },
      {
        firstName: "Rafaelita",
        lastName: "de Najera",
        email: "rdenajera2@odnoklassniki.ru",
        barCode: "p3y8w986do",
      },
      {
        firstName: "Claiborn",
        lastName: "Jouning",
        email: "cjouning3@marketwatch.com",
        barCode: "0mjqzg3odq",
      },
      {
        firstName: "Natalie",
        lastName: "McMennum",
        email: "nmcmennum4@webeden.co.uk",
        barCode: "do3doaqud5",
      },
      {
        firstName: "Chlo",
        lastName: "Brickham",
        email: "cbrickham5@bravesites.com",
        barCode: "gz1u3mpi4l",
      },
      {
        firstName: "Bertie",
        lastName: "Falconer-Taylor",
        email: "bfalconertaylor6@devhub.com",
        barCode: "c10t7ejoao",
      },
      {
        firstName: "Blondell",
        lastName: "Barclay",
        email: "bbarclay7@pagesperso-orange.fr",
        barCode: "wr3wg320de",
      },
      {
        firstName: "Sheri",
        lastName: "Grzelak",
        email: "sgrzelak8@seattletimes.com",
        barCode: "fx611xmiah",
      },
      {
        firstName: "Ciro",
        lastName: "De Dantesie",
        email: "cdedantesie9@mysql.com",
        barCode: "h1jjvvmiu7",
      },
      {
        firstName: "Allyn",
        lastName: "Kaliszewski",
        email: "akaliszewskia@imgur.com",
        barCode: "bhuzr3ukxe",
      },
      {
        firstName: "Janaya",
        lastName: "Amberger",
        email: "jambergerb@sakura.ne.jp",
        barCode: "n6riwym1mq",
      },
      {
        firstName: "Billi",
        lastName: "Cove",
        email: "bcovec@rambler.ru",
        barCode: "mx4w2n64k1",
      },
      {
        firstName: "Thain",
        lastName: "Yggo",
        email: "tyggod@istockphoto.com",
        barCode: "4whnqzfood",
      },
      {
        firstName: "Allix",
        lastName: "Fusco",
        email: "afuscoe@squarespace.com",
        barCode: "ttn6pi8lf6",
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
