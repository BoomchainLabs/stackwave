import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStaking() {
  return useQuery({
    queryKey: [api.staking.me.path],
    queryFn: async () => {
      const res = await fetch(api.staking.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch staking data");
      return api.staking.me.responses[200].parse(await res.json());
    },
  });
}

export function useStake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (amount: string) => {
      const validated = api.staking.stake.input.parse({ amount });
      const res = await fetch(api.staking.stake.path, {
        method: api.staking.stake.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to stake tokens");
      return api.staking.stake.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.staking.me.path] });
    },
  });
}
