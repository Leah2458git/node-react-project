import React, { useRef, useState } from 'react';
import { useCreateUserMutation } from '../app/userApiSlice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
    const [visible, setVisible] = useState(true);
    const [registerFunc] = useCreateUserMutation();
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate=useNavigate();
    const roles = [
        { name: 'מנהל', code: 'admin' },
        { name: 'מזכירה', code: 'secretary' },
        { name: 'רענון', code: 'refresh' },
        { name: 'זינוק', code: 'leap' },
        { name: 'וארשתיך', code: 'engaged' }
    ];

    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            password: '',
            email: ''
        },
        validate: values => {
            let errors = {};
            if (!values.name) {
                errors.name = 'שדה חובה';
            }
            if (!values.username) {
                errors.username = 'שדה חובה';
            }
            if (!values.password) {
                errors.password = 'שדה חובה';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                await registerFunc({
                    name: values.name,
                    userName: values.username,
                    password: values.password,
                    email: values.email,
                    roles: selectedRole ? selectedRole.code : ''
                });
                setVisible(false);
                navigate("/users")
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    });
    const cancle=()=>{
       setVisible(false) 
       navigate("/users")
    }
    const footerContent = (
        <div className="p-d-flex p-jc-between">
            <Button label="ביטול" icon="pi pi-times" onClick={cancle} className="p-button-text" />
            <Button label="הוסף" icon="pi pi-check" onClick={formik.handleSubmit} autoFocus />
        </div>
    );

    return (
        <div className="newUser">
            <Dialog header="הרשמה" visible={visible} style={{ minWidth: '30vw', maxWidth: '50vw', textAlign: 'center' }} onHide={() => setVisible(false)} footer={footerContent}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="name">שם</label>
                            <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={classNames({ 'p-invalid': formik.touched.name && formik.errors.name })} />
                            {formik.touched.name && <small className="p-error">{formik.errors.name}</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="username">שם משתמש</label>
                            <InputText id="username" name="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} className={classNames({ 'p-invalid': formik.touched.username && formik.errors.username })} />
                            {formik.touched.username && <small className="p-error">{formik.errors.username}</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="password">סיסמה</label>
                            <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask promptLabel="בחר סיסמה" weakLabel="סיסמה פשוטה" mediumLabel="רמת קושי בינונית" strongLabel="סיסמה מורכבת" className={classNames({ 'p-invalid': formik.touched.password && formik.errors.password })} />
                            {formik.touched.password && <small className="p-error">{formik.errors.password}</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="email">אימייל</label>
                            <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={classNames({ 'p-invalid': formik.touched.email && formik.errors.email })} />
                            {formik.touched.email && <small className="p-error">{formik.errors.email}</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="role">תפקיד</label>
                            <Dropdown id="role" value={selectedRole} options={roles} onChange={(e) => setSelectedRole(e.value)} optionLabel="name" placeholder="בחר תפקיד" />
                        </div>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default Register;
