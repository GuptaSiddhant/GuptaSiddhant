import invariant from "@gs/utils/invariant";

import type {
  AdminAction,
  AdminApp,
  AdminAppBaseProps,
  AdminRegistryOptions,
} from "./types";

export default class AdminRegistry<T extends string> {
  #apps: Map<T, AdminAppBaseProps>;
  #actions: Map<string, AdminAction>;
  #adminBasePath: string;

  constructor(options?: AdminRegistryOptions) {
    this.#apps = new Map();
    this.#actions = new Map();
    this.#adminBasePath = options?.adminBasePath || "/";
  }

  // Apps

  registerApp = (id: T, props: AdminAppBaseProps) => {
    this.#apps.set(id, props);
    return this;
  };

  getApp = (id: T): AdminApp => {
    const props = this.#apps.get(id);
    invariant(props, `App with id '${id}' not found in Admin registry.`);

    const linkPath = props.linkPath || `${this.#adminBasePath}/${id}/`;

    return { id, linkPath, ...props };
  };

  get apps(): AdminApp[] {
    return [...this.#apps.keys()]
      .map(this.getApp)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  // Actions

  registerAction = (props: AdminAction) => {
    this.#actions.set(props.id, props);
    return this;
  };

  getAction = (id: string): AdminAction => {
    const props = this.#actions.get(id);
    invariant(props, `Action with id '${id}' not found in Admin registry.`);

    return props;
  };

  get actions(): AdminAction[] {
    return [...this.#actions.keys()].map((key) => this.#actions.get(key)!);
  }
}
