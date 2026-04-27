import type { Question } from "../../utils/Type";
import Option from "./Option";

interface Props {
  question: Question;
  index: number;
  selectingIndex: number | null;
  onSelect: (optionIndex: number) => void;
}

function Questions({ question, index, selectingIndex, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-blue-500 px-2 py-1 text-white">
          Câu {String(index).padStart(2, "0")}
        </span>
        <p className="text-lg font-medium">{question?.text}</p>
      </div>
      {question.options.map((option, index) => (
        <Option
          key={index}
          option={option}
          index={index}
          isSelected={selectingIndex === index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default Questions;
