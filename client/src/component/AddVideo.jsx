
import React, { useState, useRef, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useForm } from 'react-hook-form';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useCreateLessonVideoMutation } from '../app/videoApiSlice';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";

export default function AddVideo() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [moveList, setMoveList] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [uploadAudio, { isError, isSuccess, error }] = useCreateLessonVideoMutation();

    const [valueName, setValueName] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const roles = [
        { name: 'רענון', code: 'refresh' },
        { name: 'זינוק', code: 'leap' },
        { name: 'וארשתיך', code: 'engaged' }
    ];

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: '',
            role: '',
            path: ''
        }
    });

    useEffect(() => {
        if (moveList) {
            navigate("/videoList");
        }
    }, [moveList, navigate]);

    const customUpload = async ({ files }) => {
        const file = files[0];
        setSelectedFile(file);

        const formData = new FormData();
        formData.append('name', valueName); // הוספת השם מה-InputText
        formData.append('role', selectedRole ? selectedRole.code : '');
        formData.append('path', file);

        try {
            const response = await uploadAudio(formData).unwrap();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Video uploaded successfully' });
            reset();
            setSelectedFile(null); // Clear the selected file after upload
            setMoveList(true);
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to upload video' });
        }
    };

    const isFormValid = () => {
        return valueName.trim() !== '';
    };

    return (
        <div className="p-fluid p-grid p-formgrid">
            <Toast ref={toast} />
            <div className="p-field p-col-12">
                <InputText value={valueName} onChange={(e) => setValueName(e.target.value)} placeholder='שם הסרטה' />
            </div>
            <div className="p-field p-col-12">
                <Dropdown value={selectedRole} onChange={(e) => setSelectedRole(e.value)} options={roles} optionLabel="name"
                    placeholder="בחר הרשאה" className="w-full md:w-14rem" />
            </div>
            <div className="p-field p-col-12">
                {isFormValid() && (
                    <FileUpload 
                        name="path" 
                        customUpload 
                        accept="video/*"
                        uploadHandler={customUpload}
                        auto
                        mode='basic'
                        multiple={false}
                        onUpload={e => setUploadProgress(100)}
                        onProgress={e => setUploadProgress(Math.round((e.loaded / e.total) * 100))}
                        className="p-d-block p-mb-4"
                    />
                )}
            </div>
            {selectedFile && (
                <div className="p-field p-col-12">
                    <video controls style={{ width: '100%' }}>
                        <source src={URL.createObjectURL(selectedFile)} type="video/*" />
                        Your browser does not support the video element.
                    </video>
                    <div className="p-d-flex p-jc-center p-mt-2">
                        {!moveList && <ProgressSpinner />}
                    </div>
                </div>
            )}
        </div>
    );
}

