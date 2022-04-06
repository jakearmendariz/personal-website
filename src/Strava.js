import Table from './Table.js';
import React, { useState, useEffect } from 'react';


const Strava = () => {
    const [state, setState] = useState(null)

    const loadData = async () => {
        const response = await fetch("https://jakearmendariz.us/api/strava/jakes-activities");
        const data = await response.json()
        setState(data)
        console.log(data)
    }

    useEffect(() => {
        if (state == null) {
            loadData()
        }
    })
    if (state == null || state == undefined) {
        return <h1>I'm confused, why did you come here. Go away</h1>
    }
    return <Table name="Jake's Strava" table={state} />
}

export default Strava;