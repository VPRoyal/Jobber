
// src/docs/schemas/swagger.schemas.ts
export const SwaggerSchemas = {
  CreateJobDTO: {
    type: 'object',
    required: ['name', 'cronExpression', 'type'],
    properties: {
      name: { type: 'string', example: 'Weekly Email' },
      cronExpression: { type: 'string', example: '0 9 * * 1' },
      description: { type: 'string', example: 'Sends weekly digest email' },
      type: {
        type: 'string',
        enum: ['email', 'webhook', 'data-sync'],
        example: 'email',
      },
    //   payload: {
    //     type: 'object',
    //     additionalProperties: true,
    //     example: { subject: 'Digest', to: 'user@example.com' },
    //   },
    },
  },
  JobResponse: {
    type: 'object',
    properties: {
        id: { type: 'string', example: 'job_12345' },
        name: { type: 'string', example: 'Weekly Email' },
        cronExpression: { type: 'string', example: '0 9 * * 1' },
        description: { type: 'string', example: 'Sends weekly digest email' },
        type: { type: 'string', enum: ['email', 'webhook', 'data-sync'], example: 'email' },
        status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
        createdAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2023-10-01T12:00:00Z' },    
    },
    }
};
