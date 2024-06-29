import React, {FC, MouseEventHandler, ReactNode, useEffect, useReducer, useRef, useState} from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import EditModal from './components/EditModal';
import Header from './components/Header';
import {Contact, contactsReducer, State} from './reducer/contactsReducer';
import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBackspace} from '@fortawesome/free-solid-svg-icons';

const initialState: State = {
    contacts: []
};
const keys = [
    [{value: '1', text: ''}, {value: '2', text: 'ABC'}, {value: '3', text: 'DEF'}],
    [{value: '4', text: 'GHI'}, {value: '5', text: 'JKL'}, {value: '6', text: 'MNO'}],
    [{value: '7', text: 'PQRS'}, {value: '8', text: 'TUV'}, {value: '9', text: 'WXYZ'}],
    [{value: '', text: '', className: 'hidden-key'}, {value: '0', text: '', className: 'zero-key'}, {value: 'Backspace', text: ''}]
];
const NumberKeyboard: FC<{ onKeyPress: (key: string) => void, children: ReactNode, className: string }> = ({onKeyPress, children, className}) => {
    return (
        <>
            {children}
            <div className={`keyboard ${className}`}>
                {keys.map((row, rowIndex) => (
                    <div key={rowIndex} className={`keyboard-row ${rowIndex !== keys.length - 1 ? '' : 'last-row'}`}>
                        {row.map((key) => (
                            <button
                                key={key.value}
                                className={`keyboard-key ${key.className || ''} ${key.value === 'Backspace' ? 'backspace' : ''}`}
                                onClick={() => onKeyPress(key.value)}
                            >
                                {key.value === 'Backspace' ? (
                                    <FontAwesomeIcon icon={faBackspace}/>
                                ) : (
                                    <>
                                        {key.value}
                                        <div className="subtext">{key.text}</div>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </>

    );
};

function App() {
    const [inputs, setInputs] = useState(Array(6).fill(''));
    const [activeInput, setActiveInput] = useState(0);
    const [isOpenKeyBoard, setIsOpenKeyBoard] = useState(true);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleKeyPress = (key: string) => {
        const newInputs = [...inputs];

        if (key === 'Backspace') {
            if (newInputs[activeInput].length > 0) {
                newInputs[activeInput] = '';
                inputRefs.current[activeInput]?.focus();
            } else if (activeInput > 0) {
                setActiveInput(activeInput - 1);
                newInputs[activeInput - 1] = '';
                inputRefs.current[activeInput - 1]?.focus();
            }
        } else {
            newInputs[activeInput] = key;
            if (activeInput < 5) {
                setActiveInput(activeInput + 1);
            } else if (activeInput === 5 && newInputs[activeInput].length === 0) {
                newInputs[activeInput] = key;
            }
        }
        setInputs(newInputs);
    };

    return (
        <div className="App">
            <div className="inputs">
                {inputs.map((input, index) => (
                    <input
                        key={index}
                        type="tel"
                        maxLength={1}
                        value={input}
                        onClick={() => {
                            setActiveInput(index);
                            setIsOpenKeyBoard(true);
                        }}
                        ref={el => (inputRefs.current[index] = el)}
                        readOnly
                    />
                ))}
            </div>

             <NumberKeyboard className={isOpenKeyBoard ? 'open' : 'close'} onKeyPress={handleKeyPress}>
                <div className="fake-done">
                    {isOpenKeyBoard && <button onClick={() => {
                        setIsOpenKeyBoard(!isOpenKeyBoard);
                    }}>Done
                    </button>}
                </div>
             </NumberKeyboard>
        </div>
    );
}

export default App;
