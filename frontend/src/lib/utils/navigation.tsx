import style from "../../styles/navigation.module.css";
import { Navigation } from "../constants/Navigation";

interface BackNavProps {
    navType: Navigation,
    onClick: () => void;
}

export const BackToNav = ({navType, onClick}: BackNavProps) => {
    const nav = navType;
    return (
        <button className={style.back_button} onClick={onClick}>
            {nav === Navigation.dashboard ? <span>⬅ Back to Dashboard </span> : <span>⬅ Back to Lesson</span>}
        </button>
       
    )
}