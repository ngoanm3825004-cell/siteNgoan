import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  RefreshCcw, 
  Info, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface EquationResult {
  delta: number;
  x1: number | null;
  x2: number | null;
  type: 'two_roots' | 'one_root' | 'no_roots' | 'linear' | 'invalid';
  steps: string[];
}

const App: React.FC = () => {
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('-3');
  const [c, setC] = useState<string>('2');

  const result = useMemo((): EquationResult => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      return { delta: 0, x1: null, x2: null, type: 'invalid', steps: [] };
    }

    if (numA === 0) {
      if (numB === 0) {
        return { delta: 0, x1: null, x2: null, type: 'invalid', steps: ['Phương trình vô lý hoặc vô số nghiệm.'] };
      }
      return { 
        delta: 0, 
        x1: -numC / numB, 
        x2: null, 
        type: 'linear', 
        steps: [`Hệ số a = 0, phương trình trở thành bậc nhất: ${numB}x + ${numC} = 0`] 
      };
    }

    const delta = numB * numB - 4 * numA * numC;
    const steps = [
      `Tính Δ = b² - 4ac = (${numB})² - 4(${numA})(${numC}) = ${delta}`
    ];

    if (delta > 0) {
      const x1 = (-numB + Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(delta)) / (2 * numA);
      steps.push(`Δ > 0, phương trình có 2 nghiệm phân biệt:`);
      steps.push(`x1 = (-b + √Δ) / 2a = ${x1.toFixed(4)}`);
      steps.push(`x2 = (-b - √Δ) / 2a = ${x2.toFixed(4)}`);
      return { delta, x1, x2, type: 'two_roots', steps };
    } else if (delta === 0) {
      const x = -numB / (2 * numA);
      steps.push(`Δ = 0, phương trình có nghiệm kép:`);
      steps.push(`x = -b / 2a = ${x.toFixed(4)}`);
      return { delta, x1: x, x2: null, type: 'one_root', steps };
    } else {
      steps.push(`Δ < 0, phương trình vô nghiệm trên tập số thực.`);
      return { delta, x1: null, x2: null, type: 'no_roots', steps };
    }
  }, [a, b, c]);

  const chartData = useMemo(() => {
    const numA = parseFloat(a) || 0;
    const numB = parseFloat(b) || 0;
    const numC = parseFloat(c) || 0;
    
    if (numA === 0 && numB === 0) return [];

    const vertexX = numA !== 0 ? -numB / (2 * numA) : 0;
    const range = 5;
    const points = [];
    
    for (let x = vertexX - range; x <= vertexX + range; x += 0.5) {
      points.push({
        x: parseFloat(x.toFixed(1)),
        y: parseFloat((numA * x * x + numB * x + numC).toFixed(2))
      });
    }
    return points;
  }, [a, b, c]);

  const resetFields = () => {
    setA('0');
    setB('0');
    setC('0');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4"
          >
            <Calculator size={16} />
            <span className="text-sm font-medium tracking-wider uppercase">Advanced Solver</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400"
          >
            QuadraSolve
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400 text-lg"
          >
            Giải và minh họa phương trình bậc hai $ax^2 + bx + c = 0$
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Info size={20} className="text-indigo-400" />
                  Nhập tham số
                </h2>
                <button 
                  onClick={resetFields}
                  className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Hệ số a', value: a, setter: setA, placeholder: 'Ví dụ: 1' },
                  { label: 'Hệ số b', value: b, setter: setB, placeholder: 'Ví dụ: -3' },
                  { label: 'Hệ số c', value: c, setter: setC, placeholder: 'Ví dụ: 2' },
                ].map((input, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">{input.label}</label>
                    <input
                      type="number"
                      value={input.value}
                      onChange={(e) => input.setter(e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-medium"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 italic text-center text-indigo-300">
                {a || 0}x² {parseFloat(b) >= 0 ? '+' : ''} {b || 0}x {parseFloat(c) >= 0 ? '+' : ''} {c || 0} = 0
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Main Result Card */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calculator size={120} />
              </div>

              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  Kết quả phân tích
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700/50">
                      <p className="text-sm text-slate-400 mb-1">Biệt thức Delta (Δ)</p>
                      <p className={`text-3xl font-bold ${result.delta > 0 ? 'text-emerald-400' : result.delta === 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {result.delta.toFixed(2)}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700/50">
                      <p className="text-sm text-slate-400 mb-1">Trạng thái nghiệm</p>
                      <p className="text-lg font-medium">
                        {result.type === 'two_roots' && '2 nghiệm phân biệt'}
                        {result.type === 'one_root' && 'Nghiệm kép'}
                        {result.type === 'no_roots' && 'Vô nghiệm (R)'}
                        {result.type === 'linear' && 'Phương trình bậc nhất'}
                        {result.type === 'invalid' && 'Dữ liệu không hợp lệ'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                    <div className="text-center">
                      {result.x1 !== null && (
                        <div className="mb-2">
                          <span className="text-slate-400 text-sm">x₁ = </span>
                          <span className="text-3xl font-bold text-white">{result.x1.toLocaleString()}</span>
                        </div>
                      )}
                      {result.x2 !== null && (
                        <div>
                          <span className="text-slate-400 text-sm">x₂ = </span>
                          <span className="text-3xl font-bold text-white">{result.x2.toLocaleString()}</span>
                        </div>
                      )}
                      {result.x1 === null && result.x2 === null && (
                        <div className="text-rose-400 flex flex-col items-center gap-2">
                          <AlertCircle size={40} />
                          <span className="font-semibold">Không có nghiệm thực</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Steps Section */}
                <div className="mt-8">
                  <button className="flex items-center gap-2 text-indigo-400 font-medium mb-4">
                    <ChevronRight size={18} />
                    Các bước giải chi tiết
                  </button>
                  <div className="space-y-3">
                    {result.steps.map((step, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        key={i} 
                        className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/30 border border-slate-700/30"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-slate-300 font-mono text-sm">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Section */}
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-400" />
                Biểu đồ hàm số
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="x" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <ReferenceLine y={0} stroke="#475569" />
                    <ReferenceLine x={0} stroke="#475569" />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      dot={false}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4 italic">
                Đồ thị mô phỏng hình dạng Parabol dựa trên các hệ số đã nhập
              </p>
            </div>
          </motion.div>
        </div>

        <footer className="mt-16 text-center text-slate-500 text-sm pb-8">
          <p>© 2024 QuadraSolve - Chuyên nghiệp & Chính xác</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
