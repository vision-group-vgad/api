import { server } from "./src/departments/common-features/notification/noty-socket.js";

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server + WebSocket listening on port ${PORT}`);
});
