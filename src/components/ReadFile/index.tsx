import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

import FileDragUpload from '../FileDragUpload';
import styles from './index.less';

interface UploadProps {
  max?: number;
  maxSize?: number; // 文件尺寸,-1不限制
  accept?: string;
  immediateUpload?: boolean;
  style?: React.CSSProperties;
  dataType?: string;
  children: React.ReactElement;
  onChange?: (value: any, name: string) => void;
}

const ReadFile: React.FC<UploadProps> = (props) => {
  const { max = -1, accept = '*', dataType = 'json' } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const multiple: boolean = max > 1 || max === -1;

  const onFileChange = (e: any): void => {
    let file: any;
    if (Array.isArray(e)) {
      file = e[0];
    } else {
      file = e.target.files[0];
    }
    if (!file) return;
    const name = file.name;
    if (!file) return;
    var fileReader = new FileReader();
    fileReader.onload = function (ev: any) {
      let importData: any[] = [];
      try {
        var data = ev.target.result;
        var workbook = XLSX.read(data, {
          type: 'binary',
        }); // 以二进制流方式读取得到整份excel表格对象
        // 存储获取到的数据
      } catch (e) {
        console.log('文件类型不正确');
        return;
      }
      let option;
      if (dataType == 'array') {
        option = {
          header: 1,
          defval: '',
        };
      }
      // 时间格式正则
      const timeReg = /^(\d{1,2})\/(\d{1,2})\/(\d{2}) (\d{2}):(\d{2})(:(\d{2}))?$/;
      
      // 遍历每张表读取
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          const currentSheet = workbook.Sheets[sheet];
          // 遍历表格数据 处理时间格式
          for (var key in currentSheet) {
            if (currentSheet.hasOwnProperty(key)) {
              if (currentSheet[key].t == 'n' && timeReg.test(currentSheet[key].w)) {
                currentSheet[key].v = dayjs(currentSheet[key].w).format('YYYY-MM-DD HH:mm:ss');
              }
            }
          }
          importData = importData.concat(
            XLSX.utils.sheet_to_json(workbook.Sheets[sheet], option),
          );
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      //在控制台打印出来表格中的数据
      props.onChange && props.onChange(importData, name);
    };
    try {
      fileReader.readAsBinaryString(file);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FileDragUpload onUpload={onFileChange}>
      <div
        style={props.style}
        className={styles.baseUpload}
        onClick={() => {
          uploadRef.current?.click();
        }}
      >
        <input
          type="file"
          ref={uploadRef}
          multiple={multiple}
          accept={accept}
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        {props.children}
      </div>
    </FileDragUpload>
  );
};

export default ReadFile;
