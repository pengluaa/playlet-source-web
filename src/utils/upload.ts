import { getRequestHeader } from '@/common';
import { SUCCESS_CODE } from './request';

export interface UplaodResponse {
  name: string;
  path: string;
}

interface UploadOk extends UplaodResponse {
  error: false;
}

interface UploadErr extends Partial<UplaodResponse> {
  error: true;
}

export interface UploadFile {
  id: string;
  file?: File;
  dir?: string;
  onprogress?: (percent: number) => void; // 进度
  onSuccess?: (resp: UploadOk) => void; // 上传完成
  onFail?: (resp: UploadErr) => void; // 上传失败
}

const STATUS_OK = 200;

const upload = (file: UploadFile): XMLHttpRequest => {
  const { onprogress, onSuccess, onFail } = file;
  const formData = new FormData();
  formData.append('file', file.file ?? '');
  const xhr = new XMLHttpRequest();
  const url = `/upload?dir=${file.dir}`;
  xhr.open('post', `${BASE_API}${url}`, true);
  xhr.upload.onprogress = (e: ProgressEvent) => {
    const percent: number = Math.floor((e.loaded / e.total) * 100);
    onprogress?.(percent);
  };
  xhr.onload = () => {
    const res = JSON.parse(xhr.response);
    if (xhr.status === STATUS_OK && res.code === SUCCESS_CODE) {
      onSuccess?.({
        error: false,
        ...res.data,
      });
      return;
    }
    onFail?.({
      error: true,
      ...res?.data,
    });
  };
  xhr.onerror = () => {
    onFail?.({ error: true });
  };
  const headers: any = getRequestHeader(url);
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }
  xhr.send(formData);
  return xhr;
};

export default upload;
