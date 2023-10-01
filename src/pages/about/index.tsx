import image from "assets/porshe.png";

import { useNavigate } from "react-router-dom";

import "./styles.scss";

const AboutPage = () => {
	return (
		<div>
			<div className="about-container">
				<div className="about-container-image-background">
					<div>
						<span>
							Bem-vindo a FastCars, um site de aluguel de carros, onde a comunidade automobilística se une para tornar o processo de aluguel de veículos mais acessível, confiável e recompensador. Aqui, acreditamos que a partilha é a chave para uma mobilidade mais inteligente e econômica. Nossa plataforma permite que os próprios proprietários de carros compartilhem seus veículos com pessoas que precisam de uma opção de transporte temporário. Quer você seja um locador em potencial ou alguém em busca de um carro para alugar, você está no lugar certo.
						</span>
					</div>
					<div className="about-container-image-background-button">
					</div>
				</div>
				<img className="about-container-image" src={image} />
			</div>

			<span className="owner">Desenvolvido por Carlos Eduardo Vieira - rm98575 - FIAP</span>
		</div>
	);
};
export default AboutPage;