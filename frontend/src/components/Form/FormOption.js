import style from './formOption.module.css';

const FormOption = ({ text, children }) => {
    return (
        <div className={style.formOptions}>
            <label className={style.checkboxWrapper}>
                <input type="checkbox" id="remember-me" />
                <span className={style.checkmark}></span>
                    {text}
            </label>
            {children}
        </div>
    );
}

export default FormOption;