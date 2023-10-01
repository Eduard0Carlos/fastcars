import { cn } from "lib/utils";
import "./styles.scss";

interface IConfirmButtonProps {
	text: string,
	onClick?: () => void,
	isSubmit?: boolean,
	className?: string
}

const ConfirmButton = ({ text, onClick, isSubmit, className }: IConfirmButtonProps) => {
  return (
    <button type={isSubmit ? "submit" : "button"}className={cn("confirm-button", className)} onClick={onClick}>
      <h1 className="backtext">{text.toUpperCase()}</h1>
      <h1>{text.toUpperCase()}</h1>
    </button>
  );
};

export default ConfirmButton;