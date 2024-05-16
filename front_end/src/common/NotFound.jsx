import React from 'react'
import styled from 'styled-components'

function NotFound() {
  return (
    <Container>
    <div>
        Page Not Found
    </div>
    </Container>
  )
}

export default NotFound
const Container = styled.div`
       color:#fff;
       display:flex;
       justify-content:center;
       align-items:center;
       height:50vh;
`