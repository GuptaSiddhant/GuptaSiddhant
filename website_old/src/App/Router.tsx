import { FC } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Page from "../pages/Page";
import { PageContent } from "../helpers";
import mainPages from "../database";

const pages: PageContent[] = [
  ...mainPages
    .flatMap((content) =>
      content.items!.map((item) => ({
        ...item,
        path: `/${content.id}/${item.id}`,
      }))
    )
    .filter((page) => !!page),
  ...mainPages,
];

const Router: FC = () => (
  <Switch>
    {pages.map((content) => (
      <Route path={content.path || `/${content.id}`}>
        <Page {...content} />
      </Route>
    ))}

    {/* Catch all */}
    <Redirect to={`/${mainPages[0].id}`} />
  </Switch>
);

export default Router;
