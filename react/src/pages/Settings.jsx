import React, { useEffect, useState } from 'react';
import { Card, Select, Button, Typography, message, Space } from 'antd';

const { Title, Text } = Typography;

const difficultyOptions = [
  { label: 'Новичок', value: 'beginner' },
  { label: 'Средний', value: 'medium' },
  { label: 'Эксперт', value: 'expert' },
];

const colorOptions = [
  { label: 'Белые', value: 'white' },
  { label: 'Черные', value: 'black' },
];

export default function Settings() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [playerColor, setPlayerColor] = useState('white');

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('defaultDifficulty');
    const savedColor = localStorage.getItem('defaultColor');
    if (savedDifficulty) setDifficulty(savedDifficulty);
    if (savedColor) setPlayerColor(savedColor);
  }, []);

  const onSave = () => {
    localStorage.setItem('defaultDifficulty', difficulty);
    localStorage.setItem('defaultColor', playerColor);
    message.success('Настройки сохранены');
  };

  return (
    <div className="max-w-3xl mx-auto" data-easytag="id1-react/src/pages/Settings.jsx">
      <div className="mb-6" data-easytag="id2-react/src/pages/Settings.jsx">
        <Title level={2} className="!mb-1" data-easytag="id3-react/src/pages/Settings.jsx">Настройки</Title>
        <Text type="secondary" data-easytag="id4-react/src/pages/Settings.jsx">Выберите значения по умолчанию для новых партий</Text>
      </div>

      <Card className="bg-white shadow" data-easytag="id5-react/src/pages/Settings.jsx">
        <div className="space-y-4" data-easytag="id6-react/src/pages/Settings.jsx">
          <div className="flex flex-col gap-2" data-easytag="id7-react/src/pages/Settings.jsx">
            <label className="text-sm text-gray-600" data-easytag="id8-react/src/pages/Settings.jsx">Сложность по умолчанию</label>
            <Select
              value={difficulty}
              onChange={setDifficulty}
              options={difficultyOptions}
              size="large"
            />
          </div>

          <div className="flex flex-col gap-2" data-easytag="id9-react/src/pages/Settings.jsx">
            <label className="text-sm text-gray-600" data-easytag="id10-react/src/pages/Settings.jsx">Цвет игрока по умолчанию</label>
            <Select
              value={playerColor}
              onChange={setPlayerColor}
              options={colorOptions}
              size="large"
            />
          </div>

          <Space data-easytag="id11-react/src/pages/Settings.jsx">
            <Button type="primary" size="large" onClick={onSave} data-easytag="id12-react/src/pages/Settings.jsx">Сохранить</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
