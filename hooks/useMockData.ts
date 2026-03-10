import { useState, useEffect } from 'react';
import initialData from '@/mockData.json';

export function useMockData() {
  const [data, setData] = useState<typeof initialData>(initialData);

  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(newData => {
        if (newData) setData(newData);
      })
      .catch(err => console.error('Failed to fetch latest data', err));
  }, []);

  return data;
}
