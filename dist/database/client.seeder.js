"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const clients_schema_1 = require("../modules/clients/clients.schema");
const dotenv = require("dotenv");
dotenv.config();
async function seedClients() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not set in the environment variables.");
    }
    await (0, mongoose_1.connect)(process.env.MONGO_URI);
    try {
        const ClientModel = mongoose_1.default.model(clients_schema_1.Client.name, clients_schema_1.ClientSchema);
        await ClientModel.deleteMany({});
        const clients = [
            {
                firstName: "Salome",
                lastName: "Lees",
                email: "slees0@etsy.com",
                barCode: "qwrk5415ja",
                points: 2500
            },
            {
                firstName: "Joela",
                lastName: "Strelitzer",
                email: "jstrelitzer1@earthlink.net",
                barCode: "wjr9ndka6g",
                points: 300
            },
            {
                firstName: "Rafaelita",
                lastName: "de Najera",
                email: "rdenajera2@odnoklassniki.ru",
                barCode: "p3y8w986do",
                points: 1300
            },
            {
                firstName: "Claiborn",
                lastName: "Jouning",
                email: "cjouning3@marketwatch.com",
                barCode: "0mjqzg3odq",
                points: 3200
            },
            {
                firstName: "Natalie",
                lastName: "McMennum",
                email: "nmcmennum4@webeden.co.uk",
                barCode: "do3doaqud5",
                points: 2400
            },
            {
                firstName: "Chlo",
                lastName: "Brickham",
                email: "cbrickham5@bravesites.com",
                barCode: "gz1u3mpi4l",
                points: 15000
            },
            {
                firstName: "Bertie",
                lastName: "Falconer-Taylor",
                email: "bfalconertaylor6@devhub.com",
                barCode: "c10t7ejoao",
                points: 15
            },
            {
                firstName: "Blondell",
                lastName: "Barclay",
                email: "bbarclay7@pagesperso-orange.fr",
                barCode: "wr3wg320de",
                points: 369
            },
            {
                firstName: "Sheri",
                lastName: "Grzelak",
                email: "sgrzelak8@seattletimes.com",
                barCode: "fx611xmiah",
                points: 1
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
                points: 9840
            },
            {
                firstName: "Janaya",
                lastName: "Amberger",
                email: "jambergerb@sakura.ne.jp",
                barCode: "n6riwym1mq",
                points: 100000
            },
            {
                firstName: "Billi",
                lastName: "Cove",
                email: "bcovec@rambler.ru",
                barCode: "mx4w2n64k1",
                points: 100
            },
            {
                firstName: "Thain",
                lastName: "Yggo",
                email: "tyggod@istockphoto.com",
                barCode: "4whnqzfood",
                points: 100
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
    }
    catch (error) {
        console.error("Error seeding the database:", error);
    }
    finally {
        mongoose_1.default.disconnect();
    }
}
seedClients();
//# sourceMappingURL=client.seeder.js.map