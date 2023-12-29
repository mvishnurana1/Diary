import { useNavigate } from "react-router-dom";
import { faFaceSadCry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './error.scss';

interface Props {
    classes?: string,
    message?: string,
    renderBackButton?: boolean
}

export function OnError(props: Props): JSX.Element {
    const navigate = useNavigate();
    const { message, classes, renderBackButton } = props;

    return (<div
        className={ 'error-container ' + classes }
        data-testid="error-emoji">
        <FontAwesomeIcon
            icon={faFaceSadCry}
            size="3x"
        />
        <span>{message ?? 'Something went wrong. Please try again later!'}</span>
        {renderBackButton && <div>
            <button
                aria-label="go back button"
                className='button red' 
                onClick={() => { console.log('Log Buttons'); navigate("/");}}>
                GO BACK
            </button>
        </div>}
    </div>)
}
