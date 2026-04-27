import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";

interface Props {
  option: string;
  index: number;
  isSelected: boolean;
  onSelect: (optionIndex: number) => void;
}

function Option({ option, index, isSelected, onSelect }: Props) {
  const handleSelect = () => {
    onSelect(index);
  };

  return (
    <div
      className="mt-2 flex w-fit cursor-pointer items-center gap-2"
      onClick={handleSelect}
    >
      {isSelected ? (
        <RadioButtonCheckedRoundedIcon fontSize="small" color="info" />
      ) : (
        <RadioButtonUncheckedRoundedIcon fontSize="small" />
      )}
      <span className={` ${isSelected ? "font-medium text-[#0288d1]" : ""}`}>
        {option}
      </span>
    </div>
  );
}

export default Option;
