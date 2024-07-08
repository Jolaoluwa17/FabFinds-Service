// swaggerConfig.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FabFinds API",
      version: "1.0.0",
      description: "API documentation for the FabFinds e-commerce platform",
    },
    servers: [
      {
        url: "https://fabfinds-service.onrender.com",
        description: "Development server",
      },
    ],
  },
  apis: ["./controllers/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
