import { Paragraph } from "../components/Text";
import { PageContent } from "../helpers";

const mastersHCID: PageContent = {
  id: "masters-hcid",
  title: "M.Sc. Human Computer Interaction & Design",
  subtitle: `Aalto University, Finland • KTH Royal Institute of Technology, Sweden`,
  slides: [{ image: "/images/delta.jpg" }],
  description: (
    <>
      <Paragraph>
        Dual degree program as a part of EIT Digital Master School.
      </Paragraph>
      <dl>
        <dt>Courses at Aalto</dt>
        <dd>
          <ul>
            <li>Web Software Development</li>
            <li>Computational UI Design</li>
            <li>Machine Learning</li>
            <li>Speech Recognition</li>
          </ul>
        </dd>
        <dt>Courses at KTH</dt>
        <dd>
          <ul>
            <li>HCI-Principles & Design</li>
            <li>Information Visualisation</li>
            <li>Methodology of Interaction Design</li>
            <li>Interaction Programming and the Dynamic Web</li>
            <li>Entrepreneurship for Engineers</li>
            <li>Open and User Innovation</li>
          </ul>
        </dd>
      </dl>
    </>
  ),
};

const bachelorsMech: PageContent = {
  id: "bachelors-mech",
  title: "B.Eng. (Honors) Mechanical Engineering",
  subtitle: "Birla Institute of Technology and Science (BITS), Pilani, India",
  slides: [{ image: "/images/BITSDegree.jpg" }],
  description: "Graduated in First Division with a focus on 3D modelling",
};

export default {
  id: "learning",
  title: "Learning",
  description: undefined,
  slides: [{ image: "/images/BITSDegree.jpg" }],
  items: [mastersHCID, bachelorsMech],
} as PageContent;
