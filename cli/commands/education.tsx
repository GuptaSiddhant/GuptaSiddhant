import React from "react";
import { Box } from "ink";

import { appBoxStyle } from "../app/helpers/styles";
import Header from "../app/components/Header";
import Title from "../app/components/Title";
import Content from "../app/pages/Education";

/// List education history
const _ = () => (
  <Box {...appBoxStyle}>
    <Header />
    <Title>Education</Title>
    <Content limit={Infinity} />
  </Box>
);

export default _;
