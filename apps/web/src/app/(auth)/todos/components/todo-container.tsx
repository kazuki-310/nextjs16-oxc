import { getTodos } from "../data/todos";
import { TodoList } from "./todo-list";

export async function TodoContainer(): Promise<React.JSX.Element> {
  const todos = await getTodos();
  return <TodoList todos={todos} />;
}
