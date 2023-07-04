import {Link} from 'react-router-dom';
import "./buttons.css"

const PrimaryButton = () => {
    return (
        <div className="">
                <Link to="/books" className="primary-button">
                    See Books
                </Link>
        </div>
    );
};


const SecondaryButton = () => {
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



const TertiaryButton = () => {
    return (
        <div className="">
            <div className="">
                <Link to="/add-book">
                    <p>tertiery button</p>
                </Link>
            </div>
        </div>
    );
};

export  {PrimaryButton, SecondaryButton, TertiaryButton};