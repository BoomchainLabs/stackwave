import { db } from "./db";
import {
  users, proposals, votes, stakes,
  type InsertUser, type User,
  type InsertProposal, type Proposal,
  type InsertVote, type Vote,
  type InsertStake, type Stake
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProposals(): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;

  getVotesByProposal(proposalId: number): Promise<Vote[]>;
  castVote(vote: InsertVote): Promise<Vote>;

  getStakesByUser(userId: number): Promise<Stake[]>;
  createStake(stake: InsertStake): Promise<Stake>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals);
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const [proposal] = await db.insert(proposals).values(insertProposal).returning();
    return proposal;
  }

  async getVotesByProposal(proposalId: number): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.proposalId, proposalId));
  }

  async castVote(insertVote: InsertVote): Promise<Vote> {
    const [vote] = await db.insert(votes).values(insertVote).returning();
    return vote;
  }

  async getStakesByUser(userId: number): Promise<Stake[]> {
    return await db.select().from(stakes).where(eq(stakes.userId, userId));
  }

  async createStake(insertStake: InsertStake): Promise<Stake> {
    const [stake] = await db.insert(stakes).values(insertStake).returning();
    return stake;
  }
}

export const storage = new DatabaseStorage();
