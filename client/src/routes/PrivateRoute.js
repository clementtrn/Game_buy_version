import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import cookie from 'react-cookies'


function PrivateRoute({ component: Component, ...rest }) {
    const user = cookie.load("user")
    return (
        <Route
            {...rest}
            render={
                (props) => user !== undefined
                    ? <Component
                     {...props} 
                    />
                    : <Redirect to={{
                        pathname: '/login',
                    }} />
            }
        />
    )
}
export default PrivateRoute