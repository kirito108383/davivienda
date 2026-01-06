import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAccounts() {
  return useQuery({
    queryKey: [api.accounts.list.path],
    queryFn: async () => {
      const res = await fetch(api.accounts.list.path);
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return api.accounts.list.responses[200].parse(await res.json());
    },
  });
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: [api.accounts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.accounts.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch account");
      return api.accounts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useTransactions(accountId: number) {
  return useQuery({
    queryKey: [api.transactions.list.path, accountId],
    queryFn: async () => {
      const url = buildUrl(api.transactions.list.path, { accountId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
    enabled: !!accountId,
  });
}
