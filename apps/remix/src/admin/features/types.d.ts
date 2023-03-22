export interface AdminAppBaseProps {
  title: string;
  icon: JSX.Element | null;
  linkPath?: string;
}

export interface AdminApp extends AdminAppBaseProps {
  id: string;
  linkPath: string;
}

export interface AdminAction {
  id: string;
  title: string;
  icon: JSX.Element | null;
  linkPath?: string;
  onClick?: () => void;
}

export interface AdminRegistryOptions {
  adminBasePath?: string;
}

export interface AdminAppHandle {
  adminApp: AdminApp;
}
