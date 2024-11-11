import { Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getBase64, imageBeforeUpload } from '../../util/imageUtil';

const AvatarUpload = ({ avatarUrl, onAvatarChange }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (info) => {
    if (info.file.status !== 'uploading') {
      setLoading(true);
      try {
        const base64Url = await getBase64(info.file);
        onAvatarChange(base64Url);
        message.success('Avatar uploaded successfully');
      } catch (error) {
        console.error('Failed to convert image:', error);
        message.error('Failed to convert image');
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {loading ? 'Uploading' : 'Upload Avatar'}
      </div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={imageBeforeUpload}
      onChange={handleChange}
      accept="image/*"
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="avatar" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover' 
          }} 
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default AvatarUpload; 