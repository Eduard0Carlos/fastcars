import { cn } from "lib/utils";
import "./styles.scss";
import { ReactElement } from "react";

interface IVehicleCardIcon {
	icon: string,
	text: string,
	roundedIcon?: boolean
}

const VehicleCardIcon = ({ icon, text, roundedIcon }: IVehicleCardIcon) => {
  return (
    <div className="card-icon-row">
      <img src={icon} className={`card-icon-row-ico ${roundedIcon ? "circle" : ""}`} />
      <span className="card-icon-row-text">{text}</span>
    </div>
  );
};

interface IVehicleCardsStarsProps {
	stars: string[]
}

const VehicleCardStars = ({ stars }: IVehicleCardsStarsProps) => {
  return (
    <div className="card-stars">
      {stars.map((starIco, index) => <img key={index} className="card-stars-icon" src={starIco} />)}
    </div>
  );
};

interface IVehicleCardProps {
	id?: string,
	title?: string,
	image?: string,
	children?: React.ReactNode,
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id?: string) => void,
	className?: string,
	isDeactivate?: boolean,
	notClickable?: boolean
}

const VehicleCard = ({ id, title, image, children, onClick, className, isDeactivate, notClickable }: IVehicleCardProps) => {
  return (
    <button className={cn(`v2-card ${isDeactivate ? "black-and-white" : "active"} ${notClickable ? " notclickable" : ""}`, className)} type="button" onClick={(event) => { if (onClick) onClick(event, id);}}> 
      <img className="card-image" src={image} />
      <div className="card-title">
        {title}
      </div>
      {children}
    </button>
  );
};

export {
  VehicleCard,
  VehicleCardIcon,
  VehicleCardStars
};