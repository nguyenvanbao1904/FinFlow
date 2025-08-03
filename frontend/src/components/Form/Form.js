import style from './form.module.css';

const Form = ({children, onSubmit}) => {
    return (
        <form className={style.form} onSubmit={onSubmit}>
            {children}
        </form>
    );
};

export default Form;