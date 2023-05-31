import React, { useState, useEffect } from 'react';

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

//Component
const SelectCountry = () => {
    //Define storing states
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        //API call
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
    //Handle change from dropdown
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCountries(selected);
    }

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
                    <span key={`${code}-${index}`} className="tag">{country?.name.common} <img src={country?.flags.png} alt={`${country?.name.common} flag`} /></span>
                );
            })}</p>
            <button onClick={() => setSelectedCountries([])}>Reset</button>
        </div>
    );
}

export default SelectCountry;
