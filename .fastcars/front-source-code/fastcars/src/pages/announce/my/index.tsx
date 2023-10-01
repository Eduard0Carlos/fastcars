import VehicleCard from "components/card";
import IVehicle from "shared/interfaces/IVehicle";
import TextBox from "components/textbox";
import Dropdown from "components/dropdown";
import IOrdenation from "shared/interfaces/IOrdenation";
import PageTitle from "components/page-title";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./styles.scss";
import IUser from "shared/interfaces/IUser";
import { get, getDatabase, query, ref } from "firebase/database";
import App from "shared/firebase";

const MyAnnouncePage = () => {
  const orderOptions: IOrdenation<IVehicle>[] = [
    {
      showName: "Título",
      value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.name.toLowerCase().localeCompare(vehicle2.name.toLowerCase()); }
    },
    {
      showName: "Preço",
      value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.price - vehicle2.price; }
    },
    {
      showName: "Localização",
      value: (vehicle1: IVehicle, vehicle2: IVehicle) => { return vehicle1.location.localeCompare(vehicle2.location); }
    }
  ];

  useEffect(() => {
    if (!localStorage.getItem("user"))
      navigate("/login", {replace: true});
  }, []);

  if (!localStorage.getItem("user"))
    return <></>;

  const navigate = useNavigate();
  const loggedUser:IUser = JSON.parse(localStorage.getItem("user")!);
  const [apiVehicles, setApiVehicles] = useState<IVehicle[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [allFilters, setAllFilters] = useState<string[]>([]);
  const [ordenation, setOrdenation] = useState<IOrdenation<IVehicle> | undefined>();

  const db = getDatabase(App);
  const vehiclesReference = ref(db, "/vehicles");

  useEffect(() => {
    if (!apiVehicles || apiVehicles.length == 0)
      get(query(vehiclesReference)).then(x => {
        const dbVehicles: IVehicle[] = Object.values(x.val());
        const userDbVehicles = dbVehicles.filter(x => x.createdByUserId == loggedUser.id);

        setApiVehicles(userDbVehicles);
        setVehicles(userDbVehicles);
      });
  }, []);

  useEffect(() => {
    ApplyFiltersAndOrdenations();
  }, [allFilters, ordenation]);

  const addFilter = (filter: string) => {
    const filters = filter.split(" ");

    setAllFilters(filters);
  };

  const ApplyFiltersAndOrdenations = () => {
    let filteredApiVehicles = apiVehicles.filter(vehicle => allFilters.filter(x => vehicle.smartSearch.toLowerCase().includes(x.toLowerCase())).length == allFilters.length);

    if (ordenation != undefined)
      filteredApiVehicles = filteredApiVehicles.sort(ordenation.value);

    setVehicles(filteredApiVehicles);
  };

  const addOrdenation = (value: string) => {
    const orderOption = orderOptions.filter(x => x.showName == value)[0];

    setOrdenation(orderOption);
  };

  const onCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, vehicle: IVehicle) => {
    navigate(`vehicle/${vehicle.id}`, { state: { vehicle } });
  };

  return (
    <div className="my-announce-page">
      <PageTitle pageName="MEUS" />
      <div className="filter">
        <div className="filter-fields">
          <TextBox placeholder="Pesquisar" onChange={addFilter} />
          <Dropdown onChange={addOrdenation} options={orderOptions.map(x => x.showName)} placeholder="Ordenar Por" />
        </div>
      </div>
      <div className="my-announce-container">
        <div className="my-announce-container-cards">
          {vehicles.map(vehicle => (<VehicleCard locationText={`Alugou para ${vehicle.totalRent} pessoa(s)`}priceText={`Rendeu R$ ${vehicle.totalReceipt},00`}  key={vehicle.id} vehicle={vehicle} onClick={onCardClick} />))}
        </div>
      </div>
    </div>
  );
};

export default MyAnnouncePage;