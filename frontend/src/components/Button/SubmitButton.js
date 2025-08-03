import layoutStyle from "../../assets/styles/layout.module.css"
import classNames from "classnames";

const SubmitButton = ({isLarge, text, icon})=>{
    const className = classNames(
        layoutStyle.btn,
        layoutStyle.btnPrimary,
        { [layoutStyle.btnLarge]: isLarge }
    )

    return (
        <button type="submit" className={className}>
            {text}
            <i className={icon}></i>
        </button>
    )
}

export default SubmitButton;