import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useProposals() {
  return useQuery({
    queryKey: [api.proposals.list.path],
    queryFn: async () => {
      const res = await fetch(api.proposals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return api.proposals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string, description: string }) => {
      const validated = api.proposals.create.input.parse(data);
      const res = await fetch(api.proposals.create.path, {
        method: api.proposals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to create proposal");
      }
      return api.proposals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.proposals.list.path] });
    },
  });
}

export function useVotes(proposalId: number) {
  const url = buildUrl(api.votes.listByProposal.path, { proposalId });
  
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch votes");
      return api.votes.listByProposal.responses[200].parse(await res.json());
    },
    enabled: !!proposalId,
  });
}

export function useCastVote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ proposalId, support, weight }: { proposalId: number, support: boolean, weight: string }) => {
      const url = buildUrl(api.votes.cast.path, { proposalId });
      const validated = api.votes.cast.input.parse({ support, weight });
      
      const res = await fetch(url, {
        method: api.votes.cast.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to cast vote");
      return api.votes.cast.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      const url = buildUrl(api.votes.listByProposal.path, { proposalId: variables.proposalId });
      queryClient.invalidateQueries({ queryKey: [url] });
      queryClient.invalidateQueries({ queryKey: [api.proposals.list.path] });
    },
  });
}
