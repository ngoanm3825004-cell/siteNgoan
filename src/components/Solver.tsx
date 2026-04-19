import { useState, useEffect } from 'react';
import { RefreshCcw, Sparkles, BookOpen, Trash } from 'lucide-react';
import VieteTheorem from './VieteTheorem';

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

interface SolverProps {
  onCalculate: (result: Result) => void;
  history: Result[];
  onClearHistory: () => void;
}

export default function Solver({ onCalculate, history, onClearHistory }: SolverProps) {
  const [inputs, setInputs] = useState({ a: 1, b: -4, c: 3 });
  const [result, setResult] = useState<Result | null>(null);

  const calculate = (a: number, b: number, c: number) => {
    const type: 'linear' | 'quadratic' = a === 0 ? 'linear' : 'quadratic';
    let delta = 0;
    let solutions: string[] = [];
    let complex = false;
    let vertex = { x: 0, y: 0 };

    if (type === 'linear') {
      if (b === 0) {
        if (c === 0) {
          solutions = ['Phương trình có vô số nghiệm (0 = 0)'];
        } else {
          solutions = [`Phương trình vô nghiệm (0 = ${c} - Vô lý)`];
        }
      } else {
        const x = -c / b;
        solutions = [`Nghiệm duy nhất: x = ${x.toFixed(4).replace(/\.?0+$/, '')}`];
      }
    } else {
      delta = b * b - 4 * a * c;
      vertex = {
        x: -b / (2 * a),
        y: -delta / (4 * a),
      };

      if (a + b + c === 0) {
        const x2 = c / a;
        solutions = [
          `Nhận xét: a + b + c = ${a} + (${b}) + (${c}) = 0`,
          `Nghiệm x₁ = 1`,
          `Nghiệm x₂ = c / a = ${x2.toFixed(4).replace(/\.?0+$/, '')}`,
        ];
      } else if (a - b + c === 0) {
        const x2 = -c / a;
        solutions = [
          `Nhận xét: a - b + c = ${a} - (${b}) + (${c}) = 0`,
          `Nghiệm x₁ = -1`,
          `Nghiệm x₂ = -c / a = ${x2.toFixed(4).replace(/\.?0+$/, '')}`,
        ];
      } else {
        if (delta > 0) {
          const x1 = (-b + Math.sqrt(delta)) / (2 * a);
          const x2 = (-b - Math.sqrt(delta)) / (2 * a);
          solutions = [
            `x₁ = ${x1.toFixed(4).replace(/\.?0+$/, '')}`,
            `x₂ = ${x2.toFixed(4).replace(/\.?0+$/, '')}`,
          ];
        } else if (delta === 0) {
          const x = -b / (2 * a);
          solutions = [`Nghiệm kép: x = ${x.toFixed(4).replace(/\.?0+$/, '')}`];
        } else {
          complex = true;
          const realPart = -b / (2 * a);
          const imaginaryPart = Math.sqrt(-delta) / (2 * a);
          solutions = [
            `x₁ = ${realPart.toFixed(4).replace(/\.?0+$/, '')} + ${Math.abs(imaginaryPart).toFixed(4).replace(/\.?0+$/, '')}i`,
            `x₂ = ${realPart.toFixed(4).replace(/\.?0+$/, '')} - ${Math.abs(imaginaryPart).toFixed(4).replace(/\.?0+$/, '')}i`,
          ];
        }
      }
    }

    const calcResult: Result = { a, b, c, type, delta, solutions, complex, vertex };
    setResult(calcResult);
    onCalculate(calcResult);
  };

  useEffect(() => {
    calculate(inputs.a, inputs.b, inputs.c);
  }, [inputs.a, inputs.b, inputs.c]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  const getEquationDisplay = () => {
    const { a, b, c } = inputs;
    let eq = '';

    if (a !== 0) {
      if (a === 1) eq += 'x²';
      else if (a === -1) eq += '-x²';
      else eq += `${a}x²`;
    }

    if (b !== 0) {
      const sign = b > 0 ? (a !== 0 ? ' + ' : '') : ' - ';
      const absB = Math.abs(b);
      eq += `${sign}${absB === 1 ? '' : absB}x`;
    }

    if (c !== 0) {
      const sign = c > 0 ? (a !== 0 || b !== 0 ? ' + ' : '') : ' - ';
      eq += `${sign}${Math.abs(c)}`;
    }

    if (a === 0 && b === 0 && c === 0) {
      eq = '0';
    }

    return `${eq} = 0`;
  };

  const setExample = (exA: number, exB: number, exC: number) => {
    setInputs({ a: exA, b: exB, c: exC });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Nhập hệ số để giải
          </h2>
          <button
            onClick={() => setInputs({ a: 1, b: -4, c: 3 })}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition"
            title="Đặt lại"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['a', 'b', 'c'].map((coeff) => (
            <div key={coeff} className="relative">
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1 tracking-wider text-center">
                Hệ số {coeff}
              </label>
              <input
                type="number"
                name={coeff}
                value={inputs[coeff as keyof typeof inputs]}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-slate-100 text-center text-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center mb-6">
          <span className="text-xs text-slate-400 self-center">Ví dụ nhanh:</span>
          <button
            onClick={() => setExample(1, -4, 3)}
            className="px-2 py-1 bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950 text-xs text-indigo-600 dark:text-indigo-400 rounded-lg font-medium border border-indigo-100 dark:border-indigo-900/40 transition"
          >
            Có 2 nghiệm
          </button>
          <button
            onClick={() => setExample(1, -2, 1)}
            className="px-2 py-1 bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950 text-xs text-indigo-600 dark:text-indigo-400 rounded-lg font-medium border border-indigo-100 dark:border-indigo-900/40 transition"
          >
            Nghiệm kép
          </button>
          <button
            onClick={() => setExample(-1, 3, 2)}
            className="px-2 py-1 bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950 text-xs text-indigo-600 dark:text-indigo-400 rounded-lg font-medium border border-indigo-100 dark:border-indigo-900/40 transition"
          >
            Úp Parabol
          </button>
        </div>

        {/* Dynamic Equation Display */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px] rounded-2xl shadow-md">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-[14px] text-center">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">Dạng chuẩn đại số:</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-mono">
              {getEquationDisplay()}
            </p>
          </div>
        </div>
      </div>

      {/* Steps/Results Section */}
      {result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Phương pháp giải chi tiết
          </h2>

          <div className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            {result.type === 'linear' ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-150 dark:border-slate-700 space-y-2">
                <p className="text-amber-600 dark:text-amber-400">Vì a = 0, đây là phương trình bậc nhất:</p>
                <div className="font-mono bg-white dark:bg-slate-950 p-2.5 rounded-xl border dark:border-slate-800">
                  {inputs.b}x + {inputs.c} = 0
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 space-y-3">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 1. Biệt thức Delta (Δ):
                  </p>
                  <p className="font-mono font-bold mt-1 bg-white dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    Δ = b² - 4ac = ({inputs.b})² - 4({inputs.a})({inputs.c}) = <span className="text-indigo-600 dark:text-indigo-400 font-black">{result.delta}</span>
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> 2. Phân tích Δ:
                  </p>
                  {result.delta! > 0 ? (
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Δ &gt; 0: Hai nghiệm phân biệt thực thụ.</p>
                  ) : result.delta === 0 ? (
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">Δ = 0: Điểm tiếp xúc trực quan (nghiệm kép).</p>
                  ) : (
                    <p className="text-rose-500 dark:text-rose-400 font-semibold mt-1">Δ &lt; 0: Đồ thị không cắt trục Ox (Nghiệm ảo i).</p>
                  )}
                </div>
              </div>
            )}

            {/* Solutions List */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 space-y-2">
              <p className="text-slate-500 dark:text-slate-400">Tập nghiệm S:</p>
              {result.solutions.map((sol, index) => (
                <div key={index} className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400">
                  {sol}
                </div>
              ))}
            </div>

            {/* Vertex Info for Parabola */}
            {result.type === 'quadratic' && (
              <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-purple-700 dark:text-purple-400 block">Tọa độ đỉnh I:</span>
                  <p className="font-mono mt-1 font-bold">({result.vertex?.x.toFixed(2)}, {result.vertex?.y.toFixed(2)})</p>
                </div>
                <div>
                  <span className="font-semibold text-purple-700 dark:text-purple-400 block">Trục đối xứng:</span>
                  <p className="font-mono mt-1 font-bold">x = {result.vertex?.x.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Viète Component */}
      {result && <VieteTheorem result={result} />}

      {/* History panel */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Lịch sử tính toán</h3>
            <button
              onClick={onClearHistory}
              className="text-xs flex items-center gap-1 text-rose-500 hover:text-rose-600 transition"
            >
              <Trash className="w-3.5 h-3.5" /> Xóa lịch sử
            </button>
          </div>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => setInputs({ a: h.a, b: h.b, c: h.c })}
                className="w-full text-left p-3 text-xs font-mono rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/40 hover:bg-indigo-50 dark:hover:bg-slate-800 transition flex justify-between items-center"
              >
                <span>
                  ({h.a})x² + ({h.b})x + ({h.c}) = 0
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Nạp lại</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
