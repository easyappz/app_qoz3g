import React, { useEffect, useState } from 'react';
import { Card, Select, Button, Typography, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../api/chess';

const { Title, Paragraph, Text } = Typography;

const difficultyOptions = [
  { label: 'Новичок', value: 'beginner' },
  { label: 'Средний', value: 'medium' },
  { label: 'Эксперт', value: 'expert' },
];

const colorOptions = [
  { label: 'Белые', value: 'white' },
  { label: 'Черные', value: 'black' },
];

export default function Home() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('beginner');
  const [playerColor, setPlayerColor] = useState('white');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('defaultDifficulty');
    const savedColor = localStorage.getItem('defaultColor');
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedColor) setPlayerColor(savedColor);
  }, []);

  const onStart = async () => {
    try {
      setLoading(true);
      const payload = { difficulty, playerColor };
      const data = await createGame(payload);
      const game = data && data.game ? data.game : null;
      const id = game && (game._id || game.id);
      if (!id) {
        message.error('Не удалось создать игру: неизвестный ответ сервера');
        return;
      }
      message.success('Игра создана');
      navigate(`/game/${id}`);
    } catch (e) {
      message.error('Ошибка при создании игры');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto" data-easytag="id1-react/src/pages/Home.jsx">
      <div className="mb-6" data-easytag="id2-react/src/pages/Home.jsx">
        <Title level={2} className="!mb-2" data-easytag="id3-react/src/pages/Home.jsx">Шахматы против компьютера</Title>
        <Text type="secondary" data-easytag="id4-react/src/pages/Home.jsx">Классическая партия с выбором сложности и цвета. Интерфейс и фигуры в классическом стиле.</Text>
      </div>

      <Card className="bg-white shadow" data-easytag="id5-react/src/pages/Home.jsx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-easytag="id6-react/src/pages/Home.jsx">
          <div data-easytag="id7-react/src/pages/Home.jsx">
            <Typography data-easytag="id8-react/src/pages/Home.jsx">
              <Paragraph className="text-gray-700" data-easytag="id9-react/src/pages/Home.jsx">
                Начните новую партию против компьютера. Выберите удобный уровень сложности и цвет фигур. Результаты сохраняются и доступны в истории.
              </Paragraph>
            </Typography>
          </div>

          <div className="space-y-4" data-easytag="id10-react/src/pages/Home.jsx">
            <div className="flex flex-col gap-2" data-easytag="id11-react/src/pages/Home.jsx">
              <label className="text-sm text-gray-600" data-easytag="id12-react/src/pages/Home.jsx">Сложность</label>
              <Select
                value={difficulty}
                onChange={setDifficulty}
                options={difficultyOptions}
                size="large"
              />
            </div>

            <div className="flex flex-col gap-2" data-easytag="id13-react/src/pages/Home.jsx">
              <label className="text-sm text-gray-600" data-easytag="id14-react/src/pages/Home.jsx">Цвет фигур</label>
              <Select
                value={playerColor}
                onChange={setPlayerColor}
                options={colorOptions}
                size="large"
              />
            </div>

            <Space data-easytag="id15-react/src/pages/Home.jsx">
              <Button type="primary" size="large" onClick={onStart} loading={loading} data-easytag="id16-react/src/pages/Home.jsx">
                Начать партию
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
