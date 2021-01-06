import React, { Fragment } from 'react';
import { IconContext } from 'react-icons';
import { FaCog, FaLock, FaPowerOff } from 'react-icons/fa';
import { BiBarChart, BiUser } from 'react-icons/bi';
import './dropdown.scss';

const Icon = ()=>{
    return (
        <IconContext.Provider value={{
            style: {
                border: '1px solid #fff',
                borderRadius: '50%',
                fontSize: '20px',
                padding: '10px 10px',
                color: '#ff385c'
            }
        }}>
            <FaPowerOff/>
        </IconContext.Provider>
    )
}

const LockIcon = ()=>{
    return (
        <IconContext.Provider value={{ style: { border: '1px solid #fff', padding: '10px 10px', fontSize: '20px', borderRadius: '50%' }}}>
            <FaLock/>
        </IconContext.Provider>
    )
}

const SettingsIcon = ()=>{
    return (
        <IconContext.Provider value={{ style: { border: '1px solid #fff', padding: '10px 10px', fontSize: '20px', borderRadius: '50%' } }}>
            <FaCog/>
        </IconContext.Provider>
    )
}

const AnalyticsIcon = ()=>{
    return (
        <IconContext.Provider value={{ style: { border: '1px solid #fff', padding: '10px 10px', fontSize: '20px', borderRadius: '50%' } }}>
            <BiBarChart/>
        </IconContext.Provider>
    )
}

const DeveloperIcon = ()=>{
    return (
        <IconContext.Provider value={{ style: { border: '1px solid #fff', padding: '10px 10px', fontSize: '20px', borderRadius: '50%' } }}>
            <BiUser/>
        </IconContext.Provider>
    )
}

const Dropdown = ({ profile, TriggerDropdown, TriggerLogout }) => {
    return (
        <Fragment>
            <main className='dropdown' onMouseLeave={ TriggerDropdown }>
                <header className='dropdown-header'>
                    {
                        (profile) ? <img src={ profile } draggable='false' alt='profile'/> : null
                    }
                    <div className='dropdown-name'>
                        { localStorage.getItem('Username') }
                    </div>
                    <LockIcon/>
                </header>
                <nav className='dropdown-nav'>
                    <AnalyticsIcon/>
                    <div className='dropdown-nav-name'>Analytics</div>
                </nav>
                <nav className='dropdown-nav'>
                    <SettingsIcon/>
                    <div className='dropdown-nav-name'>Settings</div>
                </nav>
                <nav className='dropdown-nav'>
                    <DeveloperIcon/>
                    <div className='dropdown-nav-name'>Developer Info</div>
                </nav>
                <nav className='dropdown-nav'>
                    <Icon/>
                    <div className='dropdown-nav-name'>Logout</div>
                </nav>
            </main>
        </Fragment>
    )
}

export default Dropdown;
