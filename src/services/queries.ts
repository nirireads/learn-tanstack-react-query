import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProduct,
  getProducts,
  getProjects,
  getTodos,
  getTodosIds,
} from "./api";
import { Product } from "../types/product";

export function useTodosIds() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodosIds,
    refetchOnWindowFocus: false,
  });
}

export function useTodos(ids: (number | undefined)[] | undefined) {
  return useQueries({
    queries: (ids ?? []).map((id) => {
      return {
        queryKey: ["todo", { id }],
        queryFn: () => getTodos(id!),
      };
    }),
  });
}

// export function useTodosIds(something: boolean) {
//   return useQuery({
//     queryKey: ["todos"],
//     queryFn: getTodosIds,
//     refetchOnWindowFocus: false,
//     enabled: something,
//   });
// }

export function useProjects(page: number) {
  return useQuery({
    queryKey: ["projects", { page }],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData,
  });
}

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParams) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParams + 1;
    },
    getPreviousPageParam: (_, __, firstPageParams) => {
      if (firstPageParams <= 1) {
        return undefined;
      }
      return firstPageParams + 1;
    },
  });
}

export function useProduct(id: number | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id, //return boolean if id is thre
    placeholderData: () => {
      const cachedProducts = (
        queryClient.getQueryData(["products"]) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);

      if (cachedProducts) {
        return cachedProducts.find((item) => item.id === id);
      }
    },
  });
}
