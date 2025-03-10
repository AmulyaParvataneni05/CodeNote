import React from 'react'
import {useRouteError} from 'react-router-dom'
function RoutingError() {
    let err = useRouteError();
    return (
    <div>
        <h1 className='text-danger text-center display-1 mt-5'>{err.data}</h1>
        <h2 className='text-center display-3 text-warning'>Status {err.status} - {err.statusText}</h2>
    </div>
  )
}
export default RoutingError;