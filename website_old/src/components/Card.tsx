import { forwardRef, HTMLAttributes, ReactNode } from "react";
import styled from "@emotion/styled";
import color from "../theme";

interface CardProps extends HTMLAttributes<HTMLLIElement> {
  icon?: string;
  image?: string;
  children: ReactNode;
}

const Container = styled.li`
  position: relative;
  background-color: ${color.background.primary};
  display: grid;
  grid-gap: 16px;
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 1rem 0;
  border-bottom: 1px solid ${color.background.disabled};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid ${color.background.disabled};
`;

const Content = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: ${(p) => (p.columns > 1 ? "32px" : "")} 1fr;
  grid-gap: 8px;
`;

const Slot = styled.div`
  display: grid;
  gap: 4px;
  p {
    margin: 0;
  }
`;

const Card = forwardRef<HTMLLIElement, CardProps>(
  ({ children, icon, image, ...rest }, ref) => {
    return (
      <Container {...rest} ref={ref}>
        {image ? <Image src={image} alt={image} /> : null}
        <Content columns={icon ? 2 : 1}>
          {icon ? <img src={icon} alt={icon} /> : null}
          <Slot>{children}</Slot>
        </Content>
      </Container>
    );
  }
);

export default Card;
