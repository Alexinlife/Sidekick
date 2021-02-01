import React from 'react'
import '../css/Style.css';
import NavBar from './rfc/NavBar';
import TabEtats from './rfc/TabEtats';

export default class Notifications extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <NavBar />
                </header>
                <div className="content">
                    <h1>Notifications</h1>
                    <TabEtats />
                </div>
            </div>
        )
    }
}
