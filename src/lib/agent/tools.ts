import { Type, FunctionDeclaration } from "@google/genai";

export type ActionClass = 'AUTO_EXECUTE' | 'REQUIRE_APPROVAL' | 'BLOCKED';

export interface ToolDefinition {
  name: string;
  description: string;
  category: string;
  actionClass: ActionClass;
  execute: (args: any) => Promise<any>;
  declaration: FunctionDeclaration;
}

export const tools: Record<string, ToolDefinition> = {
  // A. Browser / Web
  browser_extract_text: {
    name: 'browser_extract_text',
    description: 'Extract text content from a URL',
    category: 'Browser',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "browser_extract_text",
      description: "Extract text content from a URL",
      parameters: {
        type: Type.OBJECT,
        properties: { url: { type: Type.STRING } },
        required: ["url"]
      }
    },
    execute: async ({ url }) => {
      try {
        const startTime = Date.now();
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Basic HTML to text extraction
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const text = doc.body.textContent?.replace(/\s+/g, ' ').trim().substring(0, 2000) || "No content found";
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2) + "s";
        return { success: true, text, duration };
      } catch (error) {
        return { success: false, error: String(error), duration: "0s" };
      }
    }
  },
  
  // B. Desktop / Computer
  desktop_take_screenshot: {
    name: 'desktop_take_screenshot',
    description: 'Take a screenshot of the current desktop or application window',
    category: 'Desktop',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "desktop_take_screenshot",
      description: "Take a screenshot of the current desktop or application window",
      parameters: {
        type: Type.OBJECT,
        properties: { windowName: { type: Type.STRING } },
        required: []
      }
    },
    execute: async ({ windowName }) => {
      await new Promise(r => setTimeout(r, 1200));
      return { success: true, imageUrl: `https://picsum.photos/seed/${windowName || 'desktop'}/800/600`, duration: "1.2s" };
    }
  },

  // C. Shell / Server
  shell_run_command: {
    name: 'shell_run_command',
    description: 'Run a shell command on the server',
    category: 'Shell',
    actionClass: 'BLOCKED', // Destructive by default
    declaration: {
      name: "shell_run_command",
      description: "Run a shell command on the server",
      parameters: {
        type: Type.OBJECT,
        properties: { command: { type: Type.STRING } },
        required: ["command"]
      }
    },
    execute: async ({ command }) => {
      await new Promise(r => setTimeout(r, 1000));
      return { success: false, error: "Command execution blocked by safety policy", duration: "1.0s" };
    }
  },
  shell_read_logs: {
    name: 'shell_read_logs',
    description: 'Read system or application logs',
    category: 'Shell',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "shell_read_logs",
      description: "Read system or application logs",
      parameters: {
        type: Type.OBJECT,
        properties: { service: { type: Type.STRING }, lines: { type: Type.NUMBER } },
        required: ["service"]
      }
    },
    execute: async ({ service, lines }) => {
      await new Promise(r => setTimeout(r, 800));
      return { success: true, logs: `[INFO] ${service} started successfully.\n[INFO] Listening on port 8080.`, duration: "0.8s" };
    }
  },

  // D. Email
  email_send: {
    name: 'email_send',
    description: 'Send an email',
    category: 'Email',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "email_send",
      description: "Send an email",
      parameters: {
        type: Type.OBJECT,
        properties: { to: { type: Type.STRING }, subject: { type: Type.STRING }, body: { type: Type.STRING } },
        required: ["to", "subject", "body"]
      }
    },
    execute: async ({ to, subject, body }) => {
      await new Promise(r => setTimeout(r, 1200));
      return { success: true, message: `Email sent to ${to}`, duration: "1.2s" };
    }
  },

  // E. CRM
  crm_create_lead: {
    name: 'crm_create_lead',
    description: 'Create a lead in the CRM',
    category: 'CRM',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "crm_create_lead",
      description: "Create a lead in the CRM",
      parameters: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING }, email: { type: Type.STRING }, company: { type: Type.STRING } },
        required: ["name", "email"]
      }
    },
    execute: async ({ name, email, company }) => {
      await new Promise(r => setTimeout(r, 1000));
      return { success: true, leadId: `LD-${Math.floor(Math.random() * 10000)}`, duration: "1.0s" };
    }
  },

  // F. Social
  social_draft_post: {
    name: 'social_draft_post',
    description: 'Draft a social media post',
    category: 'Social',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "social_draft_post",
      description: "Draft a social media post",
      parameters: {
        type: Type.OBJECT,
        properties: { platform: { type: Type.STRING }, content: { type: Type.STRING } },
        required: ["platform", "content"]
      }
    },
    execute: async ({ platform, content }) => {
      await new Promise(r => setTimeout(r, 500));
      return { success: true, draftId: `DRF-${Math.floor(Math.random() * 1000)}`, status: "Drafted", duration: "0.5s" };
    }
  },
  social_publish_post: {
    name: 'social_publish_post',
    description: 'Publish a social media post',
    category: 'Social',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "social_publish_post",
      description: "Publish a social media post",
      parameters: {
        type: Type.OBJECT,
        properties: { platform: { type: Type.STRING }, content: { type: Type.STRING } },
        required: ["platform", "content"]
      }
    },
    execute: async ({ platform, content }) => {
      await new Promise(r => setTimeout(r, 1500));
      return { success: true, postId: `POST-${Math.floor(Math.random() * 10000)}`, url: `https://${platform}.com/post/123`, duration: "1.5s" };
    }
  },

  // G. Cloud / DevOps
  cloud_deploy: {
    name: 'cloud_deploy',
    description: 'Deploy changes to production',
    category: 'Cloud',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "cloud_deploy",
      description: "Deploy changes to production",
      parameters: {
        type: Type.OBJECT,
        properties: { service: { type: Type.STRING }, version: { type: Type.STRING } },
        required: ["service", "version"]
      }
    },
    execute: async ({ service, version }) => {
      await new Promise(r => setTimeout(r, 3000));
      return { success: true, deploymentId: `DEP-${Math.floor(Math.random() * 10000)}`, status: "Deployed", duration: "3.0s" };
    }
  },
  
  // H. Docs / Reports
  generate_report: {
    name: 'generate_report',
    description: 'Generate a summary report',
    category: 'Docs',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "generate_report",
      description: "Generate a summary report",
      parameters: {
        type: Type.OBJECT,
        properties: { topic: { type: Type.STRING }, data: { type: Type.STRING } },
        required: ["topic"]
      }
    },
    execute: async ({ topic }) => {
      await new Promise(r => setTimeout(r, 2000));
      return { success: true, reportUrl: `/reports/${topic.replace(/\s+/g, '-').toLowerCase()}.pdf`, duration: "2.0s" };
    }
  },

  // I. File System
  fs_read_file: {
    name: 'fs_read_file',
    description: 'Read contents of a file',
    category: 'FileSystem',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "fs_read_file",
      description: "Read contents of a file",
      parameters: {
        type: Type.OBJECT,
        properties: { path: { type: Type.STRING } },
        required: ["path"]
      }
    },
    execute: async ({ path }) => {
      await new Promise(r => setTimeout(r, 300));
      return { success: true, content: `Simulated content of ${path}`, duration: "0.3s" };
    }
  },
  fs_write_file: {
    name: 'fs_write_file',
    description: 'Write contents to a file',
    category: 'FileSystem',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "fs_write_file",
      description: "Write contents to a file",
      parameters: {
        type: Type.OBJECT,
        properties: { path: { type: Type.STRING }, content: { type: Type.STRING } },
        required: ["path", "content"]
      }
    },
    execute: async ({ path, content }) => {
      await new Promise(r => setTimeout(r, 500));
      return { success: true, message: `Successfully wrote to ${path}`, bytesWritten: content.length, duration: "0.5s" };
    }
  },

  // J. API / Webhooks
  api_webhook_call: {
    name: 'api_webhook_call',
    description: 'Call an external API or webhook',
    category: 'API',
    actionClass: 'REQUIRE_APPROVAL',
    declaration: {
      name: "api_webhook_call",
      description: "Call an external API or webhook",
      parameters: {
        type: Type.OBJECT,
        properties: { 
          url: { type: Type.STRING }, 
          method: { type: Type.STRING }, 
          payload: { type: Type.STRING } 
        },
        required: ["url", "method"]
      }
    },
    execute: async ({ url, method, payload }) => {
      try {
        const startTime = Date.now();
        const options: RequestInit = {
          method: method.toUpperCase(),
          headers: { 'Content-Type': 'application/json' },
        };
        if (payload && ['POST', 'PUT', 'PATCH'].includes(options.method as string)) {
          options.body = typeof payload === 'string' ? payload : JSON.stringify(payload);
        }
        
        const response = await fetch(url, options);
        const data = await response.text();
        let parsedData;
        try { parsedData = JSON.parse(data); } catch { parsedData = data; }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2) + "s";
        return { success: response.ok, status: response.status, response: parsedData, duration };
      } catch (error) {
        return { success: false, error: String(error), duration: "0s" };
      }
    }
  },

  // K. Search
  search_query: {
    name: 'search_query',
    description: 'Search internal knowledge base or web',
    category: 'Search',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "search_query",
      description: "Search internal knowledge base or web",
      parameters: {
        type: Type.OBJECT,
        properties: { query: { type: Type.STRING }, source: { type: Type.STRING } },
        required: ["query"]
      }
    },
    execute: async ({ query }) => {
      try {
        const startTime = Date.now();
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        const results = data.query.search.map((r: any) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(r.snippet, 'text/html');
          return { title: r.title, snippet: doc.body.textContent };
        });
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2) + "s";
        return { success: true, results, duration };
      } catch (error) {
        return { success: false, error: String(error), duration: "0s" };
      }
    }
  },

  // L. Internal App
  internal_update_status: {
    name: 'internal_update_status',
    description: 'Update the status of an internal system or agent',
    category: 'Internal',
    actionClass: 'AUTO_EXECUTE',
    declaration: {
      name: "internal_update_status",
      description: "Update the status of an internal system or agent",
      parameters: {
        type: Type.OBJECT,
        properties: { systemId: { type: Type.STRING }, status: { type: Type.STRING } },
        required: ["systemId", "status"]
      }
    },
    execute: async ({ systemId, status }) => {
      await new Promise(r => setTimeout(r, 400));
      return { success: true, message: `System ${systemId} status updated to ${status}`, duration: "0.4s" };
    }
  }
};

export const getToolDeclarations = () => Object.values(tools).map(t => t.declaration);

export const validateProposal = (toolName: string, args: any): { decision: 'ALLOW' | 'STABILIZE' | 'BLOCK', reason: string } => {
  const tool = tools[toolName];
  if (!tool) {
    return { decision: 'BLOCK', reason: `Tool ${toolName} not found` };
  }

  switch (tool.actionClass) {
    case 'AUTO_EXECUTE':
      return { decision: 'ALLOW', reason: 'Safe read-only or draft action' };
    case 'REQUIRE_APPROVAL':
      return { decision: 'STABILIZE', reason: 'Requires operator confirmation' };
    case 'BLOCKED':
      return { decision: 'BLOCK', reason: 'Action class blocked by default policy' };
    default:
      return { decision: 'BLOCK', reason: 'Unknown action class' };
  }
};
