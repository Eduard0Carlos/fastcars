import PageTitle from "components/page-title";
import TextBox from "components/textbox";
import ConfirmButton from "components/confirm-button";
import CancelButton from "components/cancel-button";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { refFromURL, set, update, query, get } from "firebase/database";
import { getDatabase, ref } from "firebase/database";

import "./styles.scss";
import App from "shared/firebase";
import IUser from "shared/interfaces/IUser";

const RegisterPage = () => {
  const loggedUserId = localStorage.getItem("user");

  if (loggedUserId) {
    window.location.href = "/";
    return (<></>);
  }

  const db = getDatabase(App);

  const usersDbRef = ref(db, "/users");

  const [image, setImage] = useState<string>();
  const [imageCardText, setImageCardText] = useState<string>("Insira a URL");

  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string>();

  const [name, setName] = useState<string>();
  const [nameError, setNameError] = useState<string>();

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>();

  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const [hasError, setHasError] = useState<boolean>(false);

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

  const registerConfirm = async () => {
    setHasError(false);

    const users:IUser[] = Object.values((await get(query(usersDbRef))).val());

    const emailExists = users.find(x => x?.email?.toLowerCase() == email?.toLowerCase());

    if (!email) {
      setEmailError("O email não pode estar vazio");
      setHasError(true);
    }
    else if ((!email.includes("@") && !email.includes(".com"))) {
      setEmailError("Email inválido");
      setHasError(true);
    }
    else if (emailExists)
    {
      setEmailError("Email já cadastrado");
      setHasError(true);
    }
    else
      setEmailError("");

    if (!name) {
      setNameError("O nome deve ser informado");
      setHasError(true);
    }
    else
      setNameError("");

    if (!phoneNumber) {
      setPhoneNumberError("Número de telefone deve ser informado");
      setHasError(true);
    }
    else
      setPhoneNumberError("");

    if (!password) {
      setPasswordError("A senha deve ser informada");
      setHasError(true);
    }
    else if (password != confirmPassword) {
      setPasswordError("As senhas não coincidem");
      setHasError(true);
    }
    else
      setPasswordError("");

    if (hasError) return;

    const newUser = { id: window.crypto.randomUUID(), email: email!, image_url: image ?? `https://ui-avatars.com/api/${name!}`, name: name!, password: password!, phoneNumber: phoneNumber! };

    const newUserRef = ref(db, `users/${newUser.id}`);

    set(newUserRef, newUser).then(() => {
      newUser.password = "";
      localStorage.setItem("user", JSON.stringify(newUser));

      window.location.href = "/";
    });
  };

  return (
    <div className="register-page">
      <PageTitle pageName="Cadastro" />
      <div className="register-container">

        <div className="section">
          <div className="fields">
            <div className="profile-picture" >
              {
                !image ? <span>{imageCardText}</span> : <img src={image} />
              }
            </div>
            <TextBox placeholder="Insira a url da imagem de seu perfil" onChange={onImageTyped} />
          </div>
        </div>

        <div className="section">
          <div className="fields">
            <div className={`field ${emailError ? "error" : ""}`}>
              <TextBox placeholder="Insira seu email" onChange={setEmail} />
              {emailError ? <span>{emailError}</span> : <></>}
            </div>

            <div className={`field ${nameError ? "error" : ""}`}>
              <TextBox placeholder="Insira seu nome" onChange={setName} />
              {nameError ? <span>{nameError}</span> : <></>}
            </div>

            <div className={`field ${phoneNumberError ? "error" : ""}`}>
              <TextBox placeholder="Insira seu número de telefone" onChange={setPhoneNumber} />
              {phoneNumberError ? <span>{nameError}</span> : <></>}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="fields">
            <div className={`field ${passwordError ? "error" : ""}`}>
              <TextBox placeholder="Insira sua senha" type="password" onChange={setPassword} />
            </div>

            <div className={`field ${passwordError ? "error" : ""}`}>
              <TextBox placeholder="Confirme sua senha" type="password" onChange={setConfirmPassword} />
              {passwordError ? <span>{passwordError}</span> : <></>}
            </div>
          </div>
        </div>

        <div className="login-section">
          <span> Já possui uma conta?
            <Link to="/login">
              <span className="login-text"> Entre aqui</span>
            </Link>
          </span>
        </div>
        <div className="buttons">
          <ConfirmButton text="Criar Conta" onClick={registerConfirm} />
          <CancelButton />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;