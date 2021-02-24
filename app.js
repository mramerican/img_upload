import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from "./upload";

const firebaseConfig = {
    apiKey: "AIzaSyCJ-CzyPGRVNPFE3tqD7hOkcpUX0P5-6po",
    authDomain: "img-upload-90fe6.firebaseapp.com",
    projectId: "img-upload-90fe6",
    storageBucket: "img-upload-90fe6.appspot.com",
    messagingSenderId: "231043720489",
    appId: "1:231043720489:web:5adf8f499921e929e4c338"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, bloks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = bloks[index].querySelector('.preview-info-progress')
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log('error', error);
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('download url', url);
                })
            })
        })
    }
});