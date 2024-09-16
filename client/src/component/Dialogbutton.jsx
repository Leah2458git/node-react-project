
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { useNavigate } from 'react-router-dom';
import { useUpdateDialogueReadMutation } from '../app/dialogApiSlice';
import { RefetchProvider } from '../context/RefetchContextD';

const Dialogbutton = (props) => {
    const navigate = useNavigate();
    // const [update, { data, isError, isSuccess }] = useUpdateDialogueReadMutation();
    const [show, setShow] = useState(false);
    const [read, setRead] = useState(props.dialogue.read);
    const date = props?.dialogue?.updatedAt?.slice(0, 10);

    const onClickButton = async () => {
        setShow(!show);
        const obj = { id: props.dialogue._id, read: "true" };
        setRead(true);
        // update(obj);
    };

    useEffect(() => {
        if (show) {
            navigate("/ShowDialogue", {
                state: {
                    dialogue: props.dialogue
                }
            });
        }
    }, [show, navigate, props.dialogue]);

    const roles = [
        { name: 'רענון', code: 'refresh' },
        { name: 'זינוק', code: 'leap' },
        { name: 'וארשתיך', code: 'engaged' }
    ];

    const originalRole=props.dialogue?.userId?.roles
    let role = roles.find(role => role.code === originalRole);
    role=role.name
    return (
        <RefetchProvider value={props.refetch}>
            <div style={{ borderColor: 'white' }}>
                <InputTextarea
                    autoResize
                    value={`נוצר ע"י: ${props?.dialogue?.userId?.name}, ${role}\t\t\t\t\tעודכן ב:${date}\t\t\t\t\t\t\tשם הדיון: ${props.dialogue.dialogueName}`}
                    style={{ width: '80%',direction:"rtl" }}
                    onClick={onClickButton}
                />
            </div>
            <br /><br />
        </RefetchProvider>
    );
};

export default Dialogbutton;
