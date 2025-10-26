import React from 'react';
import { Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto" data-easytag="id1-react/src/pages/NotFound.jsx">
      <Card className="bg-white shadow text-center" data-easytag="id2-react/src/pages/NotFound.jsx">
        <Title level={2} data-easytag="id3-react/src/pages/NotFound.jsx">404</Title>
        <Paragraph data-easytag="id4-react/src/pages/NotFound.jsx">Страница не найдена</Paragraph>
        <Button type="primary" onClick={() => navigate('/')} data-easytag="id5-react/src/pages/NotFound.jsx">На главную</Button>
      </Card>
    </div>
  );
}
