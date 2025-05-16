import { useEffect, useState } from 'react';

export function useProposalCountFromApi() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const apiUrl = `${
          import.meta.env.VITE_API_URL
        }/api/routes/daoRoute`.replace(/([^:]\/)\/+/g, '$1');
        const res = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Secret': import.meta.env.VITE_API_SECRET!,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch proposals');

        const proposals: { id: string; block: number }[] = await res.json();
        setCount(proposals.length);
      } catch (err: any) {
        console.error('❌ Error fetching proposal count', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { count, loading, error };
}
