import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Logger } from './utils/logger'
import { Express } from 'express'
import { SwaggerSchemas } from './types/swagger.schemas'
const SWAGGER_BASE_URL = process.env.SWAGGER_BASE_URL || 'http://localhost:4000'

// Swagger configuration
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jobber API - Easy Cron Scheduler',
      version: '1.0.0',
      description: 'REST API for managing cron-based jobs (create, list, types, etc)',
    },
    servers: [
      {
        url: SWAGGER_BASE_URL,
        description: 'Test server',
      },
    ],
    components: {
      schemas: {...SwaggerSchemas}, // Import your Swagger schemas here
    },
  },
  apis: ['./src/routes/*.ts'], // path to your route files
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  Logger.info(`📄 Swagger available at ${SWAGGER_BASE_URL}/api-docs`)
}
