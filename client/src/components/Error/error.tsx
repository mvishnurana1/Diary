import { faFaceSadCry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './error.scss';

export function OnError(): JSX.Element {
    return (<div
        className='error-container'
        data-testid="error-emoji">
        <FontAwesomeIcon
            icon={faFaceSadCry}
            size="3x"
        />
        <h6>Something went wrong. Please try again later!</h6>
    </div>)
}
