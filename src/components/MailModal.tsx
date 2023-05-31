interface IMailModal {
    children: React.ReactNode;
    onClose: () => void;
}

// Define email component modal
const MailModal = ({ children, onClose }: IMailModal) => {
    return (
        <div style={backdropStyle}>
            <div style={modalStyle}>
                {children}
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

// CSS
const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '1em',
    maxWidth: '90%',
    maxHeight: '80%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
    color: 'black',
};

export default MailModal;