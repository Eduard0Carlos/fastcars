import { useState, useEffect } from "react";

import "./styles.scss";

interface ITextToggleProps {
	text: string,
	value?: string,
	onActive?: (value: string) => void
	onDeactivate?: (value: string) => void
}

const TextToggle = (props: ITextToggleProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (isChecked && props.onActive)
      props.onActive(props.value ?? "");

    if (!isChecked && props.onDeactivate)
      props.onDeactivate(props.value ?? "");
  }, [isChecked]);

  return (
    <div className="text-toggle"
      style={{ backgroundColor: isChecked ? "#C42139" : "#333333" }}
      onClick={evento => {
        setIsChecked(isChecked ? false : true);
      }
      }>
      <h1>{props.text}</h1>
    </div>
  );
};

export default TextToggle;
