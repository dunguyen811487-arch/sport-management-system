const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Sport Management API",
            version: "1.0.0",
            description: "API quản lý vận hành sân thể thao"
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./src/swagger/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerSpec,
    swaggerUi
};