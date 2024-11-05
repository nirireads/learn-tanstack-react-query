import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, deleteTodo, updateTodo } from "./api";
import { Todo } from "../types/todo";

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      console.log("success");
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log("Error when creating todo ");
      } else {
        await queryClient.invalidateQueries({ queryKey: ["todos"] });
        // invalidate queris
      }
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: async (_, error, variable) => {
      if (error) {
        console.log("error updating data");
      } else {
        await queryClient.invalidateQueries({ queryKey: ["todos"] });
        await queryClient.invalidateQueries({
          queryKey: ["todo", { id: variable.id }],
        });
      }
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSettled: async (_, error) => {
      if (error) {
        console.log("error deleing data");
      } else {
        await queryClient.invalidateQueries({ queryKey: ["todos"] });
      }
    },
  });
}
