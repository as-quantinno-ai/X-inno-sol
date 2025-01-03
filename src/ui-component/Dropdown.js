import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const Icon = () => (
    <svg height="20" width="20" viewBox="0 0 20 20">
        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
    </svg>
);

// const CloseIcon = () => (
//     <svg height="20" width="20" viewBox="0 0 20 20">
//         <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
//     </svg>
// );
// const Dropdown = ({ placeHolder, options, onChange, additionalStyles })
const Dropdown = ({ placeHolder, options, onChange, additionalStyles }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const searchRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);

    useEffect(() => {
        const handler = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        window.addEventListener("click", handler);
        return () => {
            window.removeEventListener("click", handler);
        };
    });

    const onItemClick = (option) => {
        let newValue;
        if (option) {
            newValue = option;
        }

        setSelectedValue(newValue);

        onChange(newValue.value);
    };
    const handleInputClick = () => {
        setShowMenu(!showMenu);
    };

    const getDisplay = () => {
        if (!selectedValue || selectedValue.length === 0) {
            return placeHolder;
        }
        return selectedValue.label;
    };

    const isSelected = (option) => {
        if (!selectedValue) {
            return false;
        }

        return selectedValue.value === option.value;
    };

    const getOptions = () => options;

    return (
        <div className="dropdown-container" style={{ ...additionalStyles }}>
            <div
                role="button"
                onKeyDown={() => handleInputClick}
                tabIndex={0}
                ref={inputRef}
                onClick={handleInputClick}
                className="dropdown-input"
            >
                <div className="dropdown-selected-value">{getDisplay()}</div>
                <div className="dropdown-tools">
                    <div className="dropdown-tool">
                        <Icon />
                    </div>
                </div>
            </div>
            {showMenu && (
                <div className="dropdown-menu" style={{ zIndex: additionalStyles ? 6 : undefined }}>
                    {getOptions().map((option) => (
                        <div
                            onKeyDown={() => onItemClick(option)}
                            role="button"
                            tabIndex={0}
                            onClick={() => onItemClick(option)}
                            key={option.value}
                            className={`dropdown-item ${isSelected(option) && "selected"}`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    placeHolder: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    additionalStyles: PropTypes.object
};
export default Dropdown;
