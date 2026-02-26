import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const MemStore = MemoryStore(session);

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup basic session for SIWE mock
  app.use(session({
    secret: process.env.SESSION_SECRET || 'stackwave-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemStore({ checkPeriod: 86400000 }),
    cookie: { maxAge: 86400000 }
  }));

  // Auth mock middleware for SIWE
  app.get(api.auth.nonce.path, (req, res) => {
    const nonce = Math.random().toString(36).substring(2, 15);
    res.json({ nonce });
  });

  app.post(api.auth.verify.path, async (req, res) => {
    try {
      const { walletAddress } = api.auth.verify.input.parse(req.body);
      let user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress, nonce: Math.random().toString() });
      }
      req.session.userId = user.id;
      res.json({ user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }
    const user = await storage.getUser(req.session.userId);
    res.json(user || null);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Proposals
  app.get(api.proposals.list.path, async (req, res) => {
    const proposals = await storage.getProposals();
    res.json(proposals);
  });

  app.post(api.proposals.create.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.proposals.create.input.parse(req.body);
      const proposal = await storage.createProposal({ ...input, creatorId: req.session.userId });
      res.status(201).json(proposal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Votes
  app.get(api.votes.listByProposal.path, async (req, res) => {
    const votes = await storage.getVotesByProposal(Number(req.params.proposalId));
    res.json(votes);
  });

  app.post(api.votes.cast.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.votes.cast.input.parse(req.body);
      const vote = await storage.castVote({
        proposalId: Number(req.params.proposalId),
        voterId: req.session.userId,
        support: input.support,
        weight: input.weight
      });
      res.status(201).json(vote);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Staking
  app.get(api.staking.me.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    const stakesList = await storage.getStakesByUser(req.session.userId);
    const totalStaked = stakesList.reduce((acc, s) => acc + Number(s.amount), 0).toString();
    res.json({ totalStaked, stakes: stakesList });
  });

  app.post(api.staking.stake.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.staking.stake.input.parse(req.body);
      const stake = await storage.createStake({
        userId: req.session.userId,
        amount: input.amount
      });
      res.status(201).json(stake);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics
  app.get(api.analytics.get.path, (req, res) => {
    // Return mock AI analytics
    res.json({
      riskScore: 24.5,
      walletCluster: "DeFi Power User",
      governanceEngagement: 87,
      tokenVelocity: 1.2
    });
  });

  // Seed DB with some dummy proposals for the MVP
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const proposals = await storage.getProposals();
  if (proposals.length === 0) {
    // Need a dummy user for creatorId
    let dummyUser = await storage.getUserByWalletAddress("0xDummyCreator1234567890abcdef1234567890");
    if (!dummyUser) {
      dummyUser = await storage.createUser({ walletAddress: "0xDummyCreator1234567890abcdef1234567890", nonce: "dummy" });
    }

    await storage.createProposal({
      title: "SIP-01: Increase Staking APY for Q4",
      description: "This proposal aims to increase the base staking APY from 10% to 15% to attract more liquidity ahead of the V2 launch.",
      creatorId: dummyUser.id,
      status: "active"
    });

    await storage.createProposal({
      title: "SIP-02: Fund StackWave Hackathon",
      description: "Allocate 500,000 SWAVE from the ecosystem treasury to fund the upcoming global AI Web3 Hackathon.",
      creatorId: dummyUser.id,
      status: "active"
    });
  }
}
