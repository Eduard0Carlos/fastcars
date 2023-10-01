import notfoundImage from "assets/404.png";
import PageTitle from "components/page-title";

import "./styles.scss";

const NotFoundPage = () => {
	return (
		<div className="notfound">
			<PageTitle pageName="404" />
			<img src={notfoundImage} />
		</div>
	);
};

export default NotFoundPage;