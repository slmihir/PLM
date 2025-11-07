import { MCPServer } from '@virgio/mcp-core';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const server = new MCPServer(4001);
const handlers = server.getHandlers();

// Tools
handlers.registerTool(
  {
    name: 'create_product',
    description: 'Create a new product with group ID and designer ID',
    inputSchema: {
      type: 'object',
      properties: {
        groupId: { type: 'string', description: 'Group ID for the product' },
        styleId: { type: 'string', description: 'Optional Style ID' },
        designerId: { type: 'string', description: 'Designer user ID' },
      },
      required: ['groupId', 'designerId'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/products`, args);
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
    name: 'link_fabric',
    description: 'Link a fabric to a product',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        fabricCode: { type: 'string' },
        isPrimary: { type: 'boolean' },
        estimatedConsumption: { type: 'number' },
      },
      required: ['productId', 'fabricCode', 'isPrimary'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/fabrics`,
        args,
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
    name: 'link_trim',
    description: 'Link a trim to a product',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        trimCode: { type: 'string' },
        isPrimary: { type: 'boolean' },
        estimatedConsumption: { type: 'number' },
      },
      required: ['productId', 'trimCode', 'isPrimary'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/trims`,
        args,
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
    name: 'upload_sketch',
    description: 'Upload a sketch file for a product',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        sketchFilePath: { type: 'string' },
      },
      required: ['productId', 'sketchFilePath'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products/${args.productId}/sketches`,
        { file: args.sketchFilePath },
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
    name: 'submit_for_review',
    description: 'Submit a product for tech spec review',
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
      const response = await axios.patch(`${API_BASE_URL}/api/products/${args.productId}`, {
        status: 'tech_review',
      });
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
handlers.registerResource('product:', async (uri) => {
  const productId = uri.replace('product:', '');
  const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
  return {
    uri,
    name: `Product ${productId}`,
    description: 'Product details',
    mimeType: 'application/json',
  };
});

handlers.registerResource('fabric-universe:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/fabrics`);
  return {
    uri: 'fabric-universe:',
    name: 'Fabric Universe',
    description: 'List of all available fabrics',
    mimeType: 'application/json',
  };
});

handlers.registerResource('trim-universe:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/trims`);
  return {
    uri: 'trim-universe:',
    name: 'Trim Universe',
    description: 'List of all available trims',
    mimeType: 'application/json',
  };
});

handlers.registerResource('color-universe:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/colors`);
  return {
    uri: 'color-universe:',
    name: 'Color Universe',
    description: 'List of all available colors',
    mimeType: 'application/json',
  };
});

// Prompts
handlers.registerPrompt(
  'product_creation_guide',
  {
    name: 'product_creation_guide',
    description: 'Guide for creating a new product',
  },
  async () => {
    return `To create a new product:
1. Use create_product with groupId and designerId
2. Link fabrics using link_fabric
3. Link trims using link_trim
4. Upload sketches using upload_sketch
5. Submit for review using submit_for_review`;
  },
);

handlers.registerPrompt(
  'component_selection_help',
  {
    name: 'component_selection_help',
    description: 'Help with selecting fabrics and trims',
  },
  async () => {
    return `To select components:
- Check fabric-universe: resource for available fabrics
- Check trim-universe: resource for available trims
- Check color-universe: resource for available colors
- Ensure components have sufficient inventory before linking`;
  },
);

console.log('Designer MCP Server running on ws://localhost:4001');

