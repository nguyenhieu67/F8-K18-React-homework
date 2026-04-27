/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

interface Props {
  isStart: boolean;
  onStart: (isStart: boolean) => void;
  onReset: (isHasStarted: boolean) => void;
}

function HeaderBar({ isStart, onStart, onReset }: Props) {
  const timer = 600;
  const [remainingTime, setRemainingTime] = useState(timer);

  const onResetRef = useRef(onReset);

  useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  useEffect(() => {
    let intervalId: any;
    if (isStart) {
      intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            onResetRef.current(false);
            return timer;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStart]);

  const handleReset = () => {
    onReset(true);
    setRemainingTime(timer);
  };

  const min = String(Math.floor(remainingTime / 60)).padStart(2, "0");
  const second = String(remainingTime % 60).padStart(2, "0");

  return (
    <div className="bg-blue-500 p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl">Ôn Thi GPLX</p>
          <p className="text-sm">Đề thi ngẫu nhiên số 1</p>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <button
              className="cursor-pointer rounded-lg border border-solid border-b-indigo-400 p-1 hover:opacity-70"
              disabled={isStart}
              onClick={() => onStart(!isStart)}
            >
              Bắt đầu
            </button>
            <p>
              {min}
              {" : "}
              {second}
            </p>
          </div>
          {isStart ? (
            <button
              className="cursor-pointer rounded-lg border border-solid border-b-indigo-400 p-1 hover:opacity-70"
              onClick={handleReset}
            >
              Nộp bài
            </button>
          ) : (
            <button className="h-8 p-1"></button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
