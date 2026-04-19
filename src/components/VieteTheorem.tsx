import { Award, Hash } from 'lucide-react';

interface Result {
  a: number;
  b: number;
  c: number;
  type: 'linear' | 'quadratic';
  delta?: number;
  solutions: string[];
}

interface VieteTheoremProps {
  result: Result;
}

export default function VieteTheorem({ result }: VieteTheoremProps) {
  const { a, b, c, type, delta } = result;

  if (type !== 'quadratic' || (delta !== undefined && delta < 0)) {
    return null;
  }

  const S = -b / a;
  const P = c / a;

  const formatNum = (num: number) => {
    return parseFloat(num.toFixed(4)).toString();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-500" />
        Định lý Vi-ét & Tính chất
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Đối với phương trình bậc 2 có nghiệm, tổng và tích các nghiệm tuân theo hệ thức Vi-ét:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tổng nghiệm */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
            Tổng nghiệm (S = x₁ + x₂)
          </span>
          <div className="font-mono text-lg font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
            <span>S = -b / a =</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formatNum(S)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Formula: -({b}) / {a}</p>
        </div>

        {/* Tích nghiệm */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-slate-900 border border-purple-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mb-1">
            Tích nghiệm (P = x₁ · x₂)
          </span>
          <div className="font-mono text-lg font-bold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
            <span>P = c / a =</span>
            <span className="text-purple-600 dark:text-purple-400 font-extrabold">{formatNum(P)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Formula: {c} / {a}</p>
        </div>
      </div>

      {/* Dấu của nghiệm */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-150 dark:border-slate-700 text-xs flex items-start gap-2">
        <Hash className="w-4 h-4 text-emerald-500 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300">Tính chất nghiệm số: </span>
          {P > 0 && S > 0 && <span className="text-emerald-600 font-medium">Hai nghiệm dương phân biệt.</span>}
          {P > 0 && S < 0 && <span className="text-emerald-600 font-medium">Hai nghiệm âm phân biệt.</span>}
          {P < 0 && <span className="text-orange-600 font-medium">Hai nghiệm trái dấu.</span>}
          {P === 0 && <span className="text-blue-600 font-medium">Phương trình có ít nhất một nghiệm bằng 0.</span>}
        </div>
      </div>
    </div>
  );
}
