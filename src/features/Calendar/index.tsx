import React, { useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import styled from '@emotion/styled/macro';

import TodoList from '../TodoList';
import { selectedDateState, selectedTodoState, todoListState, Todo } from '../TodoList/atom';
import { getSimpleDateFormat } from '../../utils/date';
import { todoFormModalOpenState } from '../TodoFormModal/atom';
import { todoStatisticsModalOpenState } from "../TodoStatisticsModal/atom";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  padding: 8px 24px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  color: #F8F7FA;
`;

const ArrowButton = styled.button<{ pos: 'left' | 'right' }>`
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  background-color: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #F8F7FA;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  padding-block: 12px;
  > tr {
    > th {
      padding-block: 12px;
      font-weight: normal;
      color: #F8F7FA;
    }
  }
`;

const TableBody = styled.tbody`
  > tr {
    > td {
      width: 128px;
      height: 128px;
      box-sizing: border-box;
    }
  }
`;

const DisplayDate = styled.div<{ isToday?: boolean; isSelected?: boolean; }>`
  color: ${({ isToday }) => isToday && '#F8F7FA'};
  background-color: ${({ isToday, isSelected }) => isSelected ? '#7047EB' : isToday ? '#313133' : ''};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  align-self: flex-end;
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
`;

const TableData = styled.td`
  text-align: center;
  color: #C9C8CC;
  padding: 8px;
  position: relative;
`;

const Base = styled.div`
  min-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  padding: 24px;
  height: calc(100vh - 48px);
  box-sizing: border-box;
  background-color: #28272A;
  ${Header} + ${Table} {
    margin-top: 36px;
  }
`;

const Container = styled.div``;

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Calendar: React.FC = () => {
  const todoList = useRecoilValue(todoListState);
  const selectedDate = useRecoilValue(selectedDateState);
  const selectedTodo = useRecoilValue(selectedTodoState);

  const setSelectedDate = useSetRecoilState(selectedDateState);
  const setTodoFormModalOpen = useSetRecoilState(todoFormModalOpenState);
  const setTodoList = useSetRecoilState(todoListState);
  const setTodoStatisticsModalOpen = useSetRecoilState(todoStatisticsModalOpenState);

  const { year, month, date, firstDay, lastDay } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();

    return ({
      year,
      month,
      date,
      firstDay: new Date(year, month, 1),
      lastDay: new Date(year, month + 1, 0)
    })
  }, [selectedDate]);

  const isToday = (d: Date) => {
    const today = new Date();

    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }

  const isHoliday = (d: Date) => {
    return [0, 6].includes(d.getDay());
  };

  const handleGoTo = (d: Date) => {
    setSelectedDate(d);
  }

  const handleTodoFormModalOpen = (d: number) => {
    setSelectedDate(new Date(selectedDate.setDate(d)));
    setTodoFormModalOpen(true);
  };

  const handleDateSelect = (d: number) => {
    setSelectedDate(new Date(selectedDate.setDate(d)));
  }

  const handleTodoStatisticsModalOpen = (event: React.SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setTodoStatisticsModalOpen(true);
  }

  const pad = () => [...Array(firstDay.getDay()).keys()].map((p: number) => <TableData key={`pad_${p}`} />);

  const range = () => [...Array(lastDay.getDate()).keys()].map((d: number) => (
    <TableData
      key={`date_${d}`}
      align="center"
      onDoubleClick={() => handleTodoFormModalOpen(d + 1)}
    >
      <Container>
        <DisplayDate
          isSelected={date === d + 1}
          isToday={isToday(new Date(year, month, d + 1))}
          onClick={() => handleDateSelect(d + 1)}
          onDoubleClick={handleTodoStatisticsModalOpen}
        >
          {d + 1}
        </DisplayDate>
        <TodoList
          items={todoList[getSimpleDateFormat(new Date(year, month, d + 1))] || []}
          date={new Date(year, month, d + 1)}
        />
      </Container>
    </TableData>
  ));

  const renderDays = () => {
    const items = [...pad(), ...range()];

    const weeks = Math.ceil(items.length / 7);

    return [...Array(weeks).keys()].map((week: number) => (
      <tr key={`week_${week}`}>
        {items.slice(week * 7, week * 7 + 7)}
      </tr>
    ));
  }

  useEffect(() => {
    const removeTodo = (todo: Todo) => {
      const nextTodoList = todoList[todo.date].filter(t => t.id !== todo.id);

      setTodoList({...todoList, [todo.date]: nextTodoList})
    }

    const onBackspaceKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        selectedTodo && removeTodo(selectedTodo);
      }
    };

    window.addEventListener('keydown', onBackspaceKeyDown);

    return () => {
      window.removeEventListener('keydown', onBackspaceKeyDown);
    }
  }, [selectedTodo]);

  return (
    <Base>
      <Header>
        <ButtonContainer>
          <ArrowButton pos="left" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            <BiChevronLeft />
          </ArrowButton>
          <Title>{`${MONTHS[month]} ${year}`}</Title>
          <ArrowButton pos="right" onClick={() => handleGoTo(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            <BiChevronRight />
          </ArrowButton>
        </ButtonContainer>
      </Header>
      <Table>
        <TableHeader>
          <tr>
            {
              DAYS.map((day, index) => (
                <th key={day} align="center">{day}</th>
              ))
            }
          </tr>
        </TableHeader>
        <TableBody>
          {renderDays()}
        </TableBody>
      </Table>
    </Base>
  )
}

export default Calendar;
