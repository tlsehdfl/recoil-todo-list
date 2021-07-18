import { atom, selector } from 'recoil';
import { filteredTodoListState } from "../TodoList/atom";

export const todoStatisticsModalOpenState = atom<boolean>({
  key: 'todoStatisticsModalOpenState',
  default: false
});

export const todoStatisticsState = selector({
  key: 'todoStatisticsState',
  get: ({ get }) => {
    const todoList = get(filteredTodoListState);

    return {
      total: todoList?.length || 0,
      done: todoList?.filter(todo => todo.done).length || 0
    }
  }
})
