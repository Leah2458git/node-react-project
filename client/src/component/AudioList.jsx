import React, { useEffect, useState } from 'react';
import './Article.css'
import { useGetAllAudiosQuery, useGetAudioByRoleQuery, useDeleteAudioMutation } from '../app/audioApiSlice'
import ShowAudio from './ShowAudio'
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DecodeToken from '../DecodeToken'

export default function AudioList() {
    const [deleteAudio, { isError: isDeleteError, isSuccess: isDeleteSuccess, error: deleteError }] = useDeleteAudioMutation();
    const roles = DecodeToken();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [ready, setReady] = useState(false);

    const Request = async () => {
        const ans = await axios("http://localhost:1260/api/functionToken/" + localStorage.getItem("token"))
        if (ans.data.ans === false) {
            navigate("/login")
        }
    }

    useEffect(() => {
        Request();
        setReady(true);
    }, []);

    useEffect(() => {
        // roles = DecodeToken()
    }, [ready]);

    const { data: audios, isLoading, isError, isSuccess, error, refetch } = useGetAudioByRoleQuery(roles?.roles);

    useEffect(() => {
        if (isSuccess) {
            // handle success if needed
        }
    }, [isSuccess]);

    const handleAddAudioClick = () => {
        navigate('../addAudio');
    };

    const handleEditAudioClick = (audio) => {
        navigate('/editAudio', { state: { audio } });
    };

    const handleDeleteAudioClick = async (audioId) => {
        try {
            await deleteAudio(audioId).unwrap();
            alert('Audio deleted successfully');
            refetch();
        } catch (error) {
            console.error('Failed to delete the audio: ', error);
            alert('Failed to delete the audio');
        }
    };

    const fileName = (element) => {
        let fileName = element.path.split('\\');
        return fileName[fileName.length - 1];
    };

    return (
        <div className="audio-list">
            <Button onClick={handleAddAudioClick} className="p-button-outlined p-button-primary mb-2">הוסף אודיו</Button>
            <div className="audio-items">
                {isSuccess &&
                    audios.map((element) => (
                        <div key={element._id} className="audio-item">
                            <h3>{element.name}</h3>
                            <audio
                                width="100%"
                                controls
                                onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
                                controlsList='nodownload'
                            >
                                <source src={`http://localhost:1260/uploadAudio/${element.path}`} type="audio/mp3" />
                                <source src={`http://localhost:1260/uploadAudio/${element.path}`} type="audio/mpeg" />
                                <source src={`http://localhost:1260/uploadAudio/${element.path}`} type="audio/ogg" />
                                <source src={`http://localhost:1260/uploadAudio/${element.path}`} type="audio/wav" />
                            </audio>
                            {(roles?.roles === 'admin' || roles?.roles === 'secretary') && (
                                <div className="audio-buttons">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning"
                                        onClick={() => handleEditAudioClick(element)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger"
                                        onClick={() => handleDeleteAudioClick(element._id)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
