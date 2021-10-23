import React from "react";
import { Box } from "ink";

import { appBoxStyle } from "../app/helpers/styles";
import Header from "../app/components/Header";
import Title from "../app/components/Title";
import Content from "../app/pages/Career";

/// List career history
const _ = () => (
  <Box {...appBoxStyle}>
    <Header />
    <Title>Career</Title>
    <Content limit={Infinity} />
  </Box>
);

export default _;
