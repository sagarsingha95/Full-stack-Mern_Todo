import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  failOnErrors: true,

  definition: {
    openapi: "3.0.3",

    info: {
      title: "Marked Todo API",

      version: "1.0.0",

      description:
        "REST API documentation for the Marked MERN Todo application.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication and session management",
      },

      {
        name: "Todos",
        description: "Todo management",
      },

      {
        name: "Users",
        description: "User profile management",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Error: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
              example: false,
            },

            message: {
              type: "string",
              example: "Something went wrong.",
            },
          },
        },

        User: {
          type: "object",

          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },

            name: {
              type: "string",
              example: "Sagar Singha",
            },

            email: {
              type: "string",
              format: "email",
              example: "sagar@example.com",
            },

            profilePicture: {
              type: "object",

              properties: {
                url: {
                  type: "string",
                  example:
                    "https://res.cloudinary.com/example/image/upload/avatar.jpg",
                },

                publicId: {
                  type: "string",
                  example: "mern-todo/profile-pictures/avatar",
                },
              },
            },
          },
        },

        Todo: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f191e810c19729de860ea",
            },
            title: {
              type: "string",
              example: "Finish production deployment",
            },
            description: {
              type: "string",
              example: "Deploy frontend and backend before launch.",
            },
            completed: {
              type: "boolean",
              example: false,
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "high",
            },
            user: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
