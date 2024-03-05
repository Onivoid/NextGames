import Style from '@/styles/game/Canva.module.scss';
import { useEffect, useState } from 'react';

const createGrid = (rows: number, cols: number) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ snake: false, food: false });
    }
    grid.push(row);
  }
  return grid;
};

export default function Canva({score, setScore}: {score: number, setScore: (value: number) => void}) {

  const [grid, setGrid] = useState(createGrid(28, 28));
  const [direction, setDirection] = useState({ dx: 1, dy: 0 });
  const [snake, setSnake] = useState([{ x: 0, y: 8 }]);
  const [food, setFood] = useState<{ x: number; y: number;} | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
      switch (event.key) {
        case 'ArrowUp':
          if(direction.dy === 1) return;
          setDirection({ dx: 0, dy: -1 });
          break;
        case 'ArrowDown':
          if(direction.dy === -1) return;
          setDirection({ dx: 0, dy: 1 });
          break;
        case 'ArrowLeft':
          if(direction.dx === 1) return;
          setDirection({ dx: -1, dy: 0 });
          break;
        case 'ArrowRight':
          if(direction.dx === -1) return;
          setDirection({ dx: 1, dy: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (food === null || (snake[0].x === food.x && snake[0].y === food.y)) {
      let newFood = { x: Math.floor(Math.random() * 16), y: Math.floor(Math.random() * 28) };
      while (snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        newFood = { x: Math.floor(Math.random() * 16), y: Math.floor(Math.random() * 28) };
      }
      setFood(newFood);
    }
  }, [food, snake]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      head.x += direction.dx;
      head.y += direction.dy;

      if (head.x < 0 || head.x >= 28 || head.y < 0 || head.y >= 16) {
        clearInterval(intervalId);
        return;
      }

      newSnake.unshift(head);

      if (grid[head.y][head.x].food) {
        setFood(null);
        setScore(score + 1);
      } else {
        newSnake.pop();
      }

      const newGrid = createGrid(16, 28);
      newSnake.forEach((segment) => {
        newGrid[segment.y][segment.x].snake = true;
      });
      if (food) {
        newGrid[food.x][food.y].food = true;
      }
      setSnake(newSnake);
      setGrid(newGrid);
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [grid, direction, snake, food, score, setScore]);


  return (
    <div className={Style.container}>
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={cell.snake ? Style.snake : cell.food ? Style.food : Style.tile}
          />
        ))
      )}
    </div>
  );
}