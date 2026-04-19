import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Target, Trophy, HelpCircle } from 'lucide-react';

interface Result {
  a: number;
  b: number;
  c: number;
  type: 'linear' | 'quadratic';
}

interface ProjectileSimulationProps {
  result: Result;
}

export default function ProjectileSimulation({ result }: ProjectileSimulationProps) {
  const { a, b, c } = result;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Game state
  const [gameMode, setGameMode] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [hit, setHit] = useState<boolean | null>(null);

  const isApplicable = a < 0;

  // Sinh mục tiêu ngẫu nhiên
  const generateTarget = () => {
    const randomX = 4 + Math.random() * 5; // x trong khoảng 4 đến 9
    const randomY = 1 + Math.random() * 5; // y trong khoảng 1 đến 6
    setTarget({ x: parseFloat(randomX.toFixed(2)), y: parseFloat(randomY.toFixed(2)) });
    setHit(null);
    setProgress(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (gameMode && !target) {
      generateTarget();
    }
  }, [gameMode]);

  useEffect(() => {
    let animationId: number;

    if (isPlaying && isApplicable) {
      animationId = requestAnimationFrame(function animate() {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            // Kiểm tra hit sau khi kết thúc animation
            if (gameMode && target) {
              checkCollision();
            }
            return 1;
          }
          return prev + 0.008; // Điều chỉnh tốc độ
        });
        animationId = requestAnimationFrame(animate);
      });
    }

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, isApplicable, gameMode, target]);

  const checkCollision = () => {
    if (!target) return;
    // Tìm y tại điểm target.x
    const expectedY = a * target.x * target.x + b * target.x + c;
    const diff = Math.abs(expectedY - target.y);
    if (diff <= 0.6) {
      setHit(true);
    } else {
      setHit(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!isApplicable) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Hãy đặt hệ số a < 0 để kích hoạt mô phỏng đạn đạo.',
        width / 2,
        height / 2
      );
      return;
    }

    // Xác định miền tọa độ X, Y
    let endX = 10;
    const delta = b * b - 4 * a * c;
    if (delta >= 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      const maxX = Math.max(x1, x2);
      if (maxX > 0) endX = Math.max(10, maxX + 1);
    }

    const maxYCalculated = -delta / (4 * a) > 0 ? -delta / (4 * a) + 2 : 10;

    const scaleX = (x: number) => (x / endX) * (width - 40) + 20;
    const scaleY = (y: number) => height - 25 - (y / Math.max(maxYCalculated, 8)) * (height - 50);

    // Vẽ mặt đất
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height - 25);
    ctx.lineTo(width, height - 25);
    ctx.stroke();

    // Vẽ mục tiêu trong chế độ Game
    if (gameMode && target) {
      const tx = scaleX(target.x);
      const ty = scaleY(target.y);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(tx, ty, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(tx, ty, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Vẽ quỹ đạo (đường nét đứt)
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * endX;
      const y = a * x * x + b * x + c;
      const yDraw = Math.max(-2, y);
      if (i === 0) ctx.moveTo(scaleX(x), scaleY(yDraw));
      else ctx.lineTo(scaleX(x), scaleY(yDraw));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Vẽ quả cầu ném đi
    const currentX = progress * endX;
    const currentY = a * currentX * currentX + b * currentX + c;

    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(scaleX(currentX), scaleY(Math.max(0, currentY)), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [a, b, c, progress, isApplicable, gameMode, target]);

  const handlePlay = () => {
    if (progress >= 1) setProgress(0);
    setIsPlaying(true);
    setHit(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500 animate-spin-slow" />
            Vật lý ném xiên Parabol
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chuyển động quỹ đạo parabol ứng dụng trong phân tích quân sự/thể thao.
          </p>
        </div>

        {isApplicable && (
          <div className="flex gap-2">
            <button
              onClick={() => setGameMode(!gameMode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition border flex items-center gap-1 ${
                gameMode
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              {gameMode ? 'Đang chơi thử thách' : 'Chơi thử thách'}
            </button>
          </div>
        )}
      </div>

      {gameMode && isApplicable && target && (
        <div className="mb-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-800/40 rounded-2xl flex flex-wrap justify-between items-center text-xs">
          <div>
            🎯 Mục tiêu tại tọa độ: <span className="font-mono font-bold">X={target.x}, Y={target.y}</span>
            <p className="text-slate-400 mt-1">Điều chỉnh a, b, c để đường bay trúng hồng tâm.</p>
          </div>
          <button
            onClick={generateTarget}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50"
          >
            Đổi mục tiêu
          </button>
        </div>
      )}

      <div className="relative flex justify-center items-center bg-slate-950 rounded-2xl overflow-hidden p-2 min-h-[220px]">
        <canvas ref={canvasRef} width={460} height={220} className="w-full h-auto" />
      </div>

      {isApplicable && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Khai hỏa
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setProgress(0);
                setHit(null);
              }}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Khởi động lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {hit !== null && gameMode && (
            <div className={`text-sm font-bold flex items-center gap-1.5 ${hit ? 'text-emerald-500' : 'text-red-500'}`}>
              {hit ? (
                <>
                  <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" /> Trúng đích hoàn hảo!
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-red-500" /> Trượt rồi, hãy chỉnh sửa a, b, c.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
