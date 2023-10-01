import star from "assets/Star.png";
import emptyStar from "assets/StarEmpty.png";
import location from "assets/Location.png";
import money from "assets/Money.png";
import IVehicle from "shared/interfaces/IVehicle";
import { ReactElement } from "react";

import "./styles.scss";

interface IVehicleCard {
	vehicle: IVehicle,
	onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, vehicle: IVehicle) => void,
	locationText?: string,
	priceText?: string
}

const VehicleCard = ({ vehicle, onClick, locationText, priceText }: IVehicleCard) => {

  const starsArray = [emptyStar, emptyStar, emptyStar, emptyStar, emptyStar];

  for (let index = 1; index <= vehicle.stars; index++) {
    starsArray.unshift(star);
    starsArray.pop();
  }

  return (
    <div className="card" onClick={(event) => onClick(event, vehicle)}>
      <img className="card-image" src={vehicle.image} />
      <div className="card-title">
        {vehicle.name}
      </div>
      <div className="card-stars">
        {starsArray.map((starIco, index) => <img key={index} className="card-stars-icon" src={starIco} />)}
      </div>
      <div className="card-location">
        <img src={location} className="card-location-icon" />
        {locationText ?? `À ${vehicle.location} - ${vehicle.city}, ${vehicle.uf}`}
      </div>
      <div className="card-price">
        <img src={money} className="card-price-icon" />
        {priceText ?? `R$ ${vehicle.price} p/ dia`}
      </div>
    </div>
  );
};

export default VehicleCard;