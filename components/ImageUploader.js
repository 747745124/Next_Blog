import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

export default function ImageUploader({ }) {
    const [uploading, setUploading] = useState(false);
    //upload progress
    const [progress, setProgress] = useState(0);
    //available when upload is completed
    const [downloadURL, setDownloadURL] = useState(null);


    //create a firestore upload task
    const uploadFile = async (e) => {

        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        // Makes reference to the storage bucket location
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = ref.put(file);

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const percent = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(percent);
        })

        //after finishing the task, get download url and set uploading to false
        task.then((d) => ref.getDownloadURL())
            .then((url) => {
                setDownloadURL(url);
                setUploading(false);
            });
    }





    return (
        <div className="box">
            <Loader show={uploading} />
            {/* if loading, show percentage */}
            {uploading && <h3>{progress}%</h3>}

            {/* //Uploading feature temporaily disabled for future bug fixes */}
            {
                !uploading && (
                    // Easier for styling
                    <>
                        <label className="btn">
                            📷 Upload Image
                            <input type="file" onChange={uploadFile} accept="image/x-png,image/png,image/gif,image/jpeg" />
                        </label>
                    </>)
            }

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
        </div>
    )
}