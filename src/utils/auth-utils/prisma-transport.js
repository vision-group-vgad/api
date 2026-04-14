// import Transport from "winston-transport";
// import { PrismaClient } from "../../../generated/prisma/index-browser.js";
// import { saveLog } from "../../auth/sql.js";

// const prisma = new PrismaClient();

// class PrismaTransport extends Transport {
//   async log(info, callback) {
//     const { level, message, timestamp = new Date() } = info;

//     try {
//       await saveLog(level, message);
//       await prisma.log.create({
//         data: {
//           level,
//           message,
//           timestamp: new Date(timestamp),
//         },
//       });
//     } catch (err) {
//       return err;
//     }

//     callback();
//   }
// }

// export default PrismaTransport;
