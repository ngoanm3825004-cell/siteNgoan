import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';

interface Result {
  a: number;
  b: number;
  c: number;
  type: 'linear' | 'quadratic';
  delta?: number;
  solutions: string[];
  vertex?: { x: number; y: number };
}

interface GraphViewProps {
  result: Result;
}

export default function GraphView({ result }: GraphViewProps) {
  const { a, b, c, vertex, type } = result;

  // Tính toán data cho đồ thị
  const generateGraphData = () => {
    const data = [];
    let startX = -10;
    let endX = 10;

    if (type === 'quadratic' && vertex) {
      startX = vertex.x - 8;
      endX = vertex.x + 8;
    }

    const step = (endX - startX) / 100;

    for (let i = 0; i <= 100; i++) {
      const x = startX + i * step;
      const y = a * x * x + b * x + c;

      // Giới hạn y không cho quá lớn hoặc nhỏ để đồ thị đẹp hơn
      if (Math.abs(y) < 1000) {
        data.push({
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(y.toFixed(2)),
        });
      }
    }

    return data;
  };

  const data = generateGraphData();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Đồ thị hàm số y = {a !== 0 ? `${a}x²` : ''}{b !== 0 ? `${b > 0 && a !== 0 ? '+' : ''}${b}x` : ''}{c !== 0 ? `${c > 0 && (a !== 0 || b !== 0) ? '+' : ''}${c}` : ''}
        </h2>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="x"
              type="number"
              domain={['auto', 'auto']}
              stroke="#94a3b8"
              fontSize={11}
            />
            <YAxis
              type="number"
              domain={['auto', 'auto']}
              stroke="#94a3b8"
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: 'none',
                borderRadius: '12px',
                color: '#f8fafc',
              }}
              labelFormatter={(label) => `x: ${label}`}
            />
            {/* Trục X và Trục Y */}
            <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1} />

            {/* Điểm đỉnh */}
            {type === 'quadratic' && vertex && (
              <ReferenceLine
                x={vertex.x}
                stroke="#a855f7"
                strokeDasharray="4 4"
                label={{ value: 'Đỉnh I', position: 'top', fill: '#a855f7', fontSize: 12 }}
              />
            )}

            <Line
              type="monotone"
              dataKey="y"
              stroke="url(#colorLine)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#6366f1' }}
            />
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
          Đường đồ thị
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 border-t border-dashed border-slate-600"></span>
          Các hệ trục tọa độ (X=0, Y=0)
        </div>
      </div>
    </div>
  );
}
