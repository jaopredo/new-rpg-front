import { ReactNode } from 'react'
import styled from 'styled-components'

interface ErrorProps {
    error?: boolean,
    children?: ReactNode | ReactNode[]
}

const PointsContainer = styled.span<ErrorProps>`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1em;
    font-weight: 600;
    background-color: ${props => props.error?'#fa5454':'#1f1f1f'};
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
`

export default PointsContainer