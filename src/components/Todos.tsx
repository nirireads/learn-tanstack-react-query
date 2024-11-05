// import { useIsFetching } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from "../services/mutations";
import { useTodos, useTodosIds } from "../services/queries";
import { Todo } from "../types/todo";

export default function Todos() {
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);
  //   const isFetching = useIsFetching();

  //   if (todosIdsQuery.isPending) {
  //   return <>loading...</>;
  //   }
  //   if (todosIdsQuery.isError) {
  //     return <>there is an error..</>;
  //   }

  const createTodoMutation = useCreateTodo();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const { register, handleSubmit } = useForm<Todo>();

  // update
  const updateTodoMutation = useUpdateTodo();

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  // delete
  const deleteTodoMutation = useDeleteTodo();
  const handleDeleteSubmit = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };
  return (
    <>
      {/* <p>Query function status:{todosIdsQuery.fetchStatus}</p>
      <p>Query data status:{todosIdsQuery.status}</p>
      <p>Global is fetching:{isFetching}</p> */}

      {/* {todosIdsQuery.data?.map((id) => (
        <p key={id}>id:{id}</p>
      ))} */}

      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New Todo</h4>
        <input placeholder="Title" {...register("title")} />
        <br />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={
            createTodoMutation.isPending ? "Submitting..." : "Submit Query"
          }
        />
      </form>

      <ul>
        {todosQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>Id:{data?.id}</div>
            <span>
              <strong>Title:</strong> {data?.title},
              <strong>Description:</strong> {data?.description}
            </span>
            <button
              onClick={() => handleMarkAsDoneSubmit(data)}
              disabled={data?.checked}
            >
              {data?.checked ? "Done" : "Mark as Done"}
            </button>

            {data && data.id && (
              <button onClick={() => handleDeleteSubmit(data.id!)}>
                delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );

  //   const { data, isPending, isError } = useTodosIds();
  //   if (isPending) <>loading...</>;
  //   if (isError) <>there is an error</>;

  //   return (
  //     <>
  //       {data?.map((id) => (
  //         <p key={id}>{id}</p>
  //       ))}
  //     </>
  //   );
}
