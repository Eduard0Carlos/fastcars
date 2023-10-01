import { useNavigate } from "react-router-dom";

import "./styles.scss";

const CancelButton = () => {
  const navigate = useNavigate();

  return (
    <section className="cancel-button" onClick={(evento) => { navigate(-1); }}>
      <h1>Cancelar</h1>
    </section>
  );
};

export default CancelButton;