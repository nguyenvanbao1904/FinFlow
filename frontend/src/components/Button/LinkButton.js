import layoutStyle from "../../assets/styles/layout.module.css"
import classNames from "classnames";
import { Link } from "react-router-dom";

const LinkButton = ({isLarge, text, icon, href})=>{
    const className = classNames(
        layoutStyle.btn,
        layoutStyle.btnPrimary,
        { [layoutStyle.btnLarge]: isLarge }
    )

    return (
        <Link to={href} className={className}>
            {text}
            <i className={icon}></i>
        </Link>
    )
}

export default LinkButton;