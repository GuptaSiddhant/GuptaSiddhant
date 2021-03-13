import { FC, useState } from "react";
import styled from "@emotion/styled";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import color from "../theme";
import slidesTrigger, { Slide, defaultSlides } from "../helpers/slidesTrigger";

const ImageArea = styled.aside`
  position: relative;
  grid-area: aside;
  background: ${color.background.secondary};
  border-radius: 4px;
  overflow: hidden;

  .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    box-shadow: inset 0 0 8px #0004;
  }

  * {
    height: 100%;
  }

  .each-fade {
    display: flex;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .each-fade p {
    width: 25%;
    font-size: 1em;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0;
    background: #adceed;
  }
`;

const SlideShow: FC = () => {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  slidesTrigger.useSubscribe(setSlides);

  return (
    <ImageArea className="slide-container">
      {slides.length > 1 ? (
        <Fade indicators={true} arrows={false}>
          {slides.map(({ image }) => (
            <div className="each-fade" key={image}>
              <img src={image} alt="" />
            </div>
          ))}
        </Fade>
      ) : slides.length === 1 ? (
        <img src={slides[0].image} alt="" />
      ) : (
        <img src={""} alt={""} />
      )}
      <div className="overlay" />
    </ImageArea>
  );
};

export default SlideShow;
