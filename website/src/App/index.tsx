import { FC } from "react";
import styled from "@emotion/styled";

import color from "../theme";
import Header from "../components/Header";
import Logo from "../components/Logo";
import Router from "./Router";
import SlideShow from "../components/SlideShow";

const Scaffold = styled.div`
  margin: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border-radius: 8px;
  background-color: ${color.background.primary};
  padding: 20px;

  display: grid;
  grid-template-areas: "header aside" "main aside" "footer aside";
  grid-template-columns: 440px 1fr;
  grid-template-rows: 64px 1fr 92px;
  grid-column-gap: 20px;

  @media screen and (max-width: 500px) {
    margin: unset;
    width: 100%;
    height: 100%;
    border-radius: 0;

    grid-template-areas: "aside aside" "main main" "footer header";
    grid-template-columns: 1fr minmax(auto, 60px);
    grid-template-rows: 240px 1fr 92px;

    main {
      margin-top: 1rem;
    }
  }

  @media screen and (max-width: 500px) and (max-height: 600px) {
    grid-template-areas: "main" "header";
    grid-template-columns: 100%;
    grid-template-rows: 1fr max-content;

    aside,
    footer {
      display: none;
    }
  }
`;

const App: FC = () => {
  return (
    <Scaffold>
      <Header />
      <Router />
      <Logo />
      <SlideShow />
    </Scaffold>
  );
};

export default App;
