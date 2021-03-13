import styled from "@emotion/styled";
import { Link as BaseLink } from "react-router-dom";
import color from "../theme";

export const Paragraph = styled.p`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  color: ${color.text.secondary};
  margin: 0;
  margin-bottom: 1rem;
`;

export const Heading = styled.h1`
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  line-height: 2rem;
  font-weight: 700;
  color: ${color.text.primary};
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: ${color.text.primary};
  margin: 0;
`;

export const Link = styled(BaseLink)`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
  &:active {
    color: ${color.text.primary};
    text-decoration: underline;
  }
`;
