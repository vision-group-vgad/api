import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './src/config/swagger.js';
import 'dotenv/config';

const spec = swaggerJSDoc(swaggerOptions);
const paths = Object.keys(spec.paths || {});
console.log('Total Swagger paths:', paths.length);
paths.sort().forEach(p => console.log(p));
