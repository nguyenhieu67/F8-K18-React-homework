/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import HeaderBar from "./components/HeaderBar";
import Question from "./components/question/Questions";
import Sidebar from "./components/sidebar/Sidebar";
import type { SelectingOption } from "./utils/Type";

function Test45() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectingOption, setSelectingOption] = useState<SelectingOption>({});
  const [start, setStart] = useState(false);
  const [results, setResults] = useState<any>([]);

  const questions = useMemo(() => {
    return [
      {
        id: 1,
        text: "Trong React, hook nào được dùng để quản lý state?",
        options: ["useEffect", "useState", "useContext"],
        correct: "useState",
      },
      {
        id: 2,
        text: "Method nào dùng để format số giây thành 2 chữ số (vd: 05)?",
        options: ["slice()", "padStart()", "padEnd()"],
        correct: "padStart()",
      },
      {
        id: 3,
        text: "Class Tailwind nào dùng để tạo Grid layout 3 cột?",
        options: ["grid-cols-3", "flex-cols-3", "cols-3"],
        correct: "grid-cols-3",
      },
      {
        id: 4,
        text: "Trong Tailwind, class nào tạo khoảng cách giữa các phần tử Grid?",
        options: ["margin-4", "padding-4", "gap-4"],
        correct: "gap-4",
      },
      {
        id: 5,
        text: "Kết quả của '10' + 2 trong JavaScript là gì?",
        options: ["12", "102", "undefined"],
        correct: "102",
      },
      {
        id: 6,
        text: "TypeScript là gì?",
        options: [
          "Một thư viện UI",
          "Bản nâng cấp của JS có kiểu dữ liệu",
          "Một database",
        ],
        correct: "Bản nâng cấp của JS có kiểu dữ liệu",
      },
      {
        id: 7,
        text: "Trong Grid, class nào giúp một item chiếm 2 cột?",
        options: ["col-span-2", "grid-span-2", "span-cols-2"],
        correct: "col-span-2",
      },
      {
        id: 8,
        text: "Vite được sử dụng chủ yếu để làm gì?",
        options: [
          "Quản lý database",
          "Build và phát triển dự án nhanh",
          "Thiết kế giao diện",
        ],
        correct: "Build và phát triển dự án nhanh",
      },
      {
        id: 9,
        text: "Toán tử nào dùng để lấy số dư trong JavaScript?",
        options: ["/", "%", "#"],
        correct: "%",
      },
      {
        id: 10,
        text: "Class nào trong Tailwind giúp căn giữa item trong Grid?",
        options: ["place-items-center", "justify-center", "items-center"],
        correct: "place-items-center",
      },
      {
        id: 11,
        text: "Trong React, hook nào dùng để ghi nhớ giá trị tính toán để tối ưu hiệu năng?",
        options: ["useMemo", "useCallback", "useRef"],
        correct: "useMemo",
      },
      {
        id: 12,
        text: "Class nào trong Tailwind CSS dùng để bo tròn các góc của phần tử?",
        options: ["circle", "rounded", "border-radius"],
        correct: "rounded",
      },
      {
        id: 13,
        text: "Trong JavaScript, method nào dùng để biến một chuỗi JSON thành Object?",
        options: ["JSON.stringify()", "JSON.toObject()", "JSON.parse()"],
        correct: "JSON.parse()",
      },
      {
        id: 14,
        text: "Để ẩn một phần tử nhưng vẫn giữ lại không gian của nó trong layout, ta dùng class nào?",
        options: ["hidden", "invisible", "opacity-0"],
        correct: "invisible",
      },
      {
        id: 15,
        text: "Trong React, component sẽ render lại khi nào?",
        options: [
          "Khi Props thay đổi",
          "Khi State thay đổi",
          "Cả hai đều đúng",
        ],
        correct: "Cả hai đều đúng",
      },
      {
        id: 16,
        text: "Keyword nào trong TypeScript dùng để đánh dấu một thuộc tính là không bắt buộc?",
        options: ["!", "?", "*"],
        correct: "?",
      },
      {
        id: 17,
        text: "Class Tailwind nào dùng để làm cho một phần tử cố định khi cuộn trang?",
        options: ["static", "absolute", "fixed"],
        correct: "fixed",
      },
      {
        id: 18,
        text: "Trong JavaScript, mảng [1, 2, 3].map(x => x * 2) sẽ trả về kết quả gì?",
        options: ["[1, 2, 3]", "[2, 4, 6]", "6"],
        correct: "[2, 4, 6]",
      },
      {
        id: 19,
        text: "Để tạo hiệu ứng chuyển động mượt mà trong Tailwind, ta thường dùng class nào bắt đầu bằng?",
        options: ["animate-", "transition-", "move-"],
        correct: "transition-",
      },
      {
        id: 20,
        text: "Hook nào dùng để truy cập trực tiếp vào DOM node trong React?",
        options: ["useState", "useDOM", "useRef"],
        correct: "useRef",
      },
    ];
  }, []);

  const selectingQuestion = questions[questionIndex];
  const selectingOptionRef = useRef(selectingOption);

  useEffect(() => {
    selectingOptionRef.current = selectingOption;
  }, [selectingOption]);

  const handleSelect = (optionIndex: number) => {
    setSelectingOption({
      ...selectingOption,
      [selectingQuestion.id]: optionIndex,
    });
  };

  const handlePrevQuestion = () => {
    if (questionIndex === 0) return;
    setQuestionIndex(questionIndex - 1);
  };

  const handleNextQuestion = () => {
    if (questionIndex === questions.length - 1) return;
    setQuestionIndex(questionIndex + 1);
  };

  const handleStart = () => {
    setStart(!start);
  };

  const handleReset = useCallback(
    (isSubmit: boolean) => {
      const currentOptions = selectingOptionRef.current;

      const finalResults = questions.map((q, index) => {
        const selectedIdx = currentOptions[q.id] as any;
        return {
          questionId: index + 1,
          questionText: q.text,
          userAnswer:
            selectedIdx !== undefined ? q.options[selectedIdx] : "Chưa trả lời",
          isCorrect: q.correct,
        };
      });

      if (!isSubmit) {
        alert("Đã hết giờ! Cám ơn bạn đã cố gắng hết sức.");
      } else {
        alert("Chúc mừng bạn đã hoàn thành tất cả câu hỏi.");
      }

      setStart(false);
      setResults(finalResults);
      setQuestionIndex(0);
      setSelectingOption({});
    },
    [questions],
  );

  const handleChoice = (idx: number) => {
    setQuestionIndex(idx);
  };

  return (
    <div>
      <HeaderBar isStart={start} onStart={handleStart} onReset={handleReset} />
      {start ? (
        <div className="mt-5 grid grid-cols-12">
          <div className="col-span-8">
            <Question
              question={questions[questionIndex]}
              index={questionIndex + 1}
              selectingIndex={selectingOption[selectingQuestion.id]}
              onSelect={handleSelect}
            />
          </div>
          <div className="col-span-4">
            <Sidebar
              questions={questions}
              index={questionIndex + 1}
              selectingOption={selectingOption}
              onPrev={handlePrevQuestion}
              onNext={handleNextQuestion}
              onChoice={handleChoice}
            />
          </div>
        </div>
      ) : results.length ? (
        <div className="mt-5 grid grid-cols-12">
          <div className="col-span-8">
            {results.map((item: any, index: number) => (
              <div key={index} className="mb-3 ml-4 flex flex-col">
                <div className="flex items-center gap-3">
                  <p className="rounded-lg bg-blue-500 px-2 py-1 text-white">
                    Câu {String(item.questionId).padStart(2, "0")}
                  </p>
                  <p>{item.questionText}</p>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <p>
                    <span className="mr-2 rounded-lg bg-cyan-500 px-2 py-1 text-white">
                      Câu trả lời
                    </span>{" "}
                    {item.userAnswer}
                  </p>
                  <p>
                    <span className="mr-2 rounded-lg bg-cyan-500 px-2 py-1 text-white">
                      Đáp án đúng
                    </span>{" "}
                    {item.isCorrect}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-4">
            <button
              className="cursor-pointer rounded-lg bg-emerald-500 p-3 text-white hover:opacity-70"
              onClick={() => setResults([])}
            >
              Làm lại
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center">
          Bạn đã sẵn sàng chưa? Nếu đã sẵn sàng hãy bấm nút bắt đầu.
        </p>
      )}
    </div>
  );
}

export default Test45;
