// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

import { CareerDocument } from "./career";
import { TagDocument } from "./tag";
import { LocationDocument } from "./location";
import { FileWithCaption, ImageWithCaption } from "./gallery";
import { Action } from "./action";
import { EducationDocument } from "./education";
import { ProjectDocument } from "./project";
import { BlogDocument } from "./blog";
import { MarkdownBlock } from "./blog/markdown";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    CareerDocument,
    EducationDocument,
    ProjectDocument,
    BlogDocument,
    TagDocument,
    LocationDocument,
    ImageWithCaption,
    FileWithCaption,
    Action,
    MarkdownBlock,
  ]),
});
