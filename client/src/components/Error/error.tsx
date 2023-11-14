import { faFaceSadCry } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './error.scss';

interface Props {
    classes?: string,
    message?: string,
}

export function OnError(props: Props): JSX.Element {
    const { message, classes } = props;

    return (<div
        className={ 'error-container ' + classes }
        data-testid="error-emoji">
        <FontAwesomeIcon
            icon={faFaceSadCry}
            size="3x"
        />
        <h6>{message ?? 'Something went wrong. Please try again later!'}</h6>
    </div>)
}
