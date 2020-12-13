import React from 'react'

const ErrorPage = () => {
    
    const styles = {
        'margin' : '100px auto',
        'textAlign' : 'center' 
    }

    return (
        <section className="error-page" style={styles}>
            <h1>404 Error Page</h1>
            <p>Sorry, This page doesn't exist</p>
        </section>
    );

    
}

export default ErrorPage







