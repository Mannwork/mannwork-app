import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../queries/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}
