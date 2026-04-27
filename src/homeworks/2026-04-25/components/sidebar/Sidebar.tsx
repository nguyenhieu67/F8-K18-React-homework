/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mui/material";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

import type { Question } from "../../utils/Type";

interface Props {
  questions: Question[];
  index: number;
  selectingOption: any;
  onPrev: () => void;
  onNext: () => void;
  onChoice: (idx: number) => void;
}

function Sidebar({
  questions,
  index,
  selectingOption,
  onPrev,
  onNext,
  onChoice,
}: Props) {
  const currentQuestionId = questions[index - 1]?.id;
  const isCurrentAnswered = selectingOption[currentQuestionId] !== undefined;

  return (
    <div className="flex flex-col items-center gap-5">
      <div>
        <Button variant="outlined" onClick={onPrev}>
          Prev
        </Button>
        <Button variant="outlined" sx={{ marginLeft: "16px" }} onClick={onNext}>
          Next
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {questions.map((question, idx) => {
          const isActive = index === question.id;

          return (
            <button
              key={question.id}
              className={`cursor-pointer rounded bg-cyan-500 p-2 text-white hover:bg-cyan-600 ${isActive ? "bg-cyan-600" : ""}`}
              onClick={() => onChoice(idx)}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <button className="flex items-center gap-1">
          {!isCurrentAnswered ? (
            <CheckBoxOutlinedIcon fontSize="small" color="info" />
          ) : (
            <CheckBoxOutlineBlankOutlinedIcon
              fontSize="small"
              color="disabled"
            />
          )}
          <span>Chưa trả lời</span>
        </button>
        <button className="flex items-center gap-1">
          {isCurrentAnswered ? (
            <CheckBoxOutlinedIcon fontSize="small" color="info" />
          ) : (
            <CheckBoxOutlineBlankOutlinedIcon
              fontSize="small"
              color="disabled"
            />
          )}
          <span>Đã trả lời</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
