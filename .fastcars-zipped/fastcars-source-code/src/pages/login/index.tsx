import PageTitle from "components/page-title";
import "./styles.scss";
import TextBox from "components/textbox";
import ConfirmButton from "components/confirm-button";
import CancelButton from "components/cancel-button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { refFromURL, set, update, query, get, getDatabase, ref } from "firebase/database";
import App from "shared/firebase";
import IUser from "shared/interfaces/IUser";

const LoginPage = () => {
  const loggedUserId = localStorage.getItem("user");

  if (loggedUserId) {
    window.location.href = "/";
    return (<></>);
  }

  const db = getDatabase(App);

  const usersDbRef = ref(db, "/users");

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();

  const loginConfirm = async () => {
    const users:IUser[] = Object.values((await get(query(usersDbRef))).val());

    const user = users.find(x => x.email == email && x.password == password);

    if (!user) {
      setError("Email e/ou senha inválidos");
      return;
    }

    user.password = "";
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/";
  };

  return (
    <div className="login-page">
      <PageTitle pageName="Entrar" />
      <div className="login-container">
        <div className="section">
          <div className="fields">
            <div className={`field ${error ? "error" : ""}`}>
              <TextBox placeholder="Insira seu email" onChange={setEmail} />
            </div>
            <div className={`field ${error ? "error" : ""}`}>
              <TextBox placeholder="Insira sua senha" type="password" onChange={setPassword} />
              {error ? <span>{error}</span> : <></>}
            </div>
          </div>
        </div>
        <div className="register-section">
          <span> Não possui uma conta?
            <Link to="/register">
              <span className="register-text"> Registre-se aqui</span>
            </Link>
          </span>
        </div>
        <div className="buttons">
          <ConfirmButton text="Entrar" onClick={loginConfirm}/>
          <CancelButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;