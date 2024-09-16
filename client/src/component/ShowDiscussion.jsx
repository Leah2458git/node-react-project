import { useEffect, useState } from 'react';
import { useUpdateDiscussionMutation } from '../app/discussionApiSlice';
import DecodeToken from '../DecodeToken';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { useLocation, useNavigate } from 'react-router-dom';

const ShowDiscussion = () => {
    const location = useLocation();
    const { discussion } = location.state || {};
    const navigate = useNavigate();
    const [updateDiscussion, { isSuccess, data }] = useUpdateDiscussionMutation();
    const [buttonValue, setButtonValue] = useState('');

    const sendMessage = () => {
        const id = discussion._id;
        const { _id } = DecodeToken();
        const obj = { id, message: { message: buttonValue, userId: _id } };
        updateDiscussion(obj);
        setButtonValue("");
    };

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess) {
            navigate('/discussions', { state: { refe: 'true', discussion: data } });
        }
    }, [isSuccess, data, navigate]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setButtonValue(prevValue => prevValue + '\n');
        }
    };

    const determineDirection = (text) => {
        const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F]/;
        return rtlChars.test(text) ? 'rtl' : 'ltr';
    };

    return (
        <div style={{ width: '100%', alignItems: 'center' }}>
            <br /><br /><br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {discussion.discussion.map((element, index) => (
            <Card
                key={index}
                title={element.name}
                style={{
                    textAlign: determineDirection(element.message) === 'rtl' ? 'right' : 'left',
                    marginTop: "10px",
                    borderRadius: '10px',
                    direction: determineDirection(element.message),
                    width: '70%',
                    backgroundColor: 'rgb(171, 231, 203)',
                    color: '#1f2937',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    unicodeBidi: 'plaintext',
                    width: '25%',
                    height: '10%',
                }}
            >
                {element.message}
            </Card>
        ))}
        </div>

            <br />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <InputTextarea
                value={buttonValue}
                onChange={(e) => setButtonValue(e.target.value)}
                onKeyDown={handleKeyDown}
                dir='rtl'
                placeholder='תגובה'
                rows={3}
                cols={20}
                style={{ 
                    width: '60%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginBottom: '10px',
                    whiteSpace: 'pre-wrap',
                }}
            />
            <button 
                onClick={sendMessage} 
                style={{ 
                    width: '150px', 
                    height: '30px',
                    backgroundColor: 'rgb(171, 231, 203)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                שלח
            </button>
        </div>

        </div>
       
    );
};

export default ShowDiscussion;
