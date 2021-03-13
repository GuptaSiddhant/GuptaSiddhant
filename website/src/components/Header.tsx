import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";
import mainPages from "../database";
import color from "../theme";
import Button from "./Button";
import MenuIcon from "../assets/MenuIcon";
import CloseIcon from "../assets/CloseIcon";

const Navigation = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const NavItem = styled.li`
  list-style: none;
  margin-right: 16px;
  color: ${color.text.secondary};
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid transparent;

  :hover {
    border-bottom-color: ${color.text.secondary};
  }

  &.active {
    border-bottom-color: ${color.text.primary};
    color: ${color.text.primary};
  }

  a {
    font-weight: 600;
    color: inherit;
    text-decoration: none;
  }
`;

const Nav: FC = () => {
  const { pathname } = useLocation();
  const isActive = (path: string): boolean => {
    if (path.length === 1) return path === pathname;
    return pathname.startsWith(path);
  };
  return (
    <Navigation>
      {mainPages.map(({ title, id }) => {
        const path = `/${id}`;
        return (
          <NavItem className={isActive(path) ? "active" : ""}>
            <Link key={id} to={path}>
              {title}
            </Link>
          </NavItem>
        );
      })}
    </Navigation>
  );
};

const NavMenu = styled.div`
  position: absolute;
  bottom: 4rem;
  background: ${color.background.primary};
  box-shadow: 2px 8px 16px 0px #0004;
  z-index: 10;
  padding: 1rem;
  border-radius: 8px;
  width: 8em;
  border: 1px solid ${color.background.disabled};

  li {
    margin: 0.5em 0;
  }
`;

const Head = styled.head`
  grid-area: header;
  position: relative;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .nav-menu {
    display: none;
  }

  > button {
    display: none;
    background: ${color.background.primary};
    border: 1px solid ${color.background.disabled};
    min-width: 2rem;
    height: 2rem;
    padding: 0.25rem;
    align-items: center;
    border-radius: 0.25rem;
  }

  @media screen and (max-width: 500px) {
    > nav {
      display: none;
    }
    > button {
      display: flex;
    }
    .nav-menu {
      display: flex;
    }
  }
`;

const Header: FC = () => {
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => setShowMenu(false), [pathname]);

  return (
    <Head>
      <Nav />
      <Button onClick={() => setShowMenu((val) => !val)}>
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </Button>
      {showMenu && (
        <NavMenu className="nav-menu">
          <Nav />
        </NavMenu>
      )}
    </Head>
  );
};

export default Header;
