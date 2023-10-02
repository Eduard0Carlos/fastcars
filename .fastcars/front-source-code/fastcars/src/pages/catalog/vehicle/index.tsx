import IVehicle from "shared/interfaces/IVehicle";
import NotFoundPage from "pages/not-found";
import PageTitle from "components/page-title";
import star from "assets/Star.png";
import CancelButton from "components/cancel-button";
import ConfirmButton from "components/confirm-button";
import RangeDatePicker from "components/date-range-picker";

import { refFromURL, set, update, query, get, getDatabase, ref } from "firebase/database";
import { useParams, useNavigate, UNSAFE_useScrollRestoration } from "react-router-dom";
import { useState, useEffect } from "react";

import "./styles.scss";
import App from "shared/firebase";
import DatePickerWithRange from "components/date-range-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "components/dialog";
import { DateRange } from "react-day-picker";
import IRent from "shared/interfaces/IRent";
import IUser from "shared/interfaces/IUser";
import RentStatus from "shared/enums/RentStatus";
import { useToast } from "components/toast/use-toast";

function convertDate(inputFormat: Date) {
  function pad(s: number) { return (s < 10) ? "0" + s : s; }
  const d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}


const VehicleDetailPage = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const [apiVehicle, setApiVehicle] = useState<IVehicle>();
  const db = getDatabase(App);
  const vehiclesReference = ref(db, `/vehicles/${id}`);
  const navigate = useNavigate();

  const [date, setDate] = useState<DateRange>();

  const [loggedUser, setLoggedUser] = useState<IUser>();

  const [formSubmited, setFormSubmited] = useState<boolean>();

  useEffect(() => {
    if (!apiVehicle)
      get(query(vehiclesReference)).then(x => {
        const dbVehicle: IVehicle = x.val();

        if (dbVehicle == undefined)
          navigate("/notfound");

        const localStorageVehicleLocalizations = localStorage.getItem("vehicle-localizations");
        const vehicleLocalizations: any[] = localStorageVehicleLocalizations ? JSON.parse(localStorageVehicleLocalizations) : [];

        const cacheLocation = vehicleLocalizations.find(storage => storage.vehicleId == dbVehicle.id);

        dbVehicle.location = cacheLocation.localization;

        setApiVehicle(dbVehicle);
      });
  }, []);

  useEffect(() => {
    if (!apiVehicle)
      return;


  }, [apiVehicle]);

  if (!apiVehicle)
    return <></>;

  const vehicleName = apiVehicle.name.length > 27 ? apiVehicle.name.substring(0, 24) + "..."
    : apiVehicle.name;

  const starsArray = [];

  for (let index = 1; index <= apiVehicle.userStars; index++)
    starsArray.push(star);

  const onSubmit = async () => {
    if (formSubmited)
      return;

    if (!localStorage.getItem("user"))
      navigate("/login", { replace: true });

    if (!localStorage.getItem("user"))
      return;

    const userLogged: IUser = loggedUser ?? JSON.parse(localStorage.getItem("user")!);

    if (!loggedUser)
      setLoggedUser(userLogged);

    if (!date?.from || !date?.to)
      return;

    try {
      const rent: IRent = {
        id: window.crypto.randomUUID(),
        rentUserId: userLogged.id,
        rentUserImage: userLogged.image_url,
        rentUserName: userLogged.name,
        vehicleImage: apiVehicle.image,
        vehicleOwnerId: apiVehicle.createdByUserId,
        vehicleName: apiVehicle.name,
        vehicleId: apiVehicle.id,
        vehicleOwnerImage: apiVehicle.userImage,
        vehiclePrice: apiVehicle.price,
        vehicleOwnerName: apiVehicle.userName,
        vehicleRentInitialDate: convertDate(date.from),
        vehicleRentFinalDate: convertDate(date.to),
        status: RentStatus.PENDENT,
        createdAt: convertDate(new Date()),
        smartSearch: `${userLogged.name} ${apiVehicle.name} ${apiVehicle.price} ${apiVehicle.price} ${apiVehicle.userName} ${convertDate(date.from)} ${convertDate(date.to)} ${convertDate(new Date())}`,
        totalDays: (date.to.getTime() - date.from.getTime()) / 86400000
      };

      const insertRentRef = ref(db, `/rent/${rent.id}`);

      setFormSubmited(true);

      await set(insertRentRef, rent);

      toast({
        title: "Solicitação de locação enviada com sucesso ✔"
      });

    } catch (error) {
      console.log(error);
      toast({
        title: "Um erro inesperado ocorreu ❌",
        description: "Tivemos um problema ao tentar salvar seus dados, tente novamente mais tarde"
      });
    }
    finally {
      navigate(-1);
    }
  };

  return (
    <div className="detail-page">
      <PageTitle pageName="DETALHES" />
      <div className="content-container">
        <div className="content-container-image">
          <img src={apiVehicle.image} />
        </div>

        <div className="content-container-image-right">
          <div className="title">
            <h1>{vehicleName.toUpperCase()}</h1>
          </div>
          <div className="description">
            <div>
              <h3>Localização</h3>
              <h4>{apiVehicle.location}</h4>
            </div>
            <div>
              <h3>Lotação</h3>
              <h4>{apiVehicle.maxPersons} pessoas</h4>
            </div>
            <div>
              <h3>Ano Fab.</h3>
              <h4>{apiVehicle.fabricationYear}</h4>
            </div>
            <div>
              <h3>Avaliação</h3>
              <h4>{apiVehicle.stars}/5</h4>
            </div>
            <div>
              <h3>Tipo</h3>
              <h4>{apiVehicle.type}</h4>
            </div>
            <div>
              <h3>Cor</h3>
              <h4>{apiVehicle.color}</h4>
            </div>
          </div>
        </div>

        <div className="price">
          <h3>R$ {apiVehicle.price},00 por dia</h3>
        </div>

        <div className="owner-info">
          <div className="owner-info-name">
            <img src={apiVehicle.userImage} />
            <h3>{apiVehicle.userName}</h3>
          </div>

          <div className="owner-info-stars">
            {starsArray.map((starIco, index) => <img key={index} className="owner-info-star-icon" src={starIco} />)}
          </div>
        </div>

        <Dialog>
          <DialogContent>
            <form onSubmit={evento => { evento.preventDefault(); onSubmit(); }}>
              <DialogHeader>
                <DialogTitle>Selecione as datas de locação</DialogTitle>
                <DialogDescription>
									Ao confirmar, uma solicitação de locação será enviada ao proprietário do anúncio para análise. Caso seja aprovada, sera enviado uma mensagem de confirmação em seu email.
                </DialogDescription>
              </DialogHeader>
              <DatePickerWithRange className="modal-date-picker" onSelected={setDate} />
              <DialogFooter>
                <ConfirmButton className="modal-confirm-button" isSubmit text="Confirmar" />
              </DialogFooter>
            </form>
          </DialogContent>
          <DialogTrigger asChild>
            <ConfirmButton text="Alugar" />
          </DialogTrigger>
        </Dialog>

        <CancelButton />
      </div>

    </div >
  );
};

export default VehicleDetailPage;