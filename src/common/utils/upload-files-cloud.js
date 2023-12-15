import { utilsFireBase } from '../../config/plugins/firebase.plugin.js';

export class UploadFile {
  static async uploadToFireBase(path, data) {
    const imgRef = utilsFireBase.ref(utilsFireBase.storage, path);
    await utilsFireBase.uploadBytes(imgRef, data);

    return await utilsFireBase.getDownloadURL(imgRef);
  }

  static async uploadMultipleFilesFireBase(path, filesData, uuid) {
    const uploadPromises = filesData.map(async ({ originalname, buffer }) => {
      const filePath = `${path}/${uuid}-${originalname}`;
      const fileRef = utilsFireBase.ref(utilsFireBase.storage, filePath);

      await utilsFireBase.uploadBytes(fileRef, buffer);

      return await utilsFireBase.getDownloadURL(fileRef);
    });

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  }
}
