import { message } from 'antd';

export const getBase64 = (file) =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

export const imageBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('You can only upload image files!');
    }
    return false;
};