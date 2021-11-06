import styled from "@emotion/styled";

const ScrollContainer = styled.main`
  position: relative;
  grid-area: main;
  padding: 0 20px;
  overflow-y: auto;
  overflow-x: hidden;

  > h2 {
    margin-bottom: 1em;
  }

  .topScroll,
  .bottomScroll {
    position: sticky;
    z-index: 1;
    left: 0;
    right: 0;
    height: 8px;

    &.visible {
      background: linear-gradient(to bottom, #0002, #0000);
    }
  }

  .topScroll {
    top: 0;
  }
  .bottomScroll {
    bottom: 0;
    transform: rotate(180deg);
  }
`;

export default ScrollContainer;
