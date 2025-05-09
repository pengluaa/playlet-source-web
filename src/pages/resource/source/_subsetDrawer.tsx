import { useImperativeHandle, useState, forwardRef, useEffect } from 'react';
import {
  Form,
  Input,
  Drawer,
  Switch,
  message,
  Col,
  Row,
  Card,
  Button,
  Flex,
  Space,
  Typography,
} from 'antd';
import UploadImage from '@/components/UploadImage';
import UploadFile from '@/components/UploadFile';
import {
  saveSubset as saveSubsetSv,
  getSubset as getSubsetSv,
} from './service';

interface Props {
  // onOk?: () => void;
}

interface Episode {
  id: number;
  videoId: number;
  episode: number;
  url: number;
  poster: string;
  remark: string;
}

interface EpisodeListProps {
  list: Episode[];
  onChoose?(item: Episode): void;
}

const EpisodeList = (props: EpisodeListProps) => {
  const [currentId, setCurrentId] = useState<number>(0);

  const onChoose = (item: Episode) => {
    setCurrentId(item.id);
    props.onChoose?.(item);
  };
  useEffect(() => {
    setCurrentId(props.list.at(0)?.id ?? 0);
  }, [props.list]);
  return (
    <div>
      <Space size={10} style={{ marginBottom: 12 }}>
        <Typography.Text>状态说明</Typography.Text>
        <Button size="small" color="primary" variant="solid">
          已选中
        </Button>
        <Button size="small" color="green" variant="solid">
          已上传
        </Button>
        <Button size="small" color="gold" variant="solid">
          未上传
        </Button>
      </Space>
      <Flex gap={8} wrap="wrap">
        {props.list.map((item) => (
          <Button
            key={item.id}
            style={{ width: 40 }}
            color={
              currentId === item.id ? 'primary' : item.url ? 'green' : 'gold'
            }
            variant="solid"
            onClick={() => onChoose(item)}
          >
            {item.episode}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

const SubsetDrawer = forwardRef((props: Props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>();

  const [form] = Form.useForm();

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      const { error, data } = await saveSubsetSv(values);
      setSubmitLoading(false);
      if (error) return;
      message.success('保存成功');
      const newList = [...episodeList];
      const index = newList.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        newList[index] = data;
      }
      setEpisodeList(newList);
    } catch (error) {
      // ..
    }
  };

  const onEpisodeChoose = (item: Episode) => {
    form.setFieldsValue(item);
  };

  useImperativeHandle<any, ModalFormRef>(ref, () => ({
    edit: async (values) => {
      setOpen(true);
      setIsEdit(true);
      setEpisodeList([]);
      setLoading(true);
      const { error, data } = await getSubsetSv(values.id);
      setLoading(false);
      if (error) return;
      onEpisodeChoose(data.at(0));
      setEpisodeList(data);
    },
  }));

  return (
    <Drawer
      title="子集管理"
      width={960}
      open={open}
      loading={loading}
      onClose={() => setOpen(false)}
    >
      <Row gutter={12}>
        <Col span={12}>
          <Card size="small">
            <EpisodeList list={episodeList} onChoose={onEpisodeChoose} />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Form
              form={form}
              wrapperCol={{ span: 18 }}
              labelCol={{ span: 6 }}
              onFinish={() => submit()}
            >
              <Form.Item label="id" name="id" hidden>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="描述" name="remark">
                <Input.TextArea rows={3} placeholder="请输入" />
              </Form.Item>
              <Form.Item label="视频" name="url" rules={[{ required: true }]}>
                <UploadFile accept="video/mp4" multiple={false} />
              </Form.Item>
              <Form.Item label="封面" name="poster">
                <UploadImage multiple={false} />
              </Form.Item>
              <Form.Item label=" " colon={false}>
                <Button htmlType="submit" type="primary" loading={submitLoading}>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Drawer>
  );
});

export default SubsetDrawer;
