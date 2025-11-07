import { MCPServer } from '@virgio/mcp-core';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const server = new MCPServer(4003);
const handlers = server.getHandlers();

// Tools
handlers.registerTool(
  {
    name: 'receive_tech_pack',
    description: 'Receive and view an assigned tech pack',
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
      const response = await axios.get(
        `${API_BASE_URL}/api/products/${args.productId}/tech-packs/${args.techPackId}`,
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
    name: 'create_pattern',
    description: 'Create a pattern and assign Pattern ID',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        patternId: { type: 'string' },
        sketchId: { type: 'string' },
      },
      required: ['productId', 'patternId'],
    },
  },
  async (args) => {
    try {
      // Update sketch with pattern ID
      const sketchesResponse = await axios.get(
        `${API_BASE_URL}/api/products/${args.productId}/version-history`,
      );
      const latestSketch = sketchesResponse.data[0];
      
      // Update product sketch with pattern ID
      const response = await axios.patch(
        `${API_BASE_URL}/api/products/${args.productId}`,
        { patternId: args.patternId },
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ patternId: args.patternId, ...response.data }),
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
    name: 'assign_pattern_id',
    description: 'Assign a Pattern ID to a product sketch',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        sketchId: { type: 'string' },
        patternId: { type: 'string' },
      },
      required: ['productId', 'sketchId', 'patternId'],
    },
  },
  async (args) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/products/${args.productId}`,
        { patternId: args.patternId },
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
    name: 'update_bom_consumption',
    description: 'Update BOM with final consumption values after sample',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        fabricCode: { type: 'string' },
        finalConsumption: { type: 'number' },
        trimCode: { type: 'string' },
      },
      required: ['productId'],
    },
  },
  async (args) => {
    try {
      const product = await axios.get(`${API_BASE_URL}/api/products/${args.productId}`);
      
      if (args.fabricCode && args.finalConsumption) {
        // Find fabric link and update
        const fabricLink = product.data.fabrics.find(
          (f: any) => f.fabricCode === args.fabricCode,
        );
        if (fabricLink) {
          await axios.patch(
            `${API_BASE_URL}/api/products/${args.productId}/fabrics/${fabricLink.id}`,
            { finalConsumption: args.finalConsumption },
          );
        }
      }

      if (args.trimCode && args.finalConsumption) {
        // Find trim link and update
        const trimLink = product.data.trims.find((t: any) => t.trimCode === args.trimCode);
        if (trimLink) {
          await axios.patch(
            `${API_BASE_URL}/api/products/${args.productId}/trims/${trimLink.id}`,
            { finalConsumption: args.finalConsumption },
          );
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: 'BOM consumption updated successfully',
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
    name: 'mark_pattern_complete',
    description: 'Mark pattern creation as complete',
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
        status: 'pattern_in_progress',
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
handlers.registerResource('assigned-tech-packs:', async (uri) => {
  const patternMasterId = uri.replace('assigned-tech-packs:', '');
  // In real implementation, filter by assigned pattern master
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return {
    uri,
    name: 'Assigned Tech Packs',
    description: 'Tech packs assigned to pattern master',
    mimeType: 'application/json',
  };
});

// Prompts
handlers.registerPrompt(
  'pattern_creation_help',
  {
    name: 'pattern_creation_help',
    description: 'Help with pattern creation workflow',
  },
  async () => {
    return `Pattern Creation Workflow:
1. Receive tech pack using receive_tech_pack
2. Create pattern and assign Pattern ID using create_pattern
3. Update BOM consumption after sample using update_bom_consumption
4. Mark pattern complete using mark_pattern_complete`;
  },
);

console.log('Pattern Master MCP Server running on ws://localhost:4003');

