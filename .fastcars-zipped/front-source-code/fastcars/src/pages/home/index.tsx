import image from "assets/audi_car2.png";

import { useNavigate } from "react-router-dom";

import "./styles.scss";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="w-100 container-teste">
        <img className="home-container-image" src={image} />
        <div className="home-container-image-background">
          <div>
            <p>
              <strong>ENCONTRE</strong> o veículo ideal <br />
							para sua <strong>AVENTURA</strong>
            </p>
          </div>
          <div className="home-container-image-background-button">
            <p className="catalog-button" onClick={evento => navigate("/catalog")}>
							Confira os veículos disponíveis {">>>>>>"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;