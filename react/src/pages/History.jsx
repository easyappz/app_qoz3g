import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { listGames } from '../api/chess';

const { Title } = Typography;

export default function History() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const data = await listGames({ page, limit });
      const items = Array.isArray(data.items) ? data.items : [];
      setDataSource(
        items.map((g) => ({
          key: g._id || g.id,
          id: g._id || g.id,
          startedAt: g.startedAt,
          difficulty: g.difficulty,
          playerColor: g.playerColor,
          result: g.result,
          status: g.status,
        }))
      );
      setPagination({ current: data.page || page, pageSize: data.limit || limit, total: data.total || items.length });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (v) => (
        <span data-easytag="id1-react/src/pages/History.jsx">{v ? dayjs(v).format('DD.MM.YYYY HH:mm') : '—'}</span>
      ),
    },
    {
      title: 'Сложность',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (v) => (
        <Tag data-easytag="id2-react/src/pages/History.jsx">{v === 'expert' ? 'Эксперт' : v === 'medium' ? 'Средний' : 'Новичок'}</Tag>
      ),
    },
    {
      title: 'Цвет',
      dataIndex: 'playerColor',
      key: 'playerColor',
      render: (v) => <Tag data-easytag="id3-react/src/pages/History.jsx">{v === 'black' ? 'Черные' : 'Белые'}</Tag>,
    },
    {
      title: 'Результат',
      dataIndex: 'result',
      key: 'result',
      render: (v) => <span data-easytag="id4-react/src/pages/History.jsx">{v || '—'}</span>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (v) => (
        <Tag color={v === 'finished' ? 'green' : 'default'} data-easytag="id5-react/src/pages/History.jsx">{v === 'finished' ? 'Завершена' : 'В процессе'}</Tag>
      ),
    },
    {
      title: 'Действие',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/game/${record.id}`)} data-easytag="id6-react/src/pages/History.jsx">Открыть</Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto" data-easytag="id7-react/src/pages/History.jsx">
      <div className="mb-6" data-easytag="id8-react/src/pages/History.jsx">
        <Title level={2} className="!mb-0" data-easytag="id9-react/src/pages/History.jsx">История игр</Title>
      </div>

      <Card className="bg-white shadow" data-easytag="id10-react/src/pages/History.jsx">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
            onChange: (page) => fetchData(page, pagination.pageSize),
          }}
        />
      </Card>
    </div>
  );
}
