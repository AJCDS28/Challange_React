import React, { useState } from 'react';
import styles from '../layout/DynamicForm.module.css'

const DynamicForm = ({ fields, onSubmit,action, options, onSucess,productsCar, onChange }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e, name) => {
        setFormData({ ...formData, [name]: e.target.value, [action]: options});
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} >
            {fields.map((field, index) => {
                return (
                    <div className={styles.form} key={index+1}>
                    <div key={index}>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(e, field.name)}
                                required={field.required}
                            >
                                <option value="">{field.placeholder}</option>
                                {field.options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(e, field.name)}
                                step={field.step}
                                min={field.min}
                                required={field.required}
                                readOnly={field.readOnly}
                            />
                        )}
                    </div>
                    </div>
                );
            })}
            <button className={styles.button_add_product} type="submit">Submit</button>
        </form>
    );
};

export default DynamicForm;
