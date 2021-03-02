import './App.css';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core';
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

    // ALL THE CONST
  const [countries, setCountries] = useState([]);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType,setCasesType] = useState("cases")

  const [tableData, setTableData] = useState([]);
  
  const [countryInfo, setCountryInfo] = useState({});

  const [country, setCountry] = useState('worldwide')

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  const [mapZoom, setMapZoom] = useState(3);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/countries/{COUNTRY_CODE}
    // WORLDWIDE REQUEST API LINK = https://disease.sh/v3/covid-19/all

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

    // we are going to request on this api = https://disease.sh/v3/covid-19/countries
    // useeffect runs a code based on the given condition


    // all the useeffects


      useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then(data => {
          setCountryInfo(data);
        })
      }, [])


      useEffect(() => {
        const getCountriesData =  async () => {
          await fetch ("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => (
              {
                name: country.country,
                value: country.countryInfo.iso3
              }));

            const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data)
          });
        };
        getCountriesData();
      }, [])




  return (
    <div className="app">

        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
              <FormControl className="app__dropdown">
               <Select variant="outlined" onChange={onCountryChange} value={country}>
                    <MenuItem value = "worldwide">Worldwide</MenuItem>
                    {
                      countries.map(country => (
                        <MenuItem value={country.value}>{country.name}</MenuItem>
                      ))
                    }

                </Select>
              </FormControl>
          </div>

          <div className="app__stats">

            <InfoBox
              isCases
              isRed
              active={casesType === "cases"}
              onClick={e => setCasesType('cases')} 
              title="Corona Virus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={countryInfo.cases} />

            <InfoBox 
              active={casesType === "recovered"}
              onClick={e => setCasesType('recovered')}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={countryInfo.recovered} />

            <InfoBox 
              isDeath
              isOrange
              active={casesType === "deaths"}
              onClick={e => setCasesType('deaths')}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={countryInfo.deaths}/>
          </div>

         <Map
         casesType={casesType}
         countries={mapCountries}
         center={mapCenter}
         zoom={mapZoom} 
         />

      </div>

        <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide {casesType}</h3>
          {/* Graph */}
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
