import { atom, selector } from 'recoil';

import { getSimpleDateFormat } from '../../utils/date';

export interface Todo {
  id: number;
  done: boolean;
  content: string;
  date: string;
}

export interface TodoList {
  [date: string]: Array<Todo>;
}

export const todoListState = atom<TodoList>({
  key: 'todoListState',
  default: {}
});

export const selectedDateState = atom<Date>({
  key: 'selectedDateState',
  default: new Date()
});

export const selectedTodoState = atom<Todo | null>({
  key: 'selectedTodoState',
  default: null
});

export const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const selectedDate = get(selectedDateState);
    const todoList = get(todoListState);

    return todoList[getSimpleDateFormat(selectedDate)];
  }
});
