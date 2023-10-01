import { ReactComponent as Logo } from "assets/logo-icon.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "components/nav-menu";

import "./styles.scss";
import IUser from "shared/interfaces/IUser";

const AppHeader = () => {
  const headerPages = [
    {
      pageName: "Inicio",
      path: "/"
    },
    {
      pageName: "Catálogo",
      path: "/catalog"
    },
    {
      pageName: "Anunciar",
      path: "/announce"
    },
    {
      pageName: "Sobre",
      path: "/about"
    },
  ];

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  const [loggedUser, setLoggedUser] = useState<IUser>(JSON.parse(localStorage.getItem("user")!));

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur fastcar-header">
      <div className="container flex h-14 items-center md:justify-start">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <Logo className="logo" />
            <span className="hidden font-bold sm:inline-block">FastCars</span>
          </Link>

        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center">
          <div className="flex items-center space-x-6 text-sm font-medium">
            {headerPages.map(item =>
              <Link key={item.pageName} to={item.path}>
                {item.pageName}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 md:justify-end">
          {!loggedUser ? (<div className="login-register-buttons">
            <Link to="/login" className="nav-link">
							Entrar
            </Link>
            <Link to="/register" className="nav-link">
							Registrar-se
            </Link>
          </div>
          )
            : (<NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="no-background"><img className="profile-picture" src={loggedUser.image_url} /></NavigationMenuTrigger>
                  <NavigationMenuContent className="pointer-cursor">
                    <Link to="/announce/pendents" className="header-submenu-link">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Locações Pendentes</NavigationMenuLink>
                    </Link>
                    <Link to="/vehicles/my" className="header-submenu-link">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>Meus Alugueis</NavigationMenuLink>
                    </Link>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}>Sair</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>)}
        </div>
      </div>
    </header >
  );
};

export default AppHeader;