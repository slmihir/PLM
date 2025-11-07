import { MCPServer } from '@virgio/mcp-core';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const server = new MCPServer(4002);
const handlers = server.getHandlers();

// Tools
handlers.registerTool(
  {
    name: 'review_product',
    description: 'Review a product submitted for tech spec review',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
      },
      required: ['productId'],
    },
  },
  async (args) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${args.productId}`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

handlers.registerTool(
  {
    name: 'define_size_specs',
    description: 'Define size specifications for a product',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        size: { type: 'string' },
        measurements: { type: 'object' },
      },
      required: ['productId', 'size', 'measurements'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/tech-packs/${args.productId}/size-specs`,
        {
          size: args.size,
          measurements: args.measurements,
        },
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

handlers.registerTool(
  {
    name: 'generate_tech_pack',
    description: 'Generate a tech pack PDF for a product',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        techSpecId: { type: 'string' },
      },
      required: ['productId', 'techSpecId'],
    },
  },
  async (args) => {
    try {
      // First create tech pack if it doesn't exist
      let techPack;
      try {
        const createResponse = await axios.post(
          `${API_BASE_URL}/api/products/${args.productId}/tech-packs`,
          { techSpecId: args.techSpecId },
        );
        techPack = createResponse.data;
      } catch (error: any) {
        // Tech pack might already exist, try to find it
        const listResponse = await axios.get(
          `${API_BASE_URL}/api/products/${args.productId}/tech-packs`,
        );
        techPack = listResponse.data[0];
      }

      // Generate PDF
      const pdfResponse = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/tech-packs/${techPack.id}/generate-pdf`,
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(pdfResponse.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

handlers.registerTool(
  {
    name: 'approve_for_pattern',
    description: 'Approve tech pack for pattern master',
    inputSchema: {
      type: 'object',
      properties: {
        techPackId: { type: 'string' },
      },
      required: ['techPackId'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/tech-packs/${args.techPackId}/approve`,
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

handlers.registerTool(
  {
    name: 'reject_with_feedback',
    description: 'Reject tech pack with feedback',
    inputSchema: {
      type: 'object',
      properties: {
        techPackId: { type: 'string' },
        feedback: { type: 'string' },
      },
      required: ['techPackId', 'feedback'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/tech-packs/${args.techPackId}/reject`,
        { feedback: args.feedback },
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.response?.data?.message || error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Resources
handlers.registerResource('pending-reviews:', async (uri) => {
  const techSpecId = uri.replace('pending-reviews:', '');
  const response = await axios.get(
    `${API_BASE_URL}/api/products/${techSpecId}/tech-packs/pending-reviews/${techSpecId}`,
  );
  return {
    uri,
    name: 'Pending Reviews',
    description: 'List of products pending tech spec review',
    mimeType: 'application/json',
  };
});

handlers.registerResource('product-details:', async (uri) => {
  const productId = uri.replace('product-details:', '');
  const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
  return {
    uri,
    name: `Product ${productId} Details`,
    description: 'Complete product details',
    mimeType: 'application/json',
  };
});

// Prompts
handlers.registerPrompt(
  'tech_spec_guidelines',
  {
    name: 'tech_spec_guidelines',
    description: 'Guidelines for tech spec review',
  },
  async () => {
    return `Tech Spec Review Guidelines:
1. Review all product details and components
2. Define size specifications for all sizes
3. Generate tech pack PDF
4. Approve or reject with feedback`;
  },
);

console.log('Tech Spec MCP Server running on ws://localhost:4002');

