import { z } from 'zod';
import { insertProposalSchema, proposals, votes, stakes, users } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    nonce: {
      method: 'GET' as const,
      path: '/api/auth/nonce' as const,
      responses: {
        200: z.object({ nonce: z.string() }),
      }
    },
    verify: {
      method: 'POST' as const,
      path: '/api/auth/verify' as const,
      input: z.object({ walletAddress: z.string(), signature: z.string() }),
      responses: {
        200: z.object({ user: z.custom<typeof users.$inferSelect>() }),
        401: errorSchemas.unauthorized,
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>().nullable(),
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      }
    }
  },
  proposals: {
    list: {
      method: 'GET' as const,
      path: '/api/proposals' as const,
      responses: { 200: z.array(z.custom<typeof proposals.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/proposals' as const,
      input: insertProposalSchema,
      responses: {
        201: z.custom<typeof proposals.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
  },
  votes: {
    listByProposal: {
      method: 'GET' as const,
      path: '/api/proposals/:proposalId/votes' as const,
      responses: { 200: z.array(z.custom<typeof votes.$inferSelect>()) }
    },
    cast: {
      method: 'POST' as const,
      path: '/api/proposals/:proposalId/votes' as const,
      input: z.object({ support: z.boolean(), weight: z.string() }),
      responses: {
        201: z.custom<typeof votes.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  },
  staking: {
    me: {
      method: 'GET' as const,
      path: '/api/staking/me' as const,
      responses: {
        200: z.object({ totalStaked: z.string(), stakes: z.array(z.custom<typeof stakes.$inferSelect>()) }),
        401: errorSchemas.unauthorized,
      }
    },
    stake: {
      method: 'POST' as const,
      path: '/api/staking' as const,
      input: z.object({ amount: z.string() }),
      responses: {
        201: z.custom<typeof stakes.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  },
  analytics: {
    get: {
      method: 'GET' as const,
      path: '/api/analytics' as const,
      responses: {
        200: z.object({
          riskScore: z.number(),
          walletCluster: z.string(),
          governanceEngagement: z.number(),
          tokenVelocity: z.number()
        }),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
