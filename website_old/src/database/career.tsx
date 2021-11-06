import { PageContent } from "../helpers";

const mastersHCID: PageContent = {
  id: "masters-hcid",
  title: "M.Sc. Human Computer Interaction & Design",
  subtitle:
    "Aalto University, Finland •\nKTH Royal Institute of Technology, Sweden",
  description: `Dual degree program as a part of EIT Digital Master School.<br><br><b>Courses:</b><table cellspacing='0px' translate='no' class='notranslate'><tr><th>Aalto</th><td>Computational UI Design, Machine Learning, Web Software Development, Speech Recognition</td></tr><tr><th>KTH</th><td>HCI-Principles & Design, Information Visualisation, Methodology of Interaction Design, Interaction Prohramming and the Dynamic Web, Entrepreneurship for Engineers, Open and User Innovation</td></tr></table>`,
  slides: [{ image: "/images/delta.jpg" }],
};

const bachelorsMech: PageContent = {
  id: "bachelors-mech",
  title: "B.Eng. (Honors) Mechanical Engineering",
  subtitle: "Birla Institute of Technology and Science (BITS), Pilani, India",
  description: "Graduated in First Division with a focus on 3D modelling",
  slides: [{ image: "/images/BITSDegree.jpg" }],
};

export default {
  id: "career",
  title: "Career",
  description: undefined,
  slides: [{ image: "/images/BITSDegree.jpg" }],
  items: [mastersHCID, bachelorsMech],
} as PageContent;
