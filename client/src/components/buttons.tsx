import { Link } from 'react-router-dom';
import "./buttons.css"

const PrimaryButton: React.FC = () => {
    return (
        <div className="">
            <Link to="/books" className="primary-button">
                See Books
            </Link>
        </div>
    );
};

const SecondaryButton: React.FC = () => {
    return (
        <div className="">
            <div className="">
                <Link to="/add-book">
                    <p>secondary button</p>
                </Link>
            </div>
        </div>
    );
};

const TertiaryButton: React.FC = () => {
    return (
        <div className="">
            <div className="">
                <Link to="/add-book">
                    <p>tertiary button</p>
                </Link>
            </div>
        </div>
    );
};

export { PrimaryButton, SecondaryButton, TertiaryButton };
