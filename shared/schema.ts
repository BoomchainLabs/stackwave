import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  nonce: text("nonce").notNull(),
});

export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  creatorId: integer("creator_id").notNull(),
  status: text("status").notNull().default("active"), // active, executed, defeated
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  voterId: integer("voter_id").notNull(),
  support: boolean("support").notNull(), // true = for, false = against
  weight: numeric("weight").notNull(),
});

export const stakes = pgTable("stakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount").notNull(),
  stakedAt: timestamp("staked_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProposalSchema = createInsertSchema(proposals).omit({ id: true, createdAt: true, status: true, creatorId: true });
export const insertVoteSchema = createInsertSchema(votes).omit({ id: true, voterId: true, proposalId: true });
export const insertStakeSchema = createInsertSchema(stakes).omit({ id: true, stakedAt: true, userId: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type Stake = typeof stakes.$inferSelect;
export type InsertStake = z.infer<typeof insertStakeSchema>;

// Request types
export type CreateProposalRequest = InsertProposal;
export type CastVoteRequest = { proposalId: number, support: boolean, weight: string };
export type StakeRequest = { amount: string };

// Response types
export type ProposalResponse = Proposal;
export type VoteResponse = Vote;
export type StakeResponse = Stake;
export type UserResponse = User;

export interface AnalyticsResponse {
  riskScore: number;
  walletCluster: string;
  governanceEngagement: number;
  tokenVelocity: number;
}
