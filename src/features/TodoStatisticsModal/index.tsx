import React from 'react';
import styled from '@emotion/styled/macro';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { HiOutlineTrash } from 'react-icons/hi';

import { todoStatisticsModalOpenState, todoStatisticsState } from './atom';
import Modal from '../../components/Modal';
import { filteredTodoListState, selectedDateState, todoListState, Todo } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/date';

const Container = styled.div`
  width: 100vw;
  max-width: 386px;
  padding: 8px;
`;

const Date = styled.small`
  display: block;
  color: #C9C8CC;
`;

const TodoActionButton = styled.button<{ secondary?: boolean; }>`
  border: none;
  background-color: transparent;
  color: ${({ secondary }) => secondary && '#ff6b6b'};
  cursor: pointer;
`;

const TodoActions = styled.span`
  flex: 1 0 5%;
`;

const Content = styled.span`
  flex: 1 0 95%;
`;

const TodoItem = styled.li`
  width: 100%;
  display: flex;
  color: #C9C8CC;
  align-items: center;
  border-radius: 8px;
`;

const TodoList = styled.ul`
  list-style: circle;
  margin: 0;
  padding: 0;
  width: 100%;
  ${TodoItem} + ${TodoItem} {
    margin-top: 8px;
  }
`;

const Statistics = styled.p`
  color: #7047EB;
  font-size: 16px;
  font-weight: bold;
`;

const Card = styled.div`
  width: 100%;
  max-width: 370px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  box-sizing: border-box;
  background-color: #19181A;
  ${Date} + ${TodoList} {
    margin-top: 24px;
  }
;
`;

const TodoStatisticsModal: React.FC = () => {
  const todoList = useRecoilValue(todoListState);
  const selectedDate = useRecoilValue(selectedDateState);
  const isOpen = useRecoilValue(todoStatisticsModalOpenState);
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  const statistics = useRecoilValue(todoStatisticsState);

  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);
  const setTodoList = useSetRecoilState(todoListState);

  const handleClose = () => setTodoStatisticsModalOpen(false);

  const removeTodo = (todo: Todo) => {
    const nextTodoList = todoList[todo.date].filter(t => t.id !== todo.id);

    setTodoList({...todoList, [todo.date]: nextTodoList})
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Container>
        <Card>
          <Date>{getSimpleDateFormat(selectedDate)}</Date>
          <Statistics>할 일 {statistics.total - statistics.done}개 남음</Statistics>
          <TodoList>
            {
              filteredTodoList?.map(todo => (
                <TodoItem key={todo.id}>
                  <Content>{todo.content}</Content>
                  <TodoActions>
                    <TodoActionButton secondary onClick={() => removeTodo(todo)}>
                      <HiOutlineTrash />
                    </TodoActionButton>
                  </TodoActions>
                </TodoItem>
              ))
            }
          </TodoList>
        </Card>
      </Container>
    </Modal>
  )
}

export default TodoStatisticsModal;
