type EncryptData = Record<string>;

interface CusResponse<T> {
  error: boolean;
  code: number;
  data: T;
  msg: string | null;
}

interface ResponseOk<T = any> extends CusResponse<T> {
  error: false;
}

interface ResponseErr extends CusResponse<null> {
  error: true;
}
/**
 * 布局组件配置props
 */
interface LayoutProps {
  modalType: string;
  layout?: string;
  onChange?: (value: string) => void;
}

interface Channel {
  id: number;
  name: string;
}
interface Format {
  id: number;
  name: string;
}

/** 全局变量 */
interface GlobalData {
  routes: string[];
  menus: MenuItem[];
  TOKEN: string;
}
/** main content */
interface MainContextValue {
  userInfo: UserInfo | null;
  permissons: MenuItem[];
  formats: Format[];
  channels: Channel[];
}

interface ReqHeader {
  token: string;
  timestamp: string;
  sign: string;
}

declare type FileInfoStatus =
  | 'default'
  | 'uploading'
  | 'done'
  | 'error'
  | 'removed';

declare type UploadType = 'base' | 'img';
declare type UploadSize = 'middle' | 'large';

declare type PermissionType =
  | 'add'
  | 'edit'
  | 'delete'
  | 'save'
  | 'refresh'
  | 'manage'
  | 'export'
  | 'import'
  | 'download'
  | 'view'
  | 'log'
  | 'confirm'
  | 'reject'
  | 'offline'
  | 'check'
  | 'default';
interface FileInfo {
  uid: string;
  name: string;
  size?: number;
  ext?: string;
  url?: string;
  tempUrl?: string;
  file?: File;
  progress?: number;
  status?: FileInfoStatus;
  xhr?: XMLHttpRequest;
}

interface UploadProps {
  value?: FileInfo[];
  disabled?: boolean;
  showUpload?: boolean;
  size?: UploadSize;
  type?: UploadType;
  max?: number;
  maxSize?: number; // 文件尺寸,-1不限制
  accept?: string;
  immediateUpload?: boolean;
  style?: React.CSSProperties;
  onChange?: (files: FileInfo[]) => void;
}

interface FormItemChildProps<T, V = any> {
  disabled?: boolean;
  value?: T;
  onChange?: (value: T, values?: V) => void;
}

interface MenuItem {
  id: number;
  pid: number;
  type: number;
  icon?: string;
  name: string;
  visible: boolean;
  route?: string;
  permission?: PermissionType;
  sort?: number;
}

interface MenuTree extends MenuItem {
  children?: MenuItem[];
}

interface ModalFormRef<T = any> {
  add?: (values?: T) => void;
  edit?: (values: T) => void;
  view?: (valeus: T) => void;
}

interface Pager {
  pageNo: number;
  pageSize: number;
}

interface ListParams extends Pager {
  column?: string;
  order?: string;
  [key: string]: any;
}

type CreateFormType = 'add' | 'edit' | 'view';
