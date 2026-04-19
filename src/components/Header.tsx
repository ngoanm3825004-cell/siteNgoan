import { Sun, Moon, Calculator, GraduationCap } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-500/30">
          <Calculator className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            QuadraSolve Pro
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Phân tích & Giải Phương Trình Bậc 2 Chuyên Nghiệp
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm border border-slate-200/50 dark:border-slate-700/50">
          <GraduationCap className="w-4 h-4 text-indigo-500 mr-1" />
          <span>Học thuật & Trực quan</span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transition duration-200 border border-slate-200 dark:border-slate-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
}
