import React from "react";
import { Box } from "ink";

import { appBoxStyle } from "../app/helpers/styles";
import Header from "../app/components/Header";
import Title from "../app/components/Title";
import Content from "../app/pages/About";

/// About Siddhant Gupta
const _ = () => (
  <Box {...appBoxStyle}>
    <Header />
    <Title>About</Title>
    <Content />
  </Box>
);

export default _;
