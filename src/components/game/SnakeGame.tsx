import Style from '@/styles/components/SnakeGame.module.scss';
import { useEffect, useState } from 'react';

/** 
 * Création de la grille 
  * @param rows Nombre de lignes
  * @param cols Nombre de colonnes
  * @return grille
*/

const createGrid = (rows: number, cols: number) => {
  const grid = []; // Grille
  for (let i = 0; i < rows; i++) { // Pour chaque ligne
    const row = []; // Ligne
    for (let j = 0; j < cols; j++) { // Pour chaque colonne
      row.push({ snake: false, food: false }); // Ajout d'une case
    } 
    grid.push(row); // Ajout de la ligne
  }
  return grid;
};

/**
 * @param score Score
 * @param setScore Fonction pour mettre à jour le score
 * @return Composant SnakeGame
 */
export default function SnakeGame({score, setScore}: {score: number, setScore: (value: number) => void}) {

  const [grid, setGrid] = useState(createGrid(16, 28)); // Création de la grille
  const [direction, setDirection] = useState({ dx: 1, dy: 0 }); // Direction du serpent
  const [snake, setSnake] = useState([{ x: 0, y: 8 }]); // Position du serpent
  const [food, setFood] = useState<{ x: number; y: number;} | null>(null); // Position de la nourriture

  /**
   * UseEffect pour la mise à jour de la direction au Keydown
   * @param event Event
   * @return Mise à jour de la direction
   */
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

  /**
   * UseEffect pour la mise à jour de la nourriture
   */
  useEffect(() => {
    if (food === null || (snake[0].x === food.x && snake[0].y === food.y)) { // Si la nourriture est mangée
      let newFood = { x: Math.floor(Math.random() * 16), y: Math.floor(Math.random() * 28) }; // Nouvelle position de la nourriture
      while (snake.some(s => s.x === newFood.x && s.y === newFood.y)) { // Si la nouvelle position de la nourriture est sur le serpent
        newFood = { x: Math.floor(Math.random() * 16), y: Math.floor(Math.random() * 28) }; // Nouvelle position de la nourriture
      }
      setFood(newFood); // Mise à jour de la nourriture
    }
  }, [food, snake]);

  /**
   * UseEffect pour la mise à jour du serpent
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const newSnake = [...snake]; // Copie du serpent
      const head = { ...newSnake[0] }; // Copie de la tête du serpent
      head.x += direction.dx; // Mise à jour de la position x de la tête
      head.y += direction.dy; // Mise à jour de la position y de la tête

      if (head.x < 0 || head.x >= 28 || head.y < 0 || head.y >= 16) { // Si le serpent sort de la grille
        clearInterval(interval); // Arrêt du jeu
        return;
      }

      newSnake.unshift(head); // Ajout de la tête du serpent

      if (grid[head.y][head.x].food) { // Si la tête du serpent est sur la nourriture
        setFood(null); // Suppression de la nourriture
        setScore(score + 1); // Mise à jour du score
      } else { // Si la tête du serpent n'est pas sur la nourriture
        newSnake.pop(); // Suppression de la queue du serpent
      }

      const newGrid = createGrid(16, 28); // Création d'une nouvelle grille
      newSnake.forEach((segment) => { // Mise à jour de la position du serpent
        newGrid[segment.y][segment.x].snake = true; // Mise à jour de la position du serpent
      }); 
      if (food) { // Si la nourriture existe
        newGrid[food.x][food.y].food = true; // Mise à jour de la position de la nourriture
      }
      setSnake(newSnake); // Mise à jour du serpent
      setGrid(newGrid); // Mise à jour de la grille
    }, 50); // Vitesse du serpent (50ms Minimum)

    return () => {
      clearInterval(interval); 
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