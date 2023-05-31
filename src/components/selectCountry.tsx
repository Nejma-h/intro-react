import React, { useState, useEffect } from 'react';
import MailModal from './MailModal';

//Define country object structure
interface ICountry {
    name: {
        common: string;
        official: string;
    };
    cca2: string;
    cca3: string;
    flags: {
        png: string;
    };
}

// Define email confirmation component
const ConfirmationMessage = ({ email, onClose }: { email: string; onClose: () => void; }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Email envoyé !</h2>
                <p>Un email de confirmation a été envoyé à : {email}</p>
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};


// Define select country component
const SelectCountry = () => {
    // Define storing states
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [isMailModalOpen, setMailModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isConfirmationMessage, setConfirmationMessage] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // API call
        fetch('https://restcountries.com/v3.1/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(json => setCountries(json))
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    // Email validation
    useEffect(() => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setEmailError(emailPattern.test(email) ? '' : 'Invalid email format');
    }, [email]);

    // Handle change from dropdown
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCountries(selected);
    }

    // Remove selected country one by one
    const handleRemoveCountry = (countryCode: string) => {
        setSelectedCountries(selectedCountries.filter(code => code !== countryCode));
    };

    // Open email modal
    const openMailModal = (selectedCountries: string[]) => {
        // Only open the modal if at least one country is selected
        if (selectedCountries.length > 0) {
            setMailModalOpen(true);
        } else {
            alert("Veuillez séléctionner au moins un pays.");
        }
    };

    //Hande submit when email is valid
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (emailError === '') {
            setMailModalOpen(false);
            setConfirmationMessage(true);
        } else {
            alert("Veuillez entrer un email valide.");
        }
    };


    return (
        <div>
            <select multiple value={selectedCountries} onChange={handleChange}>
                <option value="">Selectionner des pays</option>
                {countries.map((country: ICountry, index) => (
                    <option key={index} value={country.cca2}>
                        {country.name.common}
                        <img src={country?.flags.png} alt={`${country?.name.common} flag`} />
                    </option>
                ))}
            </select>

            <p>Pays séléctionnés : {selectedCountries.map((code, index) => {
                const country = countries.find(c => c.cca2 === code);
                return (
                    <span key={`${code}-${index}`} className="tag">
                        {country?.name.common}
                        <img src={country?.flags.png} alt={`${country?.name.common} flag`} />
                        <input onClick={() => handleRemoveCountry(code)} type="button"value="✖️" />
                    </span>
                );
            })}
            </p>

            <button onClick={() => openMailModal(selectedCountries)}>Envoyer</button>

            <button onClick={() => setSelectedCountries([])}>Reset</button>

            {isMailModalOpen && (
                <MailModal onClose={() => setMailModalOpen(false)}>
                    <h2>Email</h2>
                    <p>Pays séléctionnés : {selectedCountries.join(", ")}</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Email:
                        </label>
                        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                        {emailError && <p className="error">{emailError}</p>}
                        <button type="submit">Valider</button>
                    </form>
                </MailModal>
            )}
            {isConfirmationMessage && (
                <ConfirmationMessage email={email} onClose={() => setConfirmationMessage(false)} />
            )}
        </div>
    );

}

export default SelectCountry;