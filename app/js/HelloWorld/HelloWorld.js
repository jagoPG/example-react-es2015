import React from 'react';
import ReactDom from 'react-dom';
import fetch from 'fetch';

export class HelloWorld extends React.Component {
    render() {
        return (
            <div>
                <img className="container__icon" src='images/react.png' alt="react" />
                <p>Hello world!</p>
            </div>
        );
    }
}

ReactDom.render(
    <HelloWorld />,
    document.getElementById('container')
);