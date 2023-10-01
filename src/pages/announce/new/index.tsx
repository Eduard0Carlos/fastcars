import PageTitle from "components/page-title";
import TextBox from "components/textbox";
import Dropdown from "components/dropdown";
import ConfirmButton from "components/confirm-button";
import CancelButton from "components/cancel-button";
import ICepInfo from "shared/interfaces/ICepInfo";
import axios from "axios";
import App from "shared/firebase";

import { refFromURL, set, update, query, get, getDatabase, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./styles.scss";
import ICountry from "shared/interfaces/ICountry";
import TextToggle from "components/text-toggle";
import IVehicle from "shared/interfaces/IVehicle";
import IUser from "shared/interfaces/IUser";

const NewAnnouncePage = () => {
	const db = getDatabase(App);
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem("user"))
			navigate("/login", { replace: true });
	}, []);

	if (!localStorage.getItem("user"))
		return <></>;

	const [countries, setCountries] = useState<ICountry[]>([]);

	const [name, setName] = useState<string>();
	const [nameError, setNameError] = useState<string>();

	const [brand, setBrand] = useState<string>();
	const [brandError, setBrandError] = useState<string>();

	const [image, setImage] = useState<string>();
	const [imageCardText, setImageCardText] = useState<string>("Insira a URL");

	const [doorsQuantity, setDoorsQuantity] = useState<string>();
	const [doorsQuantityError, setDoorsQuantityError] = useState<string>();

	const [buildYear, setBuildYear] = useState<string>();
	const [buildYearError, setBuildYearError] = useState<string>();
	
	const [maxPersons, setMaxPersons] = useState<string>();
	const [maxPersonsError, setMaxPersonsError] = useState<string>();

	const [plate, setPlate] = useState<string>();
	const [plateError, setPlateError] = useState<string>();

	const [color, setColor] = useState<string>();
	const [colorError, setColorError] = useState<string>();

	const [type, setType] = useState<string>();
	const [typeError, setTypeError] = useState<string>();

	const [price, setPrice] = useState<string>();
	const [priceError, setPriceError] = useState<string>();

	const [street, setStreet] = useState<string>();
	const [streetError, setStreetError] = useState<string>();

	const [district, setDistrict] = useState<string>();
	const [districtError, setDistrictError] = useState<string>();

	const [city, setCity] = useState<string>();
	const [cityError, setCityError] = useState<string>();

	const [uf, setUf] = useState<string>();
	const [ufError, setUfError] = useState<string>();

	const [cep, setCep] = useState<string>();
	const [cepError, setCepError] = useState<string>();

	const [country, setCountry] = useState<string>();
	const [countryError, setCountryError] = useState<string>();

	const [daysOfTheWeek, setDaysOfTheWeek] = useState<string[]>();
	const [daysOfTheWeekError, setDaysOfTheWeekError] = useState<string>();

	const [hasError, setHasError] = useState<boolean>();

	const colors: string[] = [
		"Preto",
		"Branco",
		"Azul",
		"Vermelho"
	];

	const types: string[] = [
		"Carro",
		"Motocicleta",
		"Caminhão",
		"Van"
	];

	const loggedUser: IUser = JSON.parse(localStorage.getItem("user")!);

	useEffect(() => {
		const getCountries = async () => {
			const apiCountries: ICountry[] = (await axios.get("https://restfulcountries.com/api/v1/countries?per_page=600&fetch_type=true", { method: "GET", headers: { "Accept": "application/json", "Authorization": "Bearer 381|ffUcegvhqqJzZRgjhjCCGvBnbHOtyxFcaBGQwEjI" } })).data.data;

			setCountries(apiCountries);
		};

		getCountries();
	}, []);

	const onImageTyped = async (text: string) => {
		setImage(undefined);

		if (!text) {
			setImageCardText("Insira a URL");
			return;
		}

		if (!text.toLowerCase().includes("https")) {
			setImageCardText("URL inválida");
			return;
		}

		try {
			const imageInfos = (await axios.get(text)).headers;

			if (imageInfos?.toString()?.toLowerCase()?.includes("image")) {
				setImage(text);
				return;
			}

			setImageCardText("Imagem não encontrada");
		} catch (error) {
			setImageCardText("Imagem não encontrada");
			return;
		}
	};

	const onCepTyped = async (text: string) => {
		const formatedText = text.replace("-", "").trim();

		if (formatedText.length < 8)
			return;

		try {
			const apiCepInfo: ICepInfo = (await axios.get(`https://viacep.com.br/ws/${formatedText}/json/`)).data;

			if (!apiCepInfo)
				return;

			setCep(formatedText);
			setStreet(apiCepInfo.logradouro);
			setDistrict(apiCepInfo.bairro);
			setCity(apiCepInfo.localidade);
			setUf(apiCepInfo.uf);
			setCountry("Brazil");

		} catch (error) {
			return;
		}
	};

	const addDaysOfTheWeek = (value: string) => {
		const formatedDaysOfTheWeek = !daysOfTheWeek ? [] : daysOfTheWeek?.filter(x => !(x == value));

		formatedDaysOfTheWeek?.push(value);

		setDaysOfTheWeek(formatedDaysOfTheWeek);
	};

	const removeDaysOfTheWeek = (value: string) => {
		setDaysOfTheWeek(daysOfTheWeek?.filter(x => !(x == value)));
	};

	const createAnnounce = async () => {
		setHasError(false);

		if (hasError) return;

		const newVehicle: IVehicle = {
			id: window.crypto.randomUUID(),
			brand: brand!,
			cep: cep!,
			city: city!,
			color: color!,
			country: country!,
			image: image!,
			createdByUserId: loggedUser.id,
			disponibility: daysOfTheWeek!,
			fabricationYear: buildYear?.toString() ?? "0",
			maxDoors: doorsQuantity!,
			maxPersons: maxPersons!,
			name: name!,
			plate: plate!,
			price: Number(price!),
			stars: 5,
			totalReceipt: 0,
			totalRent: 0,
			type: type!,
			uf: uf!,
			userImage: loggedUser.image_url,
			userName: loggedUser.name,
			userStars: 5,
			smartSearch: `${name} ${brand} ${cep} ${city} ${color} ${country} ${loggedUser.name} ${buildYear} ${doorsQuantity} ${maxPersons} ${plate} ${price} ${5} ${type} ${uf}`,
			location: "- km"
		};

		const newVehicleRef = ref(db, `vehicles/${newVehicle.id}`);

		set(newVehicleRef, newVehicle).then(() => {
			navigate("/announce/my");
		});
	};

	return (
		<div className="new-announce-page">
			<PageTitle pageName="Criar" />

			<div className="content-container">
				<div className="content-container-image">
					{(!image ? <h1>{imageCardText}</h1>
						: <img src={image} />)}
				</div>

				<div className="content-container-image-right">
					<div className="section">
						<div className="section-title">
							<h4>Informações Principais</h4>
						</div>
						<div className="content-container-image-right-fields">
							<TextBox placeholder="Insira o modelo" onChange={setName} />
							<TextBox placeholder="Insira a marca" onChange={setBrand} />
						</div>
					</div>

					<div className="section">
						<div className="section-title">
							<h4>Imagem</h4>
						</div>
						<div className="content-container-image-right-fields">
							<TextBox placeholder="Insira a URL da imagem" onChange={onImageTyped} />
						</div>
					</div>
				</div>

				<div className="agroupped-fields">
					<div className="section price">
						<div className="section-title">
							<h4>Preço Diária</h4>
						</div>
						<TextBox placeholder="Preço" onlyNumbers onChange={setPrice}/>
					</div>

					<div className="section availability">
						<div className="section-title">
							<h4>Disponibilidade</h4>
						</div>
						<div className="weekdays">
							<TextToggle value="Domingo" text="D" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Segunda" text="S" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Terça" text="T" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Quarta" text="Q" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Quinta" text="Q" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Sexta" text="S" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
							<TextToggle value="Sábado" text="S" onActive={addDaysOfTheWeek} onDeactivate={removeDaysOfTheWeek} />
						</div>
					</div>
				</div>

				<div className="section details">
					<div className="section-title">
						<h4>Detalhes</h4>
					</div>
					<div className="fields">
						<TextBox placeholder="Quantidade de portas" onlyNumbers onChange={setDoorsQuantity} />
						<TextBox placeholder="Lotação Máxima" onlyNumbers onChange={setMaxPersons} />
						<TextBox placeholder="Ano de Fabricação" onlyNumbers onChange={setBuildYear} />
						<TextBox placeholder="Placa" maxLength={12} onChange={setPlate} />
						<Dropdown placeholder="Cor" options={colors} onChange={setColor} />
						<Dropdown placeholder="Tipo" options={types} onChange={setType} />
					</div>
				</div>

				<div className="section location">
					<div className="section-title">
						<h4>Localização do Veículo</h4>
					</div>
					<div className="fields">
						<TextBox placeholder="CEP" maxLength={9} onChange={onCepTyped} />
						<div className="location-street">
							<TextBox value={street} placeholder="Rua" onChange={setStreet} />
						</div>
						<TextBox placeholder="Número" onlyNumbers />
						<TextBox value={district} placeholder="Bairro" onChange={setDistrict} />
						<TextBox value={city} placeholder="Cidade" onChange={setCity} />
						<TextBox value={uf} placeholder="UF" onChange={setUf} />
						<Dropdown value={country} options={countries.map(x => x.name)} placeholder="País" onChange={setCountry} />
					</div>
				</div>

				<ConfirmButton text="Criar" onClick={createAnnounce} />
				<CancelButton />
			</div>

		</div>
	);
};

export default NewAnnouncePage;