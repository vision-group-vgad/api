import Transport from "winston-transport";
import { PrismaClient } from "../../generated/prisma/index-browser.js";

const prisma = new PrismaClient();

class PrismaTransport extends Transport {
  async log(info, callback) {
    const { level, message, timestamp = new Date() } = info;

    try {
      await prisma.log.create({
        data: {
          level,
          message,
          timestamp: new Date(timestamp),
        },
      });
    } catch (err) {
      return err;
    }
    callback();
  }
}

export default PrismaTransport;
