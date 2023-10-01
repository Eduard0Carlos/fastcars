import "./styles.scss";

interface IDropdownProps {
	onChange?: (value: string) => void,
	options: string[],
	placeholder?: string,
	size?: number,
	value?: string
}

const Dropdown = (props: IDropdownProps) => {
  const onTyped = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChange != undefined)
      props.onChange(event.target.value);
  };

  return (
    <select className="dropdown" 
      onChange={evento => onTyped(evento)}
      style={{ width: `${props.size}px` }}
      value={props.value}
    >
      <option value="">{props.placeholder}</option>
      {props.options.map(item => <option value={item} key={item}>{item}</option>)}
    </select>
  );
};

export default Dropdown;