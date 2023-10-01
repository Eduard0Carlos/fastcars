import PageTitle from "components/page-title";
import { useNavigate } from "react-router-dom";

import "./styles.scss";

const AnnouncePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageTitle pageName="Anúncio" />
      <div className="announce-page">
        <div className="new-button button" onClick={event => navigate("new")}>
          <h1 className="backtext">CRIAR NOVO</h1>
          <h1>CRIAR NOVO</h1>
        </div>
        <div className="show-button button" onClick={event => navigate("my")}>
          <h1 className="backtext">VER EXISTENTES</h1>
          <h1>VER EXISTENTES</h1>
        </div>
      </div>
    </div>
  );
};

export default AnnouncePage;