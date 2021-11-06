import { FC } from "react";
import styled from "@emotion/styled";
import color from "../theme";

const Footer = styled.footer`
  grid-area: footer;
  padding: 20px;
`;

const Name = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  color: ${color.text.primary};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Position = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 0.25px;
  color: ${color.text.secondary};
`;

const Logo: FC = () => {
  return (
    <Footer>
      <Name>Gupta Siddhant</Name>
      <Position>UI & Front-end Developer</Position>
    </Footer>
  );
};

export default Logo;
