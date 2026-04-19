import { useState, useEffect } from 'react';
import Header from './components/Header';
import Solver from './components/Solver';
import GraphView from './components/GraphView';
import ProjectileSimulation from './components/ProjectileSimulation';

interface Result {
  a: number;
  b: number;
  c: number;
  type: 'linear' | 'quadratic';
  delta?: number;
  solutions: string[];
  complex?: boolean;
  vertex?: { x: number; y: number };
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Lấy tùy chọn theme từ localStorage hoặc mặc định
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });

  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleCalculate = (res: Result) => {
    setResult(res);

    // Lưu vào lịch sử (tối đa 5 phép tính gần nhất, tránh trùng lặp liên tục)
    setHistory((prev) => {
      const isDuplicate = prev.some(
        (item) => item.a === res.a && item.b === res.b && item.c === res.c
      );
      if (isDuplicate) return prev;
      return [res, ...prev.slice(0, 4)];
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Toán Học Rất Thú Vị
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Khám phá đặc tính hình học, đại số của Phương trình bậc 2 (Quadratic Equations) qua tính toán số học nâng cao và đồ họa máy tính sống động.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột Trái - Giải Phương Trình */}
          <div className="lg:col-span-5 space-y-8">
            <Solver
              onCalculate={handleCalculate}
              history={history}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Cột Phải - Trực Quan Hóa Đồ Thị */}
          <div className="lg:col-span-7 space-y-6">
            {result && (
              <>
                <GraphView result={result} />
                <ProjectileSimulation result={result} />
              </>
            )}
          </div>
        </div>

        {/* Giáo dục thêm */}
        <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto text-sm text-slate-600 dark:text-slate-400">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Ôn tập kiến thức bổ sung</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Phương trình bậc 2 có dạng tổng quát <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ax² + bx + c = 0 (a ≠ 0)</span>.</li>
            <li>Đồ thị hàm số <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">y = ax² + bx + c</span> là một đường cong Parabol.</li>
            <li>Khi <span className="font-bold text-indigo-500">a &gt; 0</span>, parabol có bề lõm quay lên trên. Điểm thấp nhất là tọa độ đỉnh.</li>
            <li>Khi <span className="font-bold text-purple-500">a &lt; 0</span>, parabol có bề lõm hướng xuống dưới. Thường ứng dụng trong phân tích chuyển động đạn đạo.</li>
          </ul>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800 mt-12">
        Phát triển chuyên nghiệp với React, Tailwind CSS và Recharts.
      </footer>
    </div>
  );
}
