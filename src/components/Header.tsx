import React from "react";
import Icon from "/icon.svg";

const Header: React.FC = () => {
    const handleHeaderClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <header
            onClick={handleHeaderClick}
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ccc",
                position: "fixed",
                top: 0,
                width: "100%",
                zIndex: 1000,
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    margin: "0 10%",
                    padding: "5px 20px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <img
                    src={Icon}
                    alt="Application Icon"
                    style={{ marginRight: "10px", height: "24px" }}
                />
                <h1 style={{ fontSize: "20px" }}>Skyrim Control Mapper</h1>
            </div>
        </header>
    );
};

export default Header;
