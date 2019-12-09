import React from 'react';
import {AppBar, Toolbar, Button} from '@material-ui/core';
import {PaletteIcon} from '@material-ui/icons';

export default function TaskBar () {
    //This function is a handler to make the scrollbar go back to the top of the screen
    const handleGoToTop = () => {
        console.log('to top');
    }

    return (
        <AppBar>
            <Toolbar>
                <Button onClick={handleGoToTop()}>
                    Polaroids.com
                </Button>
            </Toolbar>
        </AppBar>
    );
}