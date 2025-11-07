import { MCPServer } from '@virgio/mcp-core';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const server = new MCPServer(4004);
const handlers = server.getHandlers();

// Tools
handlers.registerTool(
  {
    name: 'add_fabric',
    description: 'Add a new fabric to the universe',
    inputSchema: {
      type: 'object',
      properties: {
        fabricCode: { type: 'string' },
        composition: { type: 'string' },
        washCare: { type: 'string' },
        cost: { type: 'number' },
        fabricType: { type: 'string' },
        leadTime: { type: 'number' },
        inventoryQty: { type: 'number' },
        lowStockThreshold: { type: 'number' },
      },
      required: ['fabricCode', 'composition', 'washCare', 'cost', 'fabricType'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/universe/fabrics`, args);
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
    name: 'add_trim',
    description: 'Add a new trim to the universe',
    inputSchema: {
      type: 'object',
      properties: {
        trimCode: { type: 'string' },
        material: { type: 'string' },
        nomenclature: { type: 'string' },
        cost: { type: 'number' },
        leadTime: { type: 'number' },
        inventoryQty: { type: 'number' },
        lowStockThreshold: { type: 'number' },
      },
      required: ['trimCode', 'material', 'nomenclature', 'cost'],
    },
  },
  async (args) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/universe/trims`, args);
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
    name: 'update_inventory',
    description: 'Update inventory quantity for fabric or trim',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['fabric', 'trim'] },
        code: { type: 'string' },
        quantity: { type: 'number' },
      },
      required: ['type', 'code', 'quantity'],
    },
  },
  async (args) => {
    try {
      const endpoint =
        args.type === 'fabric'
          ? `${API_BASE_URL}/api/universe/fabrics/${args.code}/inventory`
          : `${API_BASE_URL}/api/universe/trims/${args.code}/inventory`;
      
      const response = await axios.post(endpoint, { quantity: args.quantity });
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
    name: 'set_low_stock_threshold',
    description: 'Set low stock threshold for fabric or trim',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['fabric', 'trim'] },
        code: { type: 'string' },
        threshold: { type: 'number' },
      },
      required: ['type', 'code', 'threshold'],
    },
  },
  async (args) => {
    try {
      const endpoint =
        args.type === 'fabric'
          ? `${API_BASE_URL}/api/universe/fabrics/${args.code}`
          : `${API_BASE_URL}/api/universe/trims/${args.code}`;
      
      const response = await axios.patch(endpoint, {
        lowStockThreshold: args.threshold,
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

handlers.registerTool(
  {
    name: 'check_availability',
    description: 'Check availability and inventory status',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['fabric', 'trim'] },
        code: { type: 'string' },
      },
      required: ['type', 'code'],
    },
  },
  async (args) => {
    try {
      const endpoint =
        args.type === 'fabric'
          ? `${API_BASE_URL}/api/universe/fabrics/${args.code}`
          : `${API_BASE_URL}/api/universe/trims/${args.code}`;
      
      const response = await axios.get(endpoint);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              code: args.code,
              inventoryQty: response.data.inventoryQty,
              lowStockThreshold: response.data.lowStockThreshold,
              isLowStock: response.data.inventoryQty <= response.data.lowStockThreshold,
            }),
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
handlers.registerResource('fabric-universe:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/fabrics`);
  return {
    uri: 'fabric-universe:',
    name: 'Fabric Universe',
    description: 'Complete fabric universe',
    mimeType: 'application/json',
  };
});

handlers.registerResource('trim-universe:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/trims`);
  return {
    uri: 'trim-universe:',
    name: 'Trim Universe',
    description: 'Complete trim universe',
    mimeType: 'application/json',
  };
});

handlers.registerResource('inventory-status:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/inventory/low-stock-alerts`);
  return {
    uri: 'inventory-status:',
    name: 'Inventory Status',
    description: 'Current inventory status and low stock alerts',
    mimeType: 'application/json',
  };
});

handlers.registerResource('low-stock-alerts:', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/universe/inventory/low-stock-alerts`);
  return {
    uri: 'low-stock-alerts:',
    name: 'Low Stock Alerts',
    description: 'All low stock alerts',
    mimeType: 'application/json',
  };
});

// Prompts
handlers.registerPrompt(
  'inventory_management_help',
  {
    name: 'inventory_management_help',
    description: 'Help with inventory management',
  },
  async () => {
    return `Inventory Management:
1. Add fabrics/trims using add_fabric/add_trim
2. Update inventory using update_inventory
3. Set thresholds using set_low_stock_threshold
4. Check availability using check_availability
5. Monitor low stock alerts via low-stock-alerts: resource`;
  },
);

console.log('Sourcing MCP Server running on ws://localhost:4004');

