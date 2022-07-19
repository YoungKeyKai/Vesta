import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination';

import '../css/market.css'

export default function Market() {

    const [tiles, setTiles] = useState([
        {name: 'Fergus House'},
        {name: 'Blair House'},
        {name: 'ICON'}
    ]);

    return (
        <div className='Market'>
            <h1>Market</h1>
            <div className='market-listings'>
                {tiles.map( (tile, index) => (
                    <Card className='market-listing-card' key={index}>
                        <CardContent>
                            <h3>{tile.name}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Pagination count={10} color="secondary"/>
        </div>
    );
}
