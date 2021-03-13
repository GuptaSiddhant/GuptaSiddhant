import { FC } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { PageContent, onMouseKeyboardAction } from "../helpers";
import { setSlides, useSetSlidesEffect } from "../helpers/slidesTrigger";
import List from "../components/List";
import Card from "../components/Card";
import { Heading, Paragraph, Title } from "../components/Text";
import useScrollShadow from "../helpers/useScrollShadow";
import ScrollContainer from "../components/ScrollContainer";
import BackIcon from "../assets/BackIcon";

const Item: FC<{ item: PageContent; parent: PageContent }> = ({
  item,
  parent,
}) => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { id, title, subtitle, slides } = item;
  const image = slides?.[0]?.image;

  return (
    <Card
      tabIndex={0}
      image={image}
      onMouseEnter={() => slides && setSlides(slides)}
      onMouseLeave={() => parent.slides && setSlides(parent.slides)}
      {...onMouseKeyboardAction(() => history.push(`${url}/${id}`))}
    >
      <Title>{title}</Title>
      <Paragraph>{subtitle}</Paragraph>
    </Card>
  );
};

const BackButton: FC<{ hidden?: boolean }> = ({ hidden }) => {
  const history = useHistory();
  return !hidden ? (
    <div
      tabIndex={0}
      style={{
        cursor: "pointer",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
      }}
      {...onMouseKeyboardAction(history.goBack)}
    >
      <BackIcon style={{ height: "1rem", marginRight: "0.5rem" }} /> Back
    </div>
  ) : null;
};

const MainPage: FC<PageContent> = (content) => {
  const { path } = useRouteMatch();
  const { id, title, subtitle, slides, description, items = [] } = content;
  const hideBackButton = path === `/${id}`;
  useSetSlidesEffect(slides);

  const { ref, isScrollingBottom, isScrollingTop } = useScrollShadow();

  return (
    <ScrollContainer ref={ref}>
      <div className={"topScroll " + (isScrollingTop ? "visible" : "")} />
      <BackButton hidden={hideBackButton} />
      <Heading>{title}</Heading>
      {subtitle && <Title>{subtitle}</Title>}
      {description ? (
        typeof description === "string" ? (
          <Paragraph>{description}</Paragraph>
        ) : (
          description
        )
      ) : null}
      {items.length > 0 ? (
        <List>
          {items.map((item) => (
            <Item key={item.id} item={item} parent={content} />
          ))}
        </List>
      ) : null}
      <div className={"bottomScroll " + (isScrollingBottom ? "visible" : "")} />
    </ScrollContainer>
  );
};

export default MainPage;
