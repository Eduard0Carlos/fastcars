import "./textbox.scss";

interface ITextBoxProperties {
	placeholder?: string,
	value?: string,
	onChange?: (value: string) => void,
	maxLength?: number,
	onlyNumbers?: boolean
	type?: "text" | "password" | "number"
}

const TextBox = (props: ITextBoxProperties) => {
  const onTyped = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange != undefined)
      props.onChange(event.target.value);
  };

  return (
    <input maxLength={props.maxLength} 
      onChange={onTyped} 
      value={props.value} 
      className="textbox" 
      type={!props.type ? (props.onlyNumbers ? "number" : "text") : props.type}
      placeholder={props.placeholder} />
  );
};

export default TextBox;